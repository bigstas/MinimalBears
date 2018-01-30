-- Boilerplate --

SET statement_timeout = 0;
SET client_encoding = 'SQL_ASCII';
SET standard_conforming_strings = on;
SET check_function_bodies = false;
SET client_min_messages = warning;
SET search_path = public, pg_catalog;
SET default_tablespace = '';
SET default_with_oids = false;

-- Security --

ALTER DEFAULT PRIVILEGES REVOKE ALL ON TABLES FROM PUBLIC;
ALTER DEFAULT PRIVILEGES REVOKE ALL ON SEQUENCES FROM PUBLIC;
ALTER DEFAULT PRIVILEGES REVOKE ALL ON FUNCTIONS FROM PUBLIC;
ALTER DEFAULT PRIVILEGES GRANT ALL ON TYPES TO PUBLIC;  -- No data in a type
ALTER DEFAULT PRIVILEGES GRANT ALL ON TABLES TO admin;
ALTER DEFAULT PRIVILEGES GRANT ALL ON SEQUENCES TO admin;
ALTER DEFAULT PRIVILEGES GRANT ALL ON FUNCTIONS TO admin;
ALTER DEFAULT PRIVILEGES GRANT ALL ON TYPES TO admin;

-- Tables --

-- Languages (both those being learnt and those for the user interface)
CREATE TABLE language (
    id text PRIMARY KEY,
    name text NOT NULL,
    interface bool NOT NULL,  -- whether available as the interface language
    training bool NOT NULL  -- whether available as a training language
);
CREATE INDEX ON language (interface);
CREATE INDEX ON language (training);

CREATE VIEW interface_language AS (
    SELECT * FROM language
    WHERE interface
);

CREATE VIEW training_language AS (
    SELECT * FROM language
    WHERE training
);

-- TODO: a function to look up what languages we are currently recording audio for

-- Contrasts in the above languages
CREATE TABLE contrast (
    language text NOT NULL REFERENCES language (id) ON UPDATE CASCADE ON DELETE RESTRICT,
    name text NOT NULL,
    id serial PRIMARY KEY,
    ready boolean NOT NULL
);
CREATE INDEX ON contrast (language); 
CREATE INDEX ON contrast (language) WHERE ready;

-- Items in the above languages
CREATE TABLE item (
    language text NOT NULL REFERENCES language (id) ON UPDATE CASCADE ON DELETE RESTRICT,
    homophones text[] NOT NULL CHECK (homophones != '{}'),  -- not in 1st normal form, which would make the constraint difficult
    id serial PRIMARY KEY,
    comment text  -- optionally clarify the pronunciation
);
CREATE INDEX ON item (language);

-- Audio recordings
CREATE TABLE audio (
    file text PRIMARY KEY,
    speaker integer NOT NULL,  -- will reference user id
    item integer NOT NULL REFERENCES item (id) ON UPDATE CASCADE ON DELETE RESTRICT
);
CREATE INDEX ON audio (item);

-- Minimal pairs
CREATE TABLE pair (
    contrast integer NOT NULL REFERENCES contrast (id) ON UPDATE CASCADE ON DELETE RESTRICT,
    first integer NOT NULL REFERENCES item (id) ON UPDATE CASCADE ON DELETE RESTRICT,
    second integer NOT NULL REFERENCES item (id) ON UPDATE CASCADE ON DELETE RESTRICT,
    id serial PRIMARY KEY
);
CREATE INDEX ON pair (contrast);

-- Force the contrast and items to be from the same language
-- (Function to be used in a trigger)
CREATE FUNCTION check_language()
    RETURNS trigger
    LANGUAGE PLPGSQL
    STABLE
    AS $$
        DECLARE
            contrast_lang text;
            first_lang text;
            second_lang text;
        BEGIN
            SELECT language INTO contrast_lang
                FROM contrast
                WHERE contrast.id = NEW.contrast;
            SELECT language INTO first_lang
                FROM item
                WHERE item.id = NEW.first;
            SELECT language INTO second_lang
                FROM item
                WHERE item.id = NEW.second;
            IF contrast_lang = first_lang
                AND contrast_lang = second_lang
            THEN
                RETURN NEW;
            ELSE
                RAISE EXCEPTION 'Languages of contrast and items do not match';
            END IF;
        END;
    $$;

CREATE TRIGGER check_language_trigger BEFORE INSERT OR UPDATE
    ON pair
    FOR EACH ROW
    EXECUTE PROCEDURE check_language();

-- Submissions of audio recordings
CREATE TABLE audio_submission (
  file bytea NOT NULL,
  speaker integer NOT NULL,  -- will reference user id
  item integer NOT NULL REFERENCES item (id) ON UPDATE CASCADE ON DELETE RESTRICT,
  id serial PRIMARY KEY
);
CREATE INDEX ON audio_submission (item);

-- Util functions --

CREATE FUNCTION public.get_contrast_id(pair_id integer)
    RETURNS integer
    LANGUAGE SQL
    STABLE
    AS $$
        SELECT contrast
        FROM pair
        WHERE id = pair_id
    $$;

CREATE FUNCTION public.get_contrast_name(contrast_id integer)
    RETURNS text
    LANGUAGE SQL
    STABLE
    AS $$
        SELECT name
        FROM contrast
        WHERE id = contrast_id
    $$;

CREATE FUNCTION public.get_contrast_language_id(contrast_id integer)
    RETURNS text
    LANGUAGE SQL
    STABLE
    AS $$
        SELECT language
        FROM contrast
        WHERE id = contrast_id
    $$;

CREATE FUNCTION public.get_item_language_id(item_id integer)
    RETURNS text
    LANGUAGE SQL
    STABLE
    AS $$
        SELECT language
        FROM item
        WHERE id = item_id
    $$;

-- Get list of possible items, from a given string
-- (if this function is used often, homophones should be put into their own table, not as an array)
CREATE FUNCTION get_items_from_string(string text)
    RETURNS SETOF item
    LANGUAGE SQL
    STABLE
    AS $$
        SELECT *
        FROM item
        WHERE string = ANY(homophones)
    $$;

-- User functions --

-- For a user to submit their audio recordings
CREATE FUNCTION submit_audio(file bytea, speaker integer, item integer)
    RETURNS integer
    LANGUAGE SQL
    VOLATILE 
    AS $$
        INSERT INTO audio_submission (file, speaker, item)
        VALUES (file, speaker, item)
        RETURNING id;
    $$;

-- Get the list of contrasts for a given language, each with a random set of examples
-- First define the return type (and a type for an example word pair)
-- Then define a function mapping item ids to words
-- Then define a function randomly choosing a subset for one contrast
-- Finally define the function applying this to each contrast in a language

CREATE TYPE text_pair AS (
    first text,
    second text
);

CREATE TYPE contrast_with_examples AS (
    name text,
    id integer,
    examples text_pair[]
);

CREATE FUNCTION get_text (item_id integer)
    RETURNS text
    LANGUAGE SQL
    STABLE
    AS $$
        SELECT homophones[1]  -- TODO choose a random homophone?
        FROM item
        WHERE id = item_id
    $$;

CREATE FUNCTION get_random_examples(contrast_id integer, number integer)
    RETURNS text_pair[]
    LANGUAGE SQL
    STABLE
    AS $$
        SELECT ARRAY(
            SELECT (get_text(first), get_text(second))::text_pair
            FROM pair
            WHERE contrast = contrast_id
            ORDER BY RANDOM()
            LIMIT number
        )
    $$;

CREATE FUNCTION get_contrasts_with_examples(language_id text, number integer)
    RETURNS SETOF contrast_with_examples
    LANGUAGE SQL
    STABLE
    AS $$
        SELECT (name, id, get_random_examples(id, number))::contrast_with_examples
        FROM contrast
        WHERE ready AND language = language_id
    $$;

-- Get questions for a training session
-- First define the return type
-- Then define a function 
-- Finally define a function applying this to each contrast in a language

CREATE TYPE question AS (
    pair integer,
    first text,
    second text,
    file text,
    correct integer
);

CREATE FUNCTION get_random_audio(item_id integer)
    RETURNS text
    LANGUAGE SQL
    STABLE
    AS $$
        SELECT file
        FROM audio
        WHERE item = item_id
        ORDER BY RANDOM()
    $$;

CREATE FUNCTION get_questions(contrast_id integer, number integer)
    RETURNS SETOF question
    LANGUAGE plpgsql
    STABLE
    AS $$
        DECLARE
            coin integer;  -- 0 (first) or 1 (second)
            this_pair pair;
            file text;
            first_file text;
            second_file text;
            count integer := 0;
        BEGIN
            FOR this_pair IN
               SELECT * FROM pair
               WHERE contrast = contrast_id
               ORDER BY RANDOM()
            LOOP
                -- we will only return a file for one item in th pair,
                -- but both items should have at least one file
                first_file := get_random_audio(this_pair.first);
                second_file := get_random_audio(this_pair.second);
                CONTINUE WHEN first_file IS NULL OR second_file IS NULL;
                -- randomly choose one item
                coin := FLOOR(RANDOM() * 2);  -- 0 or 1
                IF coin = 0
                THEN
                    file := first_file;
                ELSE
                    file := second_file;
                END IF;
                RETURN NEXT (this_pair.id,
                             get_text(this_pair.first),
                             get_text(this_pair.second),
                             file,
                             coin)::question;
                count := count + 1;
                EXIT WHEN count = number;
            END LOOP;
            RETURN;
        END;
    $$;

-- Get items to record, choosing those that have not been recorded many times
CREATE FUNCTION get_items_to_record(language_id text, number integer)
    RETURNS SETOF item
    LANGUAGE SQL
    STABLE
    AS $$
        SELECT *
        FROM item
        WHERE language = language_id
        ORDER BY (
            SELECT count(*)
            FROM audio
            WHERE item = item.id
        ) + 0.9 * (
            SELECT count(*)
            FROM audio_submission
            WHERE item = item.id 
        )
        LIMIT number
    $$;

-- TODO moderate audio submissions
-- TODO allow moderator to extend contrast, pair, item...
