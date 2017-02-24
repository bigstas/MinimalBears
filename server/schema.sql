SET statement_timeout = 0;
SET client_encoding = 'SQL_ASCII';
SET standard_conforming_strings = on;
SET check_function_bodies = false;
SET client_min_messages = warning;

SET search_path = public, pg_catalog;

SET default_tablespace = '';

SET default_with_oids = false;

--
-- Name: cached_pair; Type: TYPE; Schema: public; Owner: admin
--

CREATE TYPE cached_pair AS (
	first integer,
	second integer
);


ALTER TYPE public.cached_pair OWNER TO "admin";


--
-- Name: language; Type: TABLE; Schema: public; Owner: admin; Tablespace: 
--

CREATE TABLE language (
    name text NOT NULL,
    "iso639-3" text NOT NULL,
    id integer NOT NULL
);


ALTER TABLE public.language OWNER TO "admin";

--
-- Name: contrast; Type: TABLE; Schema: public; Owner: admin; Tablespace: 
--

CREATE TABLE contrast (
    language integer NOT NULL,
    name text NOT NULL,
    id integer NOT NULL
);


ALTER TABLE public.contrast OWNER TO "admin";


--
-- Name: item; Type: TABLE; Schema: public; Owner: admin; Tablespace: 
--

CREATE TABLE item (
    language integer NOT NULL,
    homophones text[] NOT NULL,
    id integer NOT NULL,
    comment text
);


ALTER TABLE public.item OWNER TO "admin";


--
-- Name: audio; Type: TABLE; Schema: public; Owner: admin; Tablespace: 
--

CREATE TABLE audio (
    file text NOT NULL,
    speaker text NOT NULL,
    item integer NOT NULL,
    id integer NOT NULL
);


ALTER TABLE public.audio OWNER TO "admin";


--
-- Name: pair; Type: TABLE; Schema: public; Owner: admin; Tablespace: 
--

CREATE TABLE pair (
    contrast integer NOT NULL,
    first integer NOT NULL,
    second integer NOT NULL,
    id integer NOT NULL
);


ALTER TABLE public.pair OWNER TO "admin";

--
-- Name: TABLE pair; Type: COMMENT; Schema: public; Owner: admin
--

COMMENT ON TABLE pair IS 'At the moment, nothing enforces contrast.language, first.language, second.language to be identical (we could use a trigger for this).';


--
-- Name: get_audio_list(integer); Type: FUNCTION; Schema: public; Owner: admin
--

CREATE FUNCTION get_audio_list(item_id integer) RETURNS text[]
    LANGUAGE sql
    STABLE
    AS $$SELECT ARRAY(SELECT file FROM audio WHERE audio.item = item_id);$$;


ALTER FUNCTION public.get_audio_list(item_id integer) OWNER TO "admin";

--
-- Name: get_contrast_list(integer); Type: FUNCTION; Schema: public; Owner: admin
--

CREATE FUNCTION get_contrast_list(language_id integer) RETURNS integer[]
    LANGUAGE sql
    STABLE
    AS $$SELECT ARRAY(SELECT id FROM contrast WHERE contrast.language = language_id);$$;


ALTER FUNCTION public.get_contrast_list(language_id integer) OWNER TO "admin";


--
-- Name: get_contrasts(integer); Type: FUNCTION; Schema: public; Owner: admin
--

CREATE FUNCTION get_contrasts(language_id integer) RETURNS SETOF contrast
    LANGUAGE sql
    STABLE
    AS $$SELECT * FROM contrast WHERE contrast.language = language_id$$;


ALTER FUNCTION public.get_contrasts(language_id integer) OWNER TO "admin";

--
-- Name: get_items_from_homophone(text); Type: FUNCTION; Schema: public; Owner: admin
--

CREATE FUNCTION get_items_from_homophone(homophone text) RETURNS SETOF item
    LANGUAGE sql
    STABLE
    AS $$SELECT * FROM item WHERE homophone = ANY(homophones)$$;


ALTER FUNCTION public.get_items_from_homophone(homophone text) OWNER TO "admin";


--
-- Name: item_with_audio; Type: MATERIALIZED VIEW; Schema: public; Owner: admin
--

CREATE MATERIALIZED VIEW item_with_audio AS
    SELECT item.language, item.homophones, item.id, item.comment, get_audio_list(item.id) AS audio_list FROM item;


ALTER TABLE public.item_with_audio OWNER TO "admin";


--
-- Name: get_pair_list(integer); Type: FUNCTION; Schema: public; Owner: admin
--

CREATE FUNCTION get_pair_list(contrast_id integer) RETURNS cached_pair[]
    LANGUAGE sql
    STABLE
    AS $$SELECT ARRAY(  -- return as an array, not as a table
  SELECT (pair.first, pair.second)::cached_pair  -- return a pair, of type cached_pair
  FROM pair
  WHERE pair.contrast = contrast_id  -- only pairs for this contrast
    AND (SELECT audio FROM item_with_audio WHERE id = pair.first) != '{}'  -- items must have audio
    AND (SELECT audio FROM item_with_audio WHERE id = pair.second) != '{}'
);$$;


ALTER FUNCTION public.get_pair_list(contrast_id integer) OWNER TO "admin";


--
-- Name: Audio_id_seq; Type: SEQUENCE; Schema: public; Owner: admin
--

CREATE SEQUENCE "Audio_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public."Audio_id_seq" OWNER TO "admin";

--
-- Name: Audio_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: admin
--

ALTER SEQUENCE "Audio_id_seq" OWNED BY audio.id;


--
-- Name: Contrasts_id_seq; Type: SEQUENCE; Schema: public; Owner: admin
--

CREATE SEQUENCE "Contrasts_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public."Contrasts_id_seq" OWNER TO "admin";

--
-- Name: Contrasts_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: admin
--

ALTER SEQUENCE "Contrasts_id_seq" OWNED BY contrast.id;


--
-- Name: Items_id_seq; Type: SEQUENCE; Schema: public; Owner: admin
--

CREATE SEQUENCE "Items_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public."Items_id_seq" OWNER TO "admin";

--
-- Name: Items_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: admin
--

ALTER SEQUENCE "Items_id_seq" OWNED BY item.id;


--
-- Name: Languages_id_seq; Type: SEQUENCE; Schema: public; Owner: admin
--

CREATE SEQUENCE "Languages_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public."Languages_id_seq" OWNER TO "admin";

--
-- Name: Languages_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: admin
--

ALTER SEQUENCE "Languages_id_seq" OWNED BY language.id;


--
-- Name: Pairs_id_seq; Type: SEQUENCE; Schema: public; Owner: admin
--

CREATE SEQUENCE "Pairs_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public."Pairs_id_seq" OWNER TO "admin";

--
-- Name: Pairs_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: admin
--

ALTER SEQUENCE "Pairs_id_seq" OWNED BY pair.id;


--
-- Name: contrast_with_pairs; Type: MATERIALIZED VIEW; Schema: public; Owner: admin
--

CREATE MATERIALIZED VIEW contrast_with_pairs AS
    SELECT contrast.language, contrast.name, contrast.id, get_pair_list(contrast.id) AS pairs FROM contrast;


ALTER TABLE public.contrast_with_pairs OWNER TO "admin";


--
-- Name: contrast_nonempty; Type: MATERIALIZED VIEW; Schema: public; Owner: admin
--

CREATE MATERIALIZED VIEW contrast_nonempty AS
    SELECT contrast_with_pairs.language, contrast_with_pairs.name, contrast_with_pairs.id FROM contrast_with_pairs WHERE (contrast_with_pairs.pairs <> '{}'::cached_pair[]);


ALTER TABLE public.contrast_nonempty OWNER TO "admin";


--
-- Name: id; Type: DEFAULT; Schema: public; Owner: admin
--

ALTER TABLE ONLY audio ALTER COLUMN id SET DEFAULT nextval('"Audio_id_seq"'::regclass);


--
-- Name: id; Type: DEFAULT; Schema: public; Owner: admin
--

ALTER TABLE ONLY contrast ALTER COLUMN id SET DEFAULT nextval('"Contrasts_id_seq"'::regclass);


--
-- Name: id; Type: DEFAULT; Schema: public; Owner: admin
--

ALTER TABLE ONLY item ALTER COLUMN id SET DEFAULT nextval('"Items_id_seq"'::regclass);


--
-- Name: id; Type: DEFAULT; Schema: public; Owner: admin
--

ALTER TABLE ONLY language ALTER COLUMN id SET DEFAULT nextval('"Languages_id_seq"'::regclass);


--
-- Name: id; Type: DEFAULT; Schema: public; Owner: admin
--

ALTER TABLE ONLY pair ALTER COLUMN id SET DEFAULT nextval('"Pairs_id_seq"'::regclass);


--
-- Name: Audio_pkey; Type: CONSTRAINT; Schema: public; Owner: admin; Tablespace: 
--

ALTER TABLE ONLY audio
    ADD CONSTRAINT "Audio_pkey" PRIMARY KEY (id);


--
-- Name: Contrasts_pkey; Type: CONSTRAINT; Schema: public; Owner: admin; Tablespace: 
--

ALTER TABLE ONLY contrast
    ADD CONSTRAINT "Contrasts_pkey" PRIMARY KEY (id);


--
-- Name: Items_pkey; Type: CONSTRAINT; Schema: public; Owner: admin; Tablespace: 
--

ALTER TABLE ONLY item
    ADD CONSTRAINT "Items_pkey" PRIMARY KEY (id);


--
-- Name: Languages_pkey; Type: CONSTRAINT; Schema: public; Owner: admin; Tablespace: 
--

ALTER TABLE ONLY language
    ADD CONSTRAINT "Languages_pkey" PRIMARY KEY (id);


--
-- Name: Pairs_pkey; Type: CONSTRAINT; Schema: public; Owner: admin; Tablespace: 
--

ALTER TABLE ONLY pair
    ADD CONSTRAINT "Pairs_pkey" PRIMARY KEY (id);


--
-- Name: Audio_Items_fkey; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY audio
    ADD CONSTRAINT "Audio_Items_fkey" FOREIGN KEY (item) REFERENCES item(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: Contrasts_Languages_fkey; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY contrast
    ADD CONSTRAINT "Contrasts_Languages_fkey" FOREIGN KEY (language) REFERENCES language(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: Items_Languages_fkey; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY item
    ADD CONSTRAINT "Items_Languages_fkey" FOREIGN KEY (language) REFERENCES language(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: Pairs_Constrasts_fkey; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY pair
    ADD CONSTRAINT "Pairs_Constrasts_fkey" FOREIGN KEY (contrast) REFERENCES contrast(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: Pairs_Items_first_fkey; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY pair
    ADD CONSTRAINT "Pairs_Items_first_fkey" FOREIGN KEY (first) REFERENCES item(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: Pairs_Items_second_fkey; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY pair
    ADD CONSTRAINT "Pairs_Items_second_fkey" FOREIGN KEY (second) REFERENCES item(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: public; Type: ACL; Schema: -; Owner: admin
--

REVOKE ALL ON SCHEMA public FROM PUBLIC;
GRANT ALL ON SCHEMA public TO "admin";