-- Roles --

-- admin role for database connection (full access)
-- change password as appropriate
CREATE ROLE admin LOGIN
    PASSWORD 'your-password-here'
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

-- moderators have access to all that loggedin have, plus to the moderation functions/tables
-- TODO: check this!
CREATE ROLE moderator
    NOSUPERUSER INHERIT NOCREATEDB NOCREATEROLE NOREPLICATION;
GRANT moderator TO admin;