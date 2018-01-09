-- Private schema (for user information) --

-- Note that row level security is only available from v9.5 (https://github.com/postgraphql/postgraphql/blob/master/examples/forum/TUTORIAL.md)
-- Only allow access to user data through functions

CREATE SCHEMA private;
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Users, including emails and passwords --
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

-- Native languages (can have more than one)
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

-- Public functions --
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
            -- TODO check password length
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

-- TODO get user information (except for refresh token)

-- Record that a user has completed the tutorial for the record page
CREATE FUNCTION public.complete_tutorial()
    RETURNS boolean
    LANGUAGE SQL
    SECURITY DEFINER
    VOLATILE
    AS $$
        UPDATE private.account
        SET tutorial = TRUE
        WHERE id = current_setting('jwt.claims.id')
    $$;

-- TODO training information --

CREATE TABLE private.practice (
    account integer NOT NULL REFERENCES private.account(id) ON UPDATE CASCADE ON DELETE RESTRICT,
    stamp timestamp NOT NULL DEFAULT now(),
    pair integer NOT NULL REFERENCES public.pair(id) ON UPDATE CASCADE ON DELETE RESTRICT,
    audio text NOT NULL REFERENCES public.audio(file) ON UPDATE CASCADE ON DELETE RESTRICT,
    correct boolean NOT NULL,
    PRIMARY KEY (account, stamp)
);
CREATE INDEX ON private.practice (account);

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
GRANT EXECUTE ON FUNCTION public.get_items_from_string(text) TO guest, loggedin;

-- Logged in users can submit new recordings, and use the refresh code
GRANT EXECUTE ON FUNCTION public.complete_tutorial() TO loggedin;
GRANT EXECUTE ON FUNCTION public.submit_audio(bytea, integer, integer) TO loggedin;
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
