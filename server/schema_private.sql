-- Permissions --

-- All users can read public information
GRANT USAGE ON SCHEMA public TO guest, loggedin;
GRANT SELECT ON TABLE public.audio TO guest, loggedin;
GRANT SELECT ON TABLE public.contrast TO guest, loggedin;
GRANT SELECT ON TABLE public.item TO guest, loggedin;
GRANT SELECT ON TABLE public.language TO guest, loggedin;
GRANT SELECT ON TABLE public.pair TO guest, loggedin;
GRANT SELECT ON TABLE public.contrast_nonempty TO guest, loggedin;
GRANT SELECT ON TABLE public.contrast_with_pairs TO guest, loggedin;
GRANT SELECT ON TABLE public.item_with_audio TO guest, loggedin;
GRANT EXECUTE ON FUNCTION public.get_audio_list(integer) TO guest, loggedin;
GRANT EXECUTE ON FUNCTION public.get_contrast_list(integer) TO guest, loggedin;
GRANT EXECUTE ON FUNCTION public.get_contrasts(integer) TO guest, loggedin;
GRANT EXECUTE ON FUNCTION public.get_items_from_homophone(text) TO guest, loggedin;
GRANT EXECUTE ON FUNCTION public.get_pair_list(integer) TO guest, loggedin;

-- Logged in users can submit new recordings
GRANT EXECUTE ON FUNCTION public.submit_audio(bytea, text, integer) TO loggedin;
GRANT INSERT ON TABLE public.audio_submission TO loggedin;
GRANT SELECT ON TABLE public.audio_submission TO loggedin;
GRANT USAGE ON SEQUENCE public.audio_submission_id_seq TO loggedin;


-- Private schema (for user information) --

CREATE SCHEMA private;
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Table of emails and passwords --

CREATE TABLE private.account (
    id serial PRIMARY KEY,
    email text NOT NULL UNIQUE CHECK (email ~* '^\S+@\S+\.\S+$'),
    password_hash text NOT NULL,
    username text NOT NULL UNIQUE,
    refresh text NOT NULL DEFAULT MD5(random()::text)  -- code for refreshing JWT tokens without a password
);
ALTER TABLE private.account OWNER TO "admin";

-- Row level security is available from v9.5
-- With v9.4, there is no direct access to tables with user data (access only through functions) 


-- Public functions --
-- These allow controlled access to the private schema

-- Create a new row in private.account, using the email and password,
-- storing the password hashed,
-- and returning the id of the new account

CREATE FUNCTION signup(email text, password text, username text)
    RETURNS integer
    LANGUAGE plpgsql
    STRICT
    SECURITY DEFINER
    VOLATILE
    AS $$
        DECLARE
            new_account private.account;
        BEGIN
            INSERT INTO private.account (email, password_hash, username) VALUES (
                email,
                crypt(password, gen_salt('bf')),
                username
            )
            RETURNING * INTO new_account;
        
            RETURN new_account.id;
        END;
    $$;
ALTER FUNCTION public.signup(text, text, text) OWNER TO admin;
GRANT EXECUTE ON FUNCTION public.signup(text, text, text) TO guest;

-- The JWT type which will be signed by PostGraphQL 
-- The role can be accessed using current_setting('jwt.claims.id')::integer

CREATE TYPE json_web_token AS (
    role text,
    id integer,
    username text,
    refresh text  -- refresh code in database, so it can be revoked
);
ALTER TYPE json_web_token OWNER TO admin;

-- Generate a JWT,
-- checking the email and password with private.account

CREATE FUNCTION authenticate(try_email text, try_password text)
    RETURNS json_web_token
    LANGUAGE plpgsql
    STRICT
    SECURITY DEFINER
    VOLATILE  -- so that the function is treated as a mutation, not a query
    AS $$
        DECLARE
            found_account private.account;
        BEGIN
            SELECT * INTO found_account
                FROM private.account
                WHERE email = try_email;
        
            IF found_account.password_hash = crypt(try_password, found_account.password_hash)
            THEN
                RETURN ('loggedin',
                    found_account.id,
                    found_account.username,
                    found_account.refresh)::json_web_token;
            ELSE
                RETURN NULL;
            END IF;
        END;
    $$;
ALTER FUNCTION public.authenticate(text, text) OWNER TO admin;
GRANT EXECUTE ON FUNCTION public.authenticate(text, text) TO guest;

-- Generate a fresh JWT, using the refresh code

CREATE FUNCTION refresh()
    RETURNS json_web_token
    LANGUAGE plpgsql
    STRICT
    SECURITY DEFINER
    VOLATILE  -- so that the function is treated as a mutation, not a query
    AS $$
        DECLARE
            found_account private.account;
            my_id integer := current_setting('jwt.claims.id');
            my_username text := current_setting('jwt.claims.username');
            my_refresh text := current_setting('jwt.claims.refresh');
        BEGIN
            SELECT * INTO found_account
                FROM private.account
                WHERE id = my_id;
            
            IF found_account.refresh = my_refresh
            THEN
                RETURN ('loggedin',
                    my_id,
                    my_username,
                    my_refresh)::json_web_token;
            ELSE
                RETURN NULL;
            END IF;
        END;
    $$;
ALTER FUNCTION public.refresh() OWNER TO admin;
GRANT EXECUTE ON FUNCTION public.refresh() TO loggedin;

-- Create a new refresh code
-- (e.g. to invalidate the old code, in case of someone's account being compromised)

CREATE FUNCTION new_refresh_code()
    RETURNS json_web_token
    LANGUAGE plpgsql
    STRICT
    SECURITY DEFINER
    VOLATILE  -- so that the function is treated as a mutation, not a query
    AS $$
        DECLARE
            my_id integer := current_setting('jwt.claims.id');
            my_username text := current_setting('jwt.claims.username');
            new_code text := MD5(random()::text);
        BEGIN
            UPDATE private.account
                SET refresh = new_code
                WHERE id = my_id;
            
            RETURN ('loggedin',
                my_id,
                my_username,
                new_code)::json_web_token;
        END;
    $$;
ALTER FUNCTION public.new_refresh_code() OWNER TO admin;
GRANT EXECUTE ON FUNCTION public.new_refresh_code() TO loggedin;

-- TODO training information --

CREATE TABLE private.practice (
    account integer REFERENCES private.account(id) ON UPDATE CASCADE ON DELETE CASCADE,
    stamp timestamp NOT NULL DEFAULT now(),
    pair integer REFERENCES pair(id) ON UPDATE CASCADE ON DELETE CASCADE,
    correct boolean NOT NULL,
    PRIMARY KEY (account, stamp)
);
ALTER TABLE private.practice OWNER TO "admin";
