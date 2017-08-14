-- Admin role, change password as appropriate

CREATE ROLE admin LOGIN
  PASSWORD 'your-password-here'
  SUPERUSER INHERIT CREATEDB CREATEROLE REPLICATION;
