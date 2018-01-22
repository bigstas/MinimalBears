-- Private schema (for user information) --

-- Note that row level security is only available from v9.5 (https://github.com/postgraphql/postgraphql/blob/master/examples/forum/TUTORIAL.md)
-- Only allow access to user data through functions

CREATE SCHEMA private;
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Tables --

-- Users, including emails and passwords
CREATE TABLE private.account (
    id serial PRIMARY KEY,
    email text NOT NULL UNIQUE CHECK (email ~* '^\S+@\S+\.\S+$'),
    password_hash text NOT NULL,
    username text NOT NULL UNIQUE,
    refresh text NOT NULL DEFAULT MD5(random()::text),  -- code for refreshing JWT tokens without a password
    interface text NOT NULL REFERENCES public.language(id) ON UPDATE CASCADE ON DELETE RESTRICT,
    custom_native text,  -- native languages we're not aware of (free text)
    tutorial bool NOT NULL DEFAULT FALSE
);

-- Users' native languages (can have more than one)
CREATE TABLE private.native (
    account integer NOT NULL REFERENCES private.account(id) ON UPDATE CASCADE ON DELETE RESTRICT,
    language text NOT NULL REFERENCES public.language(id) ON UPDATE CASCADE ON DELETE RESTRICT,
    UNIQUE (account, language)
);
CREATE INDEX ON private.native (account);

-- Make audio recordings refer to accounts
ALTER TABLE public.audio
    ADD CONSTRAINT audio_speaker_fkey
    FOREIGN KEY (speaker)
    REFERENCES private.account(id)
    ON UPDATE CASCADE ON DELETE RESTRICT;
ALTER TABLE public.audio_submission
    ADD CONSTRAINT audio_submission_speaker_fkey
    FOREIGN KEY (speaker)
    REFERENCES private.account(id)
    ON UPDATE CASCADE ON DELETE RESTRICT;

-- Account information except for password hash and refresh token
CREATE VIEW private.account_info AS (
    SELECT id, email, username, interface, custom_native, tutorial,
        (SELECT ARRAY(
            SELECT language FROM private.native
            WHERE private.native.account = private.account.id
        )) AS native
    FROM private.account
);

-- Users' practice sessions (one row per answered question)
CREATE TABLE private.practice (
    account integer NOT NULL REFERENCES private.account(id) ON UPDATE CASCADE ON DELETE RESTRICT,
    stamp timestamp NOT NULL DEFAULT now(),
    pair integer NOT NULL REFERENCES public.pair(id) ON UPDATE CASCADE ON DELETE RESTRICT,
    audio text NOT NULL REFERENCES public.audio(file) ON UPDATE CASCADE ON DELETE RESTRICT,
    correct boolean NOT NULL,
    PRIMARY KEY (account, stamp)
);
CREATE INDEX ON private.practice (account);
-- (currently no check that the audio's item is one element of the pair)

-- Authentication functions --
-- These allow controlled access to the private schema

-- Create a new user account
-- (the password will be stored hashed, for security)
CREATE FUNCTION public.signup(email text, password text, username text, interface text, native_array text[], custom_native text)
    RETURNS integer
    LANGUAGE plpgsql
    SECURITY DEFINER
    VOLATILE
    AS $$
        DECLARE
            new_account private.account;
            native_lang text;
        BEGIN
	        INSERT INTO private.account (email, password_hash, username, interface, custom_native) VALUES (
                email,
                crypt(password, gen_salt('bf')),
                username,
                interface,
                custom_native
            )
            RETURNING * INTO new_account;
            
            FOREACH native_lang IN ARRAY native_array
            LOOP
                INSERT INTO private.native (account, language)
                VALUES (new_account.id, native_lang);
            END LOOP;
        
            RETURN new_account.id;
        END;
    $$;
    
-- The JWT type which will be signed by PostGraphQL 
-- The role can be accessed using current_setting('jwt.claims.id')::integer
CREATE TYPE public.json_web_token AS (
    role text,
    id integer
);

-- Refresh tokens allow a JWT to be refreshed without entering a password
CREATE TYPE public.token_pair AS (
    jwt json_web_token,
    refresh text
);

CREATE FUNCTION private.check_password(account_id integer, try_password text)
    RETURNS private.account
    LANGUAGE plpgsql
    STRICT
    SECURITY DEFINER
    STABLE
    AS $$
        DECLARE
            found_account private.account;
        BEGIN
            SELECT * INTO found_account
                FROM private.account
                WHERE id = account_id;
            IF found_account.password_hash = crypt(try_password, found_account.password_hash)
            THEN
                RETURN found_account;
            ELSE
                RAISE EXCEPTION 'Password does not match';
            END IF;
        END;
    $$;

-- Check password and generate a JWT
CREATE FUNCTION public.authenticate(account_id integer, try_password text)
    RETURNS token_pair
    LANGUAGE plpgsql
    STRICT
    SECURITY DEFINER
    VOLATILE  -- so that the function is treated as a mutation, not a query
    AS $$
        DECLARE
            found_account private.account;
        BEGIN
            found_account := private.check_password(account_id, try_password);
            RETURN (('loggedin', found_account.id)::json_web_token,
                    found_account.refresh)::token_pair;
        END;
    $$;

CREATE FUNCTION public.authenticate_from_email(try_email text, try_password text)
    RETURNS token_pair
    LANGUAGE SQL
    STRICT
    SECURITY DEFINER
    VOLATILE  -- so that the function is treated as a mutation, not a query
    AS $$
        SELECT public.authenticate((SELECT id FROM private.account WHERE email = try_email),
                                   try_password);
    $$;

CREATE FUNCTION public.authenticate_from_username(try_username text, try_password text)
    RETURNS token_pair
    LANGUAGE SQL
    STRICT
    SECURITY DEFINER
    VOLATILE  -- so that the function is treated as a mutation, not a query
    AS $$
        SELECT public.authenticate((SELECT id FROM private.account WHERE username = try_username),
                                   try_password);
    $$;

-- Generate a fresh JWT, using a refresh token
CREATE FUNCTION public.refresh(refresh_token text)
    RETURNS json_web_token
    LANGUAGE plpgsql
    STRICT
    SECURITY DEFINER
    VOLATILE  -- so that the function is treated as a mutation, not a query
    AS $$
        DECLARE
            found_account private.account;
            my_id integer := current_setting('jwt.claims.id');
        BEGIN
            SELECT * INTO found_account
                FROM private.account
                WHERE id = my_id;
            
            IF found_account.refresh = refresh_token
            THEN
                RETURN ('loggedin', my_id)::json_web_token;
            ELSE
                RAISE EXCEPTION 'Invalid refresh token';
            END IF;
        END;
    $$;

-- Create a new refresh code
-- (e.g. to invalidate the old code, in case of someone's account being compromised)
CREATE FUNCTION public.new_refresh_token(try_password text)
    RETURNS text
    LANGUAGE plpgsql
    STRICT
    SECURITY DEFINER
    VOLATILE
    AS $$
        DECLARE
            found_account private.account;
            my_id integer := current_setting('jwt.claims.id');
            new_token text := MD5(random()::text);
        BEGIN
            found_account := private.check_password(my_id, try_password);
            
            UPDATE private.account
                SET refresh = new_token
                WHERE id = my_id;
            
            RETURN new_token;
        END;
    $$;

-- Account maintenance functions --

-- Get safe user information (no password or refresh token)
CREATE FUNCTION public.get_account_info()
    RETURNS private.account_info
    LANGUAGE SQL
    SECURITY DEFINER
    STABLE
    AS $$
        SELECT *
        FROM private.account_info
        WHERE id = current_setting('jwt.claims.id')
    $$;

-- Record that a user has completed the tutorial for the record page
CREATE FUNCTION public.complete_tutorial()
    RETURNS void
    LANGUAGE SQL
    SECURITY DEFINER
    VOLATILE
    AS $$
        UPDATE private.account
        SET tutorial = TRUE
        WHERE id = current_setting('jwt.claims.id')::integer
    $$;

-- Training and stats functions --

-- Record a user's answer to a question
CREATE FUNCTION public.answer_question(pair integer, audio text, correct boolean)
    RETURNS void
    LANGUAGE SQL
    SECURITY DEFINER
    VOLATILE
    AS $$
        INSERT INTO private.practice (account, pair, audio, correct)
        VALUES (current_setting('jwt.claims.id'), pair, audio, correct);
    $$;

-- number and average for each contrast, and in total, for a chosen period of time

-- names and types to match count and sum functions
CREATE TYPE public.stats AS (
    stamp timestamp,
    contrast text,
    count bigint,
    sum bigint
);

CREATE TYPE private.contrast_practice AS (
    contrast integer,
    stamp timestamp,
    correct boolean
);

CREATE FUNCTION public.get_practices(unit text, number integer)
    RETURNS SETOF private.contrast_practice
    LANGUAGE SQL
    SECURITY DEFINER
    STABLE
    AS $$
        SELECT public.get_contrast_id(pair) AS contrast,
            date_trunc(unit, stamp) AS stamp,
            correct
        FROM private.practice
        WHERE account = current_setting('jwt.claims.id')::integer
            AND stamp > date_trunc(unit, now()) - number * ('1 ' || unit)::interval
    $$;
-- TODO timezone?
-- SET TIME ZONE TO ... ;

CREATE FUNCTION public.get_all_stats(language_id text, unit text, number integer)
    RETURNS SETOF stats
    LANGUAGE SQL
    STABLE
    AS $$
        SELECT stamp,
            public.get_contrast_name(contrast) AS contrast,
            count(*),
            sum(correct::integer)
        FROM public.get_practices(unit, number)
        WHERE public.get_contrast_language_id(contrast) = language_id
        GROUP BY stamp, contrast
    $$;

CREATE FUNCTION public.get_contrast_avg(contrast_id integer, unit text, number integer)
    RETURNS numeric
    LANGUAGE SQL
    STABLE
    AS $$
        SELECT avg(correct::integer)
        FROM public.get_practices(unit, number)
        WHERE contrast = contrast_id
    $$;

CREATE FUNCTION public.get_practice_languages(unit text, number integer)
    RETURNS SETOF text
    LANGUAGE SQL
    STABLE
    AS $$
        SELECT DISTINCT public.get_contrast_language_id(contrast)
        FROM public.get_practices(unit, number)
    $$;

-- Permissions --

REVOKE ALL ON SCHEMA public FROM PUBLIC;
GRANT ALL ON SCHEMA public TO "admin";

-- All users can read public information
GRANT USAGE ON SCHEMA public TO guest, loggedin;
GRANT SELECT ON TABLE public.audio TO guest, loggedin;
GRANT SELECT ON TABLE public.contrast TO guest, loggedin;
GRANT SELECT ON TABLE public.item TO guest, loggedin;
GRANT SELECT ON TABLE public.language TO guest, loggedin;
GRANT SELECT ON TABLE public.pair TO guest, loggedin;
GRANT SELECT ON TABLE public.interface_language TO guest, loggedin;
GRANT SELECT ON TABLE public.training_language TO guest, loggedin;
GRANT EXECUTE ON FUNCTION public.get_text(integer) TO guest, loggedin;
GRANT EXECUTE ON FUNCTION public.get_random_examples(integer, integer) TO guest, loggedin;
GRANT EXECUTE ON FUNCTION public.get_contrasts_with_examples(text, integer) TO guest, loggedin;
GRANT EXECUTE ON FUNCTION public.get_random_audio(integer) TO guest, loggedin;
GRANT EXECUTE ON FUNCTION public.get_questions(integer, integer) TO guest, loggedin;
GRANT EXECUTE ON FUNCTION public.get_contrast_id(integer) TO guest, loggedin;
GRANT EXECUTE ON FUNCTION public.get_contrast_name(integer) TO guest, loggedin;
GRANT EXECUTE ON FUNCTION public.get_language_id(integer) TO guest, loggedin;
GRANT EXECUTE ON FUNCTION public.get_items_from_string(text) TO guest, loggedin;

-- Logged in users can submit new recordings, and use the refresh code
GRANT EXECUTE ON FUNCTION public.complete_tutorial() TO loggedin;
GRANT EXECUTE ON FUNCTION public.get_items_to_record(text, integer) TO loggedin;
GRANT EXECUTE ON FUNCTION public.get_account_info() TO loggedin;
GRANT EXECUTE ON FUNCTION public.answer_question(integer, text, boolean) TO loggedin;
GRANT EXECUTE ON FUNCTION public.get_practices(text, integer) TO loggedin;
GRANT EXECUTE ON FUNCTION public.submit_audio(bytea, integer, integer) TO loggedin;
GRANT EXECUTE ON FUNCTION public.get_all_stats(text, text, integer) TO loggedin;
GRANT EXECUTE ON FUNCTION public.get_contrast_avg(integer, text, integer) TO loggedin;
GRANT EXECUTE ON FUNCTION public.get_practice_languages(text, integer) TO loggedin;
GRANT INSERT ON TABLE public.audio_submission TO loggedin;
GRANT SELECT ON TABLE public.audio_submission TO loggedin;
GRANT USAGE ON SEQUENCE public.audio_submission_id_seq TO loggedin;
GRANT EXECUTE ON FUNCTION public.refresh(text) TO loggedin;
GRANT EXECUTE ON FUNCTION public.new_refresh_token(text) TO loggedin;

-- Guests can sign up or log in
GRANT EXECUTE ON FUNCTION public.signup(text, text, text, text, text[], text) TO guest;
GRANT EXECUTE ON FUNCTION public.authenticate(integer, text) TO guest;
GRANT EXECUTE ON FUNCTION public.authenticate_from_email(text, text) TO guest;
GRANT EXECUTE ON FUNCTION public.authenticate_from_username(text, text) TO guest;
