﻿-- Boilerplate --

SET statement_timeout = 0;
SET client_encoding = 'SQL_ASCII';
SET standard_conforming_strings = ON;
SET check_function_bodies = FALSE;
SET client_min_messages = warning;
SET search_path = public, pg_catalog;
SET default_tablespace = '';
SET default_with_oids = FALSE;

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
    name text NOT NULL, -- TODO we should also not have two languages of the same name!
    interface bool NOT NULL,  -- whether available as the interface language
    training bool NOT NULL,  -- whether available as a training language
    recording bool NOT NULL  -- whether we are looking for recordings
);
CREATE INDEX ON language (interface);
CREATE INDEX ON language (training);
CREATE INDEX ON language (recording);

CREATE VIEW interface_language AS (
    SELECT * FROM language
    WHERE interface
);

CREATE VIEW training_language AS (
    SELECT * FROM language
    WHERE training
);

CREATE VIEW recording_language AS (
    SELECT * FROM language
    WHERE recording
);

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
    file text PRIMARY KEY,  -- filename
    speaker text NOT NULL,  -- will reference account username
    item integer NOT NULL REFERENCES item (id) ON UPDATE CASCADE ON DELETE RESTRICT,
    stamp timestamp NOT NULL
);
CREATE INDEX ON audio (item);
CREATE INDEX ON audio (speaker);

-- For unique file names
CREATE SEQUENCE audio_file;

-- Audio moderation
CREATE TABLE audio_moderation (
    file text REFERENCES audio (file) ON UPDATE CASCADE ON DELETE RESTRICT,
    moderator text NOT NULL,  -- will reference account username
    stamp timestamp NOT NULL DEFAULT now(),
    approved boolean NOT NULL,
    PRIMARY KEY (file, moderator, stamp)
);
CREATE INDEX ON audio_moderation (file);
CREATE INDEX ON audio_moderation (moderator);

-- Audio editing
CREATE TABLE audio_edit (
    file text REFERENCES audio (file) ON UPDATE CASCADE ON DELETE RESTRICT,
    moderator text NOT NULL,  -- will reference account username
    stamp timestamp NOT NULL,
    from_start interval,  -- trim the start and end of the audio file
    from_end interval,
    volume double precision,  -- scale the volume of the audio file
    PRIMARY KEY (file, moderator, stamp)
);

-- Moderated audio recordings
CREATE VIEW approved_audio AS (
    SELECT
        audio.file,
        audio.speaker,
        audio.item,
        audio.stamp,
        latest_moderation.moderator,
        latest_moderation.stamp as moderator_stamp
    FROM audio
    INNER JOIN (
        SELECT
        DISTINCT ON (file)
        *
        FROM audio_moderation
        ORDER BY file, stamp
    ) latest_moderation
    ON audio.file = latest_moderation.file
    WHERE approved = TRUE
);

CREATE VIEW pending_audio AS (
    SELECT
        audio.file,
        audio.speaker,
        audio.item,
        audio.stamp
    FROM audio
    LEFT JOIN audio_moderation
    ON audio.file = audio_moderation.file
    WHERE audio_moderation.approved = NULL
);

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

CREATE FUNCTION get_text (item_id integer)
    RETURNS text
    LANGUAGE SQL
    STABLE
    AS $$
        SELECT homophones[1]  -- TODO choose a random homophone?
        FROM item
        WHERE id = item_id
    $$;

CREATE FUNCTION public.get_item_id(file text)
    RETURNS integer
    LANGUAGE SQL
    STABLE
    AS $$
        SELECT item
        FROM audio
        WHERE file = file
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
-- This records a file being saved (outside the database)
CREATE FUNCTION submit_audio(file text, speaker text, item integer)
    RETURNS void
    LANGUAGE SQL
    VOLATILE
    AS $$
        INSERT INTO audio (file, speaker, item, stamp)
        VALUES (file, speaker, item, now())
    $$;

-- Get a new file name
CREATE FUNCTION next_audio()
    RETURNS integer
    LANGUAGE SQL
    VOLATILE
    AS $$
        SELECT nextval('audio_file')
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
        FROM approved_audio
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
                -- we will only return a file for one item in the pair,
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
-- TODO don't get items that the user has already recorded
CREATE FUNCTION get_items_to_record(language_id text, number integer)
    RETURNS SETOF item
    LANGUAGE SQL
    SECURITY DEFINER -- because public needs access to this function, but pending_audio is for moderators only
    STABLE
    AS $$
        SELECT *
        FROM item
        WHERE language = language_id
        ORDER BY (
            SELECT count(*)
            FROM approved_audio
            WHERE item = item.id
        ) + 0.9 * (
            SELECT count(*)
            FROM pending_audio
            WHERE item = item.id
        )
        LIMIT number
    $$;

-- TODO allow moderator to extend contrast, pair, item...
