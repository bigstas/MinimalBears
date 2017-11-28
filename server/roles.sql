-- Roles --

-- admin role for database connection (full access)
CREATE ROLE admin LOGIN
    ENCRYPTED PASSWORD 'encrypted-password-goes-here'
    SUPERUSER INHERIT CREATEDB CREATEROLE REPLICATION;

-- guest role for users that are not logged in (limited access)
CREATE ROLE guest
    NOSUPERUSER NOINHERIT NOCREATEDB NOCREATEROLE NOREPLICATION;
GRANT guest TO admin;

-- loggedin role for users that are logged in (more access)
-- access to specific user information requires a password
CREATE ROLE loggedin
    NOSUPERUSER INHERIT NOCREATEDB NOCREATEROLE NOREPLICATION;
GRANT loggedin TO admin;
