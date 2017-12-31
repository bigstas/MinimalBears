CREATE OR REPLACE FUNCTION public.signup(email text, password text, username text)
    RETURNS integer
    LANGUAGE plpgsql
    STRICT
    SECURITY DEFINER
    VOLATILE
    AS $$
        DECLARE
            new_account private.account;
        BEGIN
            INSERT INTO private.account (email, password_hash, username, interface, native) VALUES (
                email,
                crypt(password, gen_salt('bf')),
                username,
                1,  -- TODO choose interface language
                {1}  -- TODO choose native languages
            )
            RETURNING * INTO new_account;
        
            RETURN new_account.id;
        END;
    $$;