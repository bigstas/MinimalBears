-- Boilerplate --

SET statement_timeout = 0;
SET client_encoding = 'SQL_ASCII';
SET standard_conforming_strings = on;
SET check_function_bodies = false;
SET client_min_messages = warning;
SET search_path = public, pg_catalog;
SET default_tablespace = '';
SET default_with_oids = false;

-- Tables --

-- Languages being learnt
CREATE TABLE language (
    name text NOT NULL,
    "iso639-3" text NOT NULL,
    id serial PRIMARY KEY
);
ALTER TABLE public.language OWNER TO "admin";

-- Contrasts in the above languages
CREATE TABLE contrast (
    language integer REFERENCES language(id) ON UPDATE CASCADE ON DELETE CASCADE,
    name text NOT NULL,
    id serial PRIMARY KEY
);
ALTER TABLE public.contrast OWNER TO "admin";

-- Items in the above languages
CREATE TABLE item (
    language integer REFERENCES language(id) ON UPDATE CASCADE ON DELETE CASCADE,
    homophones text[] NOT NULL,
    id serial PRIMARY KEY,
    comment text
);
ALTER TABLE public.item OWNER TO "admin";

-- Audio recordings
CREATE TABLE audio (
    file text NOT NULL,
    speaker text NOT NULL,
    item integer REFERENCES item(id) ON UPDATE CASCADE ON DELETE CASCADE,
    id serial PRIMARY KEY
);
ALTER TABLE public.audio OWNER TO "admin";

-- Minimal pairs
CREATE TABLE pair (
    contrast integer REFERENCES contrast(id) ON UPDATE CASCADE ON DELETE CASCADE,
    first integer REFERENCES item(id) ON UPDATE CASCADE ON DELETE CASCADE,
    second integer REFERENCES item(id) ON UPDATE CASCADE ON DELETE CASCADE,
    id serial PRIMARY KEY
);
ALTER TABLE public.pair OWNER TO "admin";
-- Force the contrast and items to be from the same language
CREATE FUNCTION check_language()
    RETURNS trigger
    LANGUAGE plpgsql
    STABLE
    AS $$
        DECLARE
            contrast_lang integer;
            first_lang integer;
            second_lang integer;
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
ALTER FUNCTION public.check_language() OWNER TO "admin";
-- Use the function in a trigger
CREATE TRIGGER check_language_trigger BEFORE INSERT OR UPDATE
    ON pair
    FOR EACH ROW
    EXECUTE PROCEDURE check_language();

-- Submissions of audio recordings
CREATE TABLE audio_submission (
  file bytea NOT NULL,
  speaker text NOT NULL, -- TODO this should reference a user
  item integer REFERENCES item(id) ON UPDATE CASCADE ON DELETE CASCADE,
  id serial PRIMARY KEY
);
ALTER TABLE audio_submission OWNER TO "admin";

-- Views --

-- Item table extended with cache of audio files
-- Rather than storing the audio ids, we can store the filepaths
-- First define a function to get the list of audio files for a given item
CREATE FUNCTION get_audio_list(item_id integer) RETURNS text[]
    LANGUAGE sql
    STABLE
    AS $$SELECT ARRAY(SELECT file FROM audio WHERE audio.item = item_id);$$;
ALTER FUNCTION public.get_audio_list(item_id integer) OWNER TO "admin";
-- Now define the view
CREATE MATERIALIZED VIEW item_with_audio AS
    SELECT item.language,
        item.homophones,
        item.id,
        item.comment,
        get_audio_list(item.id) AS audio_list
    FROM item;
ALTER TABLE public.item_with_audio OWNER TO "admin";

-- Contrast table extended with cache of minimal pairs
-- Rather than storing the pair ids, we can store pairs of item ids (cached_pair type)
-- To return pairs of item ids, first define a new type
CREATE TYPE cached_pair AS (
    first integer,
    second integer
);
ALTER TYPE public.cached_pair OWNER TO "admin";
-- Now define a function to get the list of minimal pairs for a given contrast
CREATE FUNCTION get_pair_list(contrast_id integer) RETURNS cached_pair[]
    LANGUAGE sql
    STABLE
    AS $$SELECT ARRAY(  -- return as an array, not as a table
        SELECT (pair.first, pair.second)::cached_pair  -- return a pair, of type cached_pair
        FROM pair
        WHERE pair.contrast = contrast_id  -- only pairs for this contrast
            AND (SELECT audio_list FROM item_with_audio WHERE id = pair.first) != '{}'  -- items must have audio
            AND (SELECT audio_list FROM item_with_audio WHERE id = pair.second) != '{}'
    );$$;
ALTER FUNCTION public.get_pair_list(contrast_id integer) OWNER TO "admin";
-- Now define the view
CREATE MATERIALIZED VIEW contrast_with_pairs AS
    SELECT contrast.language,
        contrast.name,
        contrast.id,
        get_pair_list(contrast.id) AS pairs
    FROM contrast;
ALTER TABLE public.contrast_with_pairs OWNER TO "admin";

-- Contrast table filtered to include only those with a nonempty list of pairs
CREATE MATERIALIZED VIEW contrast_nonempty AS
    SELECT contrast_with_pairs.language,
        contrast_with_pairs.name,
        contrast_with_pairs.id
    FROM contrast_with_pairs
    WHERE (contrast_with_pairs.pairs <> '{}'::cached_pair[]);
ALTER TABLE public.contrast_nonempty OWNER TO "admin";

-- Functions --

CREATE FUNCTION submit_audio(
    file bytea,
    speaker text,
    item integer)
    RETURNS integer
    LANGUAGE sql VOLATILE 
    AS $$INSERT INTO audio_submission (file, speaker, item)
        VALUES (file, speaker, item)
        RETURNING id;$$;
ALTER FUNCTION submit_audio(bytea, text, integer) OWNER TO "admin";

-- Other functions --
-- TODO currently unused?

-- Get list of contrasts for a given language (return list of ids)
CREATE FUNCTION get_contrast_list(language_id integer) RETURNS integer[]
    LANGUAGE sql
    STABLE
    AS $$SELECT ARRAY(SELECT id FROM contrast WHERE contrast.language = language_id);$$;
ALTER FUNCTION public.get_contrast_list(language_id integer) OWNER TO "admin";

-- Get list of contrasts for a given language (return set of contrast rows)
CREATE FUNCTION get_contrasts(language_id integer) RETURNS SETOF contrast
    LANGUAGE sql
    STABLE
    AS $$SELECT * FROM contrast WHERE contrast.language = language_id$$;
ALTER FUNCTION public.get_contrasts(language_id integer) OWNER TO "admin";

-- Get list of possible items, from a given string
CREATE FUNCTION get_items_from_homophone(homophone text) RETURNS SETOF item
    LANGUAGE sql
    STABLE
    AS $$SELECT * FROM item WHERE homophone = ANY(homophones)$$;
ALTER FUNCTION public.get_items_from_homophone(homophone text) OWNER TO "admin";

-- Security --

REVOKE ALL ON SCHEMA public FROM PUBLIC;
GRANT ALL ON SCHEMA public TO "admin";
-- only allow specific functions to be called
ALTER DEFAULT PRIVILEGES REVOKE EXECUTE ON FUNCTIONS FROM PUBLIC;
