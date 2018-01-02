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

-- Languages being learnt
CREATE TABLE language (
    id text PRIMARY KEY,
    name text NOT NULL,
    interface bool NOT NULL  -- whether available as the interface language
);

-- Contrasts in the above languages
CREATE TABLE contrast (
    language text NOT NULL REFERENCES language(id) ON UPDATE CASCADE ON DELETE RESTRICT,
    name text NOT NULL,
    id serial PRIMARY KEY
);

-- Items in the above languages
CREATE TABLE item (
    language text NOT NULL REFERENCES language(id) ON UPDATE CASCADE ON DELETE RESTRICT,
    homophones text[] NOT NULL,
    id serial PRIMARY KEY,
    comment text  -- optionally clarify the pronunciation
);

-- Audio recordings
CREATE TABLE audio (
    file text NOT NULL,
    speaker integer NOT NULL,  -- will reference user id
    item integer NOT NULL REFERENCES item(id) ON UPDATE CASCADE ON DELETE RESTRICT,
    id serial PRIMARY KEY
);

-- Minimal pairs
CREATE TABLE pair (
    contrast integer NOT NULL REFERENCES contrast(id) ON UPDATE CASCADE ON DELETE RESTRICT,
    first integer NOT NULL REFERENCES item(id) ON UPDATE CASCADE ON DELETE RESTRICT,
    second integer NOT NULL REFERENCES item(id) ON UPDATE CASCADE ON DELETE RESTRICT,
    id serial PRIMARY KEY
);

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
  item integer NOT NULL REFERENCES item(id) ON UPDATE CASCADE ON DELETE RESTRICT,
  id serial PRIMARY KEY
);

-- Views --

-- Item table extended with cache of audio files
-- Rather than storing the audio ids, we can store the filepaths
-- First define a function, then define the view
CREATE FUNCTION get_audio_list(item_id integer) RETURNS text[]
    LANGUAGE SQL
    STABLE
    AS $$SELECT ARRAY(SELECT file FROM audio WHERE audio.item = item_id);$$;

CREATE MATERIALIZED VIEW item_with_audio AS
    SELECT item.language,
        item.homophones,
        item.id,
        item.comment,
        get_audio_list(item.id) AS audio_list
    FROM item;

-- Contrast table extended with cache of minimal pairs
-- Rather than storing the pair ids, we can store pairs of item ids (cached_pair type)
-- Define the return type of the function, then the function, then the view
CREATE TYPE cached_pair AS (
    first integer,
    second integer
);

CREATE FUNCTION get_pair_list(contrast_id integer) RETURNS cached_pair[]
    LANGUAGE SQL
    STABLE
    AS $$SELECT ARRAY(  -- return as an array, not as a table
        SELECT (pair.first, pair.second)::cached_pair  -- return a pair, of type cached_pair
        FROM pair
        WHERE pair.contrast = contrast_id  -- only pairs for this contrast
            AND (SELECT audio_list FROM item_with_audio WHERE id = pair.first) != '{}'  -- items must have audio
            AND (SELECT audio_list FROM item_with_audio WHERE id = pair.second) != '{}'
    );$$;

CREATE MATERIALIZED VIEW contrast_with_pairs AS
    SELECT contrast.language,
        contrast.name,
        contrast.id,
        get_pair_list(contrast.id) AS pairs
    FROM contrast;

-- Contrast table filtered to include only those with a nonempty list of pairs
CREATE MATERIALIZED VIEW contrast_nonempty AS
    SELECT contrast_with_pairs.language,
        contrast_with_pairs.name,
        contrast_with_pairs.id
    FROM contrast_with_pairs
    WHERE (contrast_with_pairs.pairs != '{}');

-- Interface languages
CREATE MATERIALIZED VIEW interface_language AS
    SELECT * FROM language
    WHERE interface = TRUE;

-- Functions --

-- For a user to submit their audio recordings
CREATE FUNCTION submit_audio(
    file bytea,
    speaker integer,
    item integer)
    RETURNS integer
    LANGUAGE SQL VOLATILE 
    AS $$INSERT INTO audio_submission (file, speaker, item)
        VALUES (file, speaker, item)
        RETURNING id;$$;

-- Get list of contrasts for a given language, each with a random set of examples
-- First define the return type (and a type for an example word pair)
-- Then define a function mapping item ids to words
-- Then define a function randomly choosing a subset

CREATE TYPE text_pair AS (
    first text,
    second text
);

CREATE TYPE contrast_with_examples AS (
    name text,
    id integer,
    examples text_pair[]
);

CREATE FUNCTION get_text (item_id integer) RETURNS text
    LANGUAGE SQL
    STABLE
    AS $$
        SELECT homophones[1] FROM item WHERE item.id = item_id
    $$;

CREATE FUNCTION get_text(id_pair cached_pair) RETURNS text_pair
    LANGUAGE SQL
    STABLE
    AS $$
        SELECT (get_text(id_pair.first), get_text(id_pair.second))::text_pair
    $$;

CREATE FUNCTION get_random_examples(pair_list cached_pair[]) RETURNS text_pair[]
    LANGUAGE SQL
    STABLE
    AS $$
        SELECT ARRAY(
            SELECT get_text((first, second))
                FROM UNNEST(pair_list)
                ORDER BY RANDOM()
                LIMIT 5
        );
    $$;
-- Next step: get the contrasts for a language, with a random set of examples
-- First define a type for the contrasts

-- Now define the function
CREATE FUNCTION get_contrasts_with_examples(language_id text) RETURNS SETOF contrast_with_examples
    LANGUAGE SQL
    STABLE
    AS $$
        SELECT (name, id, get_random_examples(pairs))::contrast_with_examples
            FROM contrast_with_pairs
            WHERE language = language_id
                AND pairs != '{}'
    $$;

-- Get list of possible items, from a given string
CREATE FUNCTION get_items_from_string(string text) RETURNS SETOF item
    LANGUAGE SQL
    STABLE
    AS $$SELECT * FROM item WHERE string = ANY(homophones)$$;

-- Ownership --

ALTER TABLE language OWNER TO admin;
ALTER TABLE contrast OWNER TO admin;
ALTER TABLE item OWNER TO admin;
ALTER TABLE audio OWNER TO admin;
ALTER TABLE pair OWNER TO admin;
ALTER FUNCTION check_language() OWNER TO admin;  -- (the trigger check_language_trigger is part of the language table)
ALTER TABLE audio_submission OWNER TO admin;
ALTER FUNCTION get_audio_list(item_id integer) OWNER TO admin;
ALTER TABLE item_with_audio OWNER TO admin;
ALTER TYPE cached_pair OWNER TO admin;
ALTER FUNCTION get_pair_list(contrast_id integer) OWNER TO admin;
ALTER TABLE contrast_with_pairs OWNER TO admin;
ALTER TABLE contrast_nonempty OWNER TO admin;
ALTER TABLE interface_language OWNER TO admin;
ALTER FUNCTION submit_audio(bytea, integer, integer) OWNER TO admin;
ALTER TYPE text_pair OWNER TO admin;
ALTER TYPE contrast_with_examples OWNER TO admin;
ALTER FUNCTION get_text(integer) OWNER TO admin;
ALTER FUNCTION get_text(cached_pair) OWNER TO admin;
ALTER FUNCTION get_random_examples(cached_pair[]) OWNER TO admin;
ALTER FUNCTION get_contrasts_with_examples(text) OWNER TO admin;
ALTER FUNCTION get_items_from_string(text) OWNER TO admin;
