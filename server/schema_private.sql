-- Private schema (for user information) --

-- Note that row level security is only available from v9.5 (https://github.com/postgraphql/postgraphql/blob/master/examples/forum/TUTORIAL.md)
-- Only allow access to user data through functions

CREATE SCHEMA private;
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Tables --

-- Users, including emails and passwords
CREATE TABLE private.account (
    username text PRIMARY KEY,
    email text NOT NULL UNIQUE CHECK (email ~* '^\S+@\S+\.\S+$'),
    password_hash text NOT NULL,
    refresh text NOT NULL DEFAULT MD5(random()::text),  -- code for refreshing JWT tokens without a password
    interface text NOT NULL REFERENCES public.language(id) ON UPDATE CASCADE ON DELETE RESTRICT,
    custom_native text,  -- native languages we're not aware of (free text)
    tutorial bool NOT NULL DEFAULT FALSE
);

-- Users' native languages (can have more than one)
CREATE TABLE private.native (
    account text NOT NULL REFERENCES private.account(username) ON UPDATE CASCADE ON DELETE RESTRICT,
    language text NOT NULL REFERENCES public.language(id) ON UPDATE CASCADE ON DELETE RESTRICT,
    PRIMARY KEY (account, language)
);
CREATE INDEX ON private.native (account);

-- Moderators
CREATE TABLE private.moderator (
    account text NOT NULL REFERENCES private.account(username) ON UPDATE CASCADE ON DELETE RESTRICT,
    language text NOT NULL REFERENCES public.language(id) ON UPDATE CASCADE ON DELETE RESTRICT,
    PRIMARY KEY (account, language)
);
CREATE INDEX ON private.moderator (account);
CREATE INDEX ON private.moderator (language);

-- Make audio recordings refer to accounts
ALTER TABLE public.audio
    ADD CONSTRAINT audio_speaker_fkey
    FOREIGN KEY (speaker)
    REFERENCES private.account(username)
    ON UPDATE CASCADE ON DELETE RESTRICT;
ALTER TABLE public.audio_moderation
    ADD CONSTRAINT audio_moderation_moderator_fkey
    FOREIGN KEY (moderator)
    REFERENCES private.account(username)
    ON UPDATE CASCADE ON DELETE RESTRICT;

-- Account information except for password hash and refresh token
CREATE VIEW private.account_info AS (
    SELECT username, email, interface, custom_native, tutorial,
        (SELECT ARRAY(
            SELECT language FROM private.native
            WHERE private.native.account = private.account.username
        )) AS native,
        (SELECT ARRAY(
            SELECT language FROM private.moderator
            WHERE private.moderator.account = private.account.username
        )) AS moderator
    FROM private.account
);

-- Users' practice sessions (one row per answered question)
CREATE TABLE private.practice (
    account text NOT NULL REFERENCES private.account(username) ON UPDATE CASCADE ON DELETE RESTRICT,
    stamp timestamp NOT NULL DEFAULT now(),
    pair integer NOT NULL REFERENCES public.pair(id) ON UPDATE CASCADE ON DELETE RESTRICT,
    audio text NOT NULL REFERENCES public.audio(file) ON UPDATE CASCADE ON DELETE RESTRICT,
    correct boolean NOT NULL,
    PRIMARY KEY (account, stamp)
);
CREATE INDEX ON private.practice (account);
-- (currently no check that the audio's item is one element of the pair)

CREATE TABLE private.guest_practice (
    stamp timestamp NOT NULL DEFAULT now(),
    pair integer NOT NULL REFERENCES public.pair(id) ON UPDATE CASCADE ON DELETE RESTRICT,
    audio text NOT NULL REFERENCES public.audio(file) ON UPDATE CASCADE ON DELETE RESTRICT,
    correct boolean NOT NULL
);

-- Authentication functions --
    
-- The JWT type which will be signed by PostGraphQL 
-- The role can be accessed using current_setting('jwt.claims.username')
CREATE TYPE public.json_web_token AS (
    role text,
    username text
);

-- Refresh tokens allow a JWT to be refreshed without entering a password
CREATE TYPE public.token_pair AS (
    jwt json_web_token,
    refresh text
);

CREATE FUNCTION private.generate_jwt()
    RETURNS json_web_token
    LANGUAGE plpgsql
    STABLE
    AS $$
        DECLARE
            my_username text := current_setting('jwt.claims.username');
            n_moderator bigint;
        BEGIN
            SELECT count(*) INTO n_moderator
               FROM private.moderator
               WHERE account = current_setting('jwt.claims.username');

            IF n_moderator = 0
            THEN
                RETURN ('loggedin', my_username)::json_web_token;
            ELSE
                RETURN ('moderator', my_username)::json_web_token;
            END IF;
        END;
    $$;

-- Create a new user account
-- (the password will be stored hashed, for security)
CREATE FUNCTION public.signup(username text, email text, password text, interface text, native_array text[], custom_native text)
    RETURNS token_pair
    LANGUAGE plpgsql
    SECURITY DEFINER
    VOLATILE
    AS $$
        DECLARE
            new_account private.account;
            native_lang text;  -- loop variable
        BEGIN
            INSERT INTO private.account (username, email, password_hash, interface, custom_native) VALUES (
                username,
                email,
                crypt(password, gen_salt('bf')),
                interface,
                custom_native
            )
            RETURNING * INTO new_account;
            
            FOREACH native_lang IN ARRAY native_array
            LOOP
                INSERT INTO private.native (account, language)
                VALUES (username, native_lang);
            END LOOP;
            
            RETURN (('loggedin', username)::json_web_token,
                    new_account.refresh)::token_pair;
        END;
    $$;

CREATE FUNCTION private.check_password(try_username text, try_password text)
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
                WHERE username = try_username;
            IF found_account.password_hash = crypt(try_password, found_account.password_hash)
            THEN
                RETURN found_account;
            ELSE
                RAISE EXCEPTION 'Password does not match';
            END IF;
        END;
    $$;

-- Check password and generate a JWT and a refresh token
CREATE FUNCTION public.authenticate(try_username text, try_password text)
    RETURNS token_pair
    LANGUAGE plpgsql
    STRICT
    SECURITY DEFINER
    VOLATILE  -- so that the function is treated as a mutation, not a query
    AS $$
        DECLARE
            found_account private.account;
        BEGIN
            found_account := private.check_password(try_username, try_password);
            RETURN (private.generate_jwt(),
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
        SELECT public.authenticate((SELECT username FROM private.account WHERE email = try_email),
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
            my_username text := current_setting('jwt.claims.username');
        BEGIN
            SELECT * INTO found_account
                FROM private.account
                WHERE username = my_username;
            
            IF found_account.refresh = refresh_token
            THEN
                RETURN private.generate_jwt();
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
            my_username text := current_setting('jwt.claims.username');
            new_token text := MD5(random()::text);
        BEGIN
            found_account := private.check_password(my_username, try_password);
            
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
        WHERE username = current_setting('jwt.claims.username')
    $$;

-- TODO: want to be able to get all usernames to be able to tell a joining user whether their username is unique in real time
-- probably don't want to do the same with email addresses, as this is more sensitive information

CREATE TYPE public.recording_history AS (
    recorded bigint,
    approved bigint,
    rejected bigint -- calculate pending client-side by recorded - (approved + rejected)
);

-- Get user's audio recording history (to tell them, out of appreciation)
-- TODO - requires testing
CREATE FUNCTION public.get_account_recording_history()
    RETURNS public.recording_history
    LANGUAGE SQL
    SECURITY DEFINER
    STABLE
    AS $$
        DECLARE
            my_username text := current_setting('jwt.claims.username');
            recorded bigint;
        BEGIN
            SELECT COUNT(*) AS "recorded",
            SUM( CASE
                WHEN audio_moderation.approved = 'true' THEN 1
                ELSE 0
                END
            ) AS "approved",
            SUM( CASE
                WHEN audio_moderation.approved = 'false' THEN 1
                ELSE 0
                END
            ) AS "rejected"
            FROM audio INNER JOIN audio_moderation
            ON audio.file = audio_moderation.file
            WHERE audio.speaker=my_username;
        END
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
        WHERE username = current_setting('jwt.claims.username')
    $$;

-- Training and stats functions --

-- Record a user's answer to a question
CREATE FUNCTION public.answer_question(pair integer, audio text, correct boolean)
    RETURNS void
    LANGUAGE plpgsql
    SECURITY DEFINER
    VOLATILE
    AS $$
        -- requires PGSQL v9.6 (otherwise need to catch error)
        DECLARE
            username text := current_setting('jwt.claims.username', TRUE);
        BEGIN
            IF username IS NOT NULL
            THEN
                INSERT INTO private.practice (account, pair, audio, correct)
                VALUES (username, pair, audio, correct);
            ELSE
                INSERT INTO private.guest_practice (pair, audio, correct)
                VALUES (pair, audio, correct);
            END IF;
        END
    $$;

-- number and average for each contrast, and in total, for a chosen period of time

-- names and types to match count and sum functions
CREATE TYPE public.stats AS (
    stamp timestamp,
    contrast text,  -- name
    count bigint,
    sum bigint
);

CREATE TYPE public.contrast_practice AS (
    contrast integer,  -- id
    stamp timestamp,
    correct boolean
);

-- Get all practices for the current user, in a period of time
CREATE FUNCTION public.get_practices(unit text, number integer)
    RETURNS SETOF contrast_practice
    LANGUAGE SQL
    SECURITY DEFINER
    STABLE
    AS $$
        SELECT public.get_contrast_id(pair) AS contrast,
            date_trunc(unit, stamp) AS stamp,
            correct
        FROM private.practice
        WHERE account = current_setting('jwt.claims.username')
            AND stamp > date_trunc(unit, now()) - number * ('1 ' || unit)::interval
    $$;
-- TODO timezone?
-- SET TIME ZONE TO ... ;

-- Stats for one language, for periods of time
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

-- Performance for one contrast
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

CREATE FUNCTION public.get_num_audio()
    RETURNS bigint
    LANGUAGE SQL
    SECURITY DEFINER
    STABLE
    AS $$
        SELECT count(*)
        FROM public.audio
        WHERE speaker = current_setting('jwt.claims.username')
    $$;

-- Moderation functions --

-- Throw an error if the current user is not a moderator for the language
-- Otherwise, do nothing
CREATE FUNCTION public.check_moderator(language_id text)
    RETURNS void
    LANGUAGE plpgsql
    SECURITY DEFINER
    STABLE
    AS $$
        BEGIN
            IF EXISTS (
               SELECT *
               FROM private.moderator
               WHERE language = language_id
                   AND account = current_setting('jwt.claims.username')
            ) 
            THEN
            ELSE
               RAISE EXCEPTION 'Not a moderator for this language';
            END IF;
        END;
    $$;

CREATE FUNCTION public.check_moderator_for_file(file text)
    RETURNS void
    LANGUAGE plpgsql
    STABLE
    AS $$
        DECLARE
            item_id integer;
            language_id text;
        BEGIN
            item_id := public.get_item_id(file);
            language_id := public.get_item_language_id(item_id);
            SELECT public.check_moderator(language_id);
        END;
    $$;

-- Get some audio files that need to be moderated
CREATE FUNCTION public.get_audio_submissions(language_id text, number integer)
    RETURNS SETOF audio
    LANGUAGE plpgsql
    STABLE
    AS $$
        BEGIN
            SELECT public.check_moderator(language_id);
            SELECT *
                FROM public.pending_audio
                WHERE public.get_item_language_id(item) = language_id
                LIMIT number;
        END;
    $$;
-- if there are many submissions across many languages,
-- it might be worth defining an index on audio_submission for the language
-- however, get_item_language_id would have to be falsely labelled as IMMUTABLE
-- this is okay as long as there are never mistakes in an item's language

-- Moderate an audio file
CREATE FUNCTION public.moderate_audio(file text, approved boolean)
    RETURNS void
    LANGUAGE plpgsql
    VOLATILE
    AS $$
        BEGIN
            SELECT public.check_moderator_for_file(file);
            INSERT INTO public.audio_moderation (file, moderator, stamp, approved)
                VALUES (file, current_setting('jwt.claims.username'), now(), approved);
        END;
    $$;

-- Edit an audio file (update metadata relevant to edit)
CREATE FUNCTION public.edit_audio(file text, from_start interval, from_end interval, volume double precision)
    RETURNS void
    LANGUAGE plpgsql
    VOLATILE
    AS $$
        BEGIN
            SELECT public.check_moderator_for_file(file);
            INSERT INTO public.audio_edit (file, moderator, stamp, from_start, from_end, volume)
                VALUES (file, current_setting('jwt.claims.username'), now(), from_start, from_end, volume);
        END;
    $$;

-- Complaint/flagging tables
CREATE TABLE private.audio_complaint (
-- note that "user" is an SQL reserved word, can't call any column that
    username text NOT NULL REFERENCES private.account(username) ON UPDATE CASCADE ON DELETE RESTRICT,
    audio text NOT NULL REFERENCES audio (file) ON UPDATE CASCADE ON DELETE RESTRICT
);

CREATE TABLE private.pair_complaint (
    username text NOT NULL REFERENCES private.account(username) ON UPDATE CASCADE ON DELETE RESTRICT,
    pair integer NOT NULL REFERENCES pair (id) ON UPDATE CASCADE ON DELETE RESTRICT
);

CREATE TABLE private.item_complaint (
    username text NOT NULL REFERENCES private.account(username) ON UPDATE CASCADE ON DELETE RESTRICT,
    item integer NOT NULL REFERENCES item (id) ON UPDATE CASCADE ON DELETE RESTRICT
);

-- Complaint/flagging functions (for above)
CREATE FUNCTION public.submit_audio_complaint(file text)
    RETURNS void
    LANGUAGE SQL
    SECURITY DEFINER
    VOLATILE
    AS $$
        INSERT INTO private.audio_complaint (username, audio)
            VALUES (current_setting('jwt.claims.username'), file)
    $$;

CREATE FUNCTION public.submit_pair_complaint(pair integer)
    RETURNS void
    LANGUAGE SQL
    SECURITY DEFINER
    VOLATILE
    AS $$
        INSERT INTO private.pair_complaint (username, pair)
            VALUES (current_setting('jwt.claims.username'), pair)
    $$;

CREATE FUNCTION public.submit_item_complaint(item integer)
    RETURNS void
    LANGUAGE SQL
    SECURITY DEFINER
    VOLATILE
    AS $$
        INSERT INTO private.item_complaint (username, item)
            VALUES (current_setting('jwt.claims.username'), item)
    $$;


-- Permissions --

REVOKE ALL ON SCHEMA public FROM PUBLIC;
GRANT ALL ON SCHEMA public TO "admin";

-- All users can read public information
GRANT USAGE ON SCHEMA public TO anyuser;
GRANT SELECT ON TABLE public.contrast TO anyuser;
GRANT SELECT ON TABLE public.item TO anyuser;
GRANT SELECT ON TABLE public.language TO anyuser;
GRANT SELECT ON TABLE public.pair TO anyuser;
GRANT SELECT ON TABLE public.interface_language TO anyuser;
GRANT SELECT ON TABLE public.training_language TO anyuser;
GRANT SELECT ON TABLE public.approved_audio TO anyuser;
-- Util
GRANT EXECUTE ON FUNCTION public.get_contrast_id(integer) TO anyuser;
GRANT EXECUTE ON FUNCTION public.get_contrast_name(integer) TO anyuser;
GRANT EXECUTE ON FUNCTION public.get_contrast_language_id(integer) TO anyuser;
GRANT EXECUTE ON FUNCTION public.get_item_language_id(integer) TO anyuser;
GRANT EXECUTE ON FUNCTION public.get_text(integer) TO anyuser;
GRANT EXECUTE ON FUNCTION public.get_item_id(text) TO anyuser;
GRANT EXECUTE ON FUNCTION public.get_items_from_string(text) TO anyuser;
-- Training
GRANT EXECUTE ON FUNCTION public.get_random_examples(integer, integer) TO anyuser;
GRANT EXECUTE ON FUNCTION public.get_contrasts_with_examples(text, integer) TO anyuser;
GRANT EXECUTE ON FUNCTION public.get_random_audio(integer) TO anyuser;
GRANT EXECUTE ON FUNCTION public.get_questions(integer, integer) TO anyuser;
GRANT EXECUTE ON FUNCTION public.answer_question(integer, text, boolean) TO anyuser;

-- Logged in users
-- Authentication
GRANT EXECUTE ON FUNCTION public.refresh(text) TO loggedin;
GRANT EXECUTE ON FUNCTION public.new_refresh_token(text) TO loggedin;
-- General account management
GRANT EXECUTE ON FUNCTION public.get_account_info() TO loggedin;
GRANT EXECUTE ON FUNCTION public.complete_tutorial() TO loggedin;
-- Stats
GRANT EXECUTE ON FUNCTION public.get_practices(text, integer) TO loggedin;
GRANT EXECUTE ON FUNCTION public.get_all_stats(text, text, integer) TO loggedin;
GRANT EXECUTE ON FUNCTION public.get_contrast_avg(integer, text, integer) TO loggedin;
GRANT EXECUTE ON FUNCTION public.get_practice_languages(text, integer) TO loggedin;
GRANT EXECUTE ON FUNCTION public.get_num_audio() TO loggedin;
-- Recordings
GRANT SELECT ON TABLE public.recording_language TO loggedin;
GRANT EXECUTE ON FUNCTION public.get_items_to_record(text, integer) TO loggedin;
GRANT INSERT ON TABLE public.audio TO loggedin;
GRANT USAGE ON SEQUENCE public.audio_file TO loggedin;
GRANT EXECUTE ON FUNCTION public.submit_audio(text, text, integer) TO loggedin;
GRANT EXECUTE ON FUNCTION public.next_audio() TO loggedin;
-- Flagging issues
GRANT EXECUTE ON FUNCTION public.submit_audio_complaint(text) TO loggedin;
GRANT EXECUTE ON FUNCTION public.submit_pair_complaint(integer) TO loggedin;
GRANT EXECUTE ON FUNCTION public.submit_item_complaint(integer) TO loggedin;

-- Guests can sign up or log in
GRANT EXECUTE ON FUNCTION public.signup(text, text, text, text, text[], text) TO guest;
GRANT EXECUTE ON FUNCTION public.authenticate(text, text) TO guest;
GRANT EXECUTE ON FUNCTION public.authenticate_from_email(text, text) TO guest;

-- Moderators can approve and reject audio
GRANT SELECT ON TABLE public.audio TO moderator;
GRANT SELECT ON TABLE public.pending_audio TO moderator;
GRANT SELECT ON TABLE public.audio_moderation TO moderator;
GRANT INSERT ON TABLE public.audio_moderation TO moderator;
GRANT SELECT ON TABLE public.audio_edit TO moderator;
GRANT INSERT ON TABLE public.audio_edit TO moderator;
GRANT EXECUTE ON FUNCTION public.check_moderator(text) TO moderator;
GRANT EXECUTE ON FUNCTION public.check_moderator_for_file(text) TO moderator;
GRANT EXECUTE ON FUNCTION public.get_audio_submissions(text, integer) TO moderator;
GRANT EXECUTE ON FUNCTION public.moderate_audio(text, boolean) TO moderator;
GRANT EXECUTE ON FUNCTION public.edit_audio(text, interval, interval, double precision) TO moderator;
