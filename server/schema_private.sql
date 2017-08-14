-- Roles 

-- guest role for users that are not logged in (limited access)
CREATE ROLE guest
    NOSUPERUSER NOINHERIT NOCREATEDB NOCREATEROLE NOREPLICATION;
GRANT guest TO admin;

-- loggedin role for users that are loggied in (more access)
-- access to specific user information requires a password
CREATE ROLE loggedin
    NOSUPERUSER INHERIT NOCREATEDB NOCREATEROLE NOREPLICATION;
GRANT loggedin TO admin;

-- Permissions

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
GRANT UPDATE ON TABLE public.audio_submission TO loggedin;
GRANT EXECUTE ON FUNCTION public.submit_audio(bytea, text, integer) TO loggedin;

-- Guests can log in and sign up
GRANT EXECUTE ON FUNCTION public.authenticate(text, text) TO guest;
GRANT EXECUTE ON FUNCTION public.signup(text, text) TO guest;


-- Private schema (for user information)

CREATE SCHEMA private;
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Table of emails and passwords

CREATE SEQUENCE private."Accounts_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

ALTER TABLE private."Accounts_id_seq" OWNER TO "admin";

CREATE TABLE private.account (
    id integer PRIMARY KEY DEFAULT nextval('private."Accounts_id_seq"'::regclass),
    email text NOT NULL UNIQUE CHECK (email ~* '^\S+@\S+\.\S+$'),
    password_hash text NOT NULL
);

ALTER TABLE private.account OWNER TO "admin";

ALTER SEQUENCE private."Accounts_id_seq" OWNED BY private.account.id;

-- Row level security is available from v9.5
-- With v9.4, there is no direct access to tables with user data (access only through functions) 


-- Functions in the public schema, which allow controlled access to the private schema

-- Create a new row in private.account, using the email and password,
-- storing the password hashed,
-- and returning the id of the new account

CREATE FUNCTION signup(email text, password text)
RETURNS integer
LANGUAGE plpgsql
STRICT
SECURITY DEFINER
VOLATILE
AS $$
    DECLARE
        new_account private.account;
    BEGIN
        INSERT INTO private.account (email, password_hash) VALUES (
            email,
            crypt(password, gen_salt('bf'))
        )
        RETURNING * INTO new_account;
    
        RETURN new_account.id;
    END;
$$;
ALTER FUNCTION signup(text, text)
  OWNER TO admin;

-- The JWT type which will be signed by PostGraphQL 
-- The role can be accessed using current_setting('jwt.claims.id')::integer

CREATE TYPE json_web_token AS (
    role text,
    id integer
);
ALTER TYPE json_web_token
    OWNER TO admin;

-- Generate a JWT,
-- checking the email and password with private.account

CREATE FUNCTION authenticate(try_email text, try_password text)
RETURNS jwt_token
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
        WHERE email = try_email;
    
        IF found_account.password_hash = crypt(try_password, found_account.password_hash) THEN
            RETURN ('loggedin', found_account.id)::json_web_token;
        ELSE
            RETURN NULL;
        END IF;
    END;
$$;
ALTER FUNCTION authenticate(text, text)
    OWNER TO admin;
