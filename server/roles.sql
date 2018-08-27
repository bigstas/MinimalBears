-- Roles --

-- admin role for database connection (full access)
-- change password as appropriate
CREATE ROLE admin LOGIN
    PASSWORD 'your-password-here'
    SUPERUSER INHERIT CREATEDB CREATEROLE REPLICATION;

-- guest role for users that are not logged in (limited access)
CREATE ROLE guest
    NOSUPERUSER INHERIT NOCREATEDB NOCREATEROLE NOREPLICATION;
GRANT guest TO admin;

-- loggedin role for users that are logged in (more access)
-- access to specific user information requires a password
CREATE ROLE loggedin
    NOSUPERUSER INHERIT NOCREATEDB NOCREATEROLE NOREPLICATION;
GRANT loggedin TO admin;

-- moderator role
CREATE ROLE moderator
    NOSUPERUSER INHERIT NOCREATEDB NOCREATEROLE NOREPLICATION;
GRANT loggedin TO moderator;
GRANT moderator TO admin;

-- combined role for guests and logged in users
CREATE ROLE anyuser
    NOSUPERUSER INHERIT NOCREATEDB NOCREATEROLE NOREPLICATION;
GRANT anyuser TO guest;
GRANT anyuser TO loggedin;
