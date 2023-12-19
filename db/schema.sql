SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: comments; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.comments (
    id integer NOT NULL,
    text text NOT NULL,
    study_note_comment_id integer,
    comment_date_create timestamp without time zone NOT NULL
);


--
-- Name: comments_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.comments_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: comments_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.comments_id_seq OWNED BY public.comments.id;


--
-- Name: quiz_questions; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.quiz_questions (
    id integer NOT NULL,
    question text NOT NULL,
    embedding bytea,
    answer text NOT NULL,
    study_notes_id integer
);


--
-- Name: quiz_questions_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.quiz_questions_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: quiz_questions_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.quiz_questions_id_seq OWNED BY public.quiz_questions.id;


--
-- Name: schema_migrations; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.schema_migrations (
    version character varying(128) NOT NULL
);


--
-- Name: sentences; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.sentences (
    id integer NOT NULL,
    text text NOT NULL,
    embedding bytea,
    study_note_id integer
);


--
-- Name: sentences_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.sentences_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: sentences_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.sentences_id_seq OWNED BY public.sentences.id;


--
-- Name: shared_notes; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.shared_notes (
    id integer NOT NULL,
    study_group_id integer,
    study_note_id integer
);


--
-- Name: shared_notes_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.shared_notes_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: shared_notes_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.shared_notes_id_seq OWNED BY public.shared_notes.id;


--
-- Name: study_group_members; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.study_group_members (
    id integer NOT NULL,
    study_group_id integer,
    user_id integer
);


--
-- Name: study_group_members_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.study_group_members_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: study_group_members_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.study_group_members_id_seq OWNED BY public.study_group_members.id;


--
-- Name: study_groups; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.study_groups (
    id integer NOT NULL,
    name character varying(255) NOT NULL,
    description text
);


--
-- Name: study_groups_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.study_groups_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: study_groups_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.study_groups_id_seq OWNED BY public.study_groups.id;


--
-- Name: study_note_comments; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.study_note_comments (
    id integer NOT NULL,
    study_note_id integer,
    user_id integer
);


--
-- Name: study_note_comments_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.study_note_comments_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: study_note_comments_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.study_note_comments_id_seq OWNED BY public.study_note_comments.id;


--
-- Name: study_note_topics; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.study_note_topics (
    id integer NOT NULL,
    topic_id integer,
    study_notes_id integer
);


--
-- Name: study_note_topics_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.study_note_topics_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: study_note_topics_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.study_note_topics_id_seq OWNED BY public.study_note_topics.id;


--
-- Name: study_notes; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.study_notes (
    id integer NOT NULL,
    date_published timestamp without time zone NOT NULL,
    title character varying(255) NOT NULL,
    is_public boolean NOT NULL,
    study_notes_edited_date timestamp without time zone
);


--
-- Name: study_notes_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.study_notes_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: study_notes_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.study_notes_id_seq OWNED BY public.study_notes.id;


--
-- Name: topics; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.topics (
    id integer NOT NULL,
    name character varying(255) NOT NULL
);


--
-- Name: topics_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.topics_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: topics_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.topics_id_seq OWNED BY public.topics.id;


--
-- Name: users; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.users (
    id integer NOT NULL,
    username character varying(255) NOT NULL,
    email character varying(255) NOT NULL,
    password text NOT NULL
);


--
-- Name: users_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.users_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: users_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.users_id_seq OWNED BY public.users.id;


--
-- Name: comments id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.comments ALTER COLUMN id SET DEFAULT nextval('public.comments_id_seq'::regclass);


--
-- Name: quiz_questions id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.quiz_questions ALTER COLUMN id SET DEFAULT nextval('public.quiz_questions_id_seq'::regclass);


--
-- Name: sentences id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.sentences ALTER COLUMN id SET DEFAULT nextval('public.sentences_id_seq'::regclass);


--
-- Name: shared_notes id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.shared_notes ALTER COLUMN id SET DEFAULT nextval('public.shared_notes_id_seq'::regclass);


--
-- Name: study_group_members id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.study_group_members ALTER COLUMN id SET DEFAULT nextval('public.study_group_members_id_seq'::regclass);


--
-- Name: study_groups id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.study_groups ALTER COLUMN id SET DEFAULT nextval('public.study_groups_id_seq'::regclass);


--
-- Name: study_note_comments id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.study_note_comments ALTER COLUMN id SET DEFAULT nextval('public.study_note_comments_id_seq'::regclass);


--
-- Name: study_note_topics id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.study_note_topics ALTER COLUMN id SET DEFAULT nextval('public.study_note_topics_id_seq'::regclass);


--
-- Name: study_notes id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.study_notes ALTER COLUMN id SET DEFAULT nextval('public.study_notes_id_seq'::regclass);


--
-- Name: topics id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.topics ALTER COLUMN id SET DEFAULT nextval('public.topics_id_seq'::regclass);


--
-- Name: users id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.users ALTER COLUMN id SET DEFAULT nextval('public.users_id_seq'::regclass);


--
-- Name: comments comments_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.comments
    ADD CONSTRAINT comments_pkey PRIMARY KEY (id);


--
-- Name: quiz_questions quiz_questions_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.quiz_questions
    ADD CONSTRAINT quiz_questions_pkey PRIMARY KEY (id);


--
-- Name: schema_migrations schema_migrations_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.schema_migrations
    ADD CONSTRAINT schema_migrations_pkey PRIMARY KEY (version);


--
-- Name: sentences sentences_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.sentences
    ADD CONSTRAINT sentences_pkey PRIMARY KEY (id);


--
-- Name: shared_notes shared_notes_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.shared_notes
    ADD CONSTRAINT shared_notes_pkey PRIMARY KEY (id);


--
-- Name: study_group_members study_group_members_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.study_group_members
    ADD CONSTRAINT study_group_members_pkey PRIMARY KEY (id);


--
-- Name: study_groups study_groups_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.study_groups
    ADD CONSTRAINT study_groups_pkey PRIMARY KEY (id);


--
-- Name: study_note_comments study_note_comments_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.study_note_comments
    ADD CONSTRAINT study_note_comments_pkey PRIMARY KEY (id);


--
-- Name: study_note_topics study_note_topics_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.study_note_topics
    ADD CONSTRAINT study_note_topics_pkey PRIMARY KEY (id);


--
-- Name: study_notes study_notes_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.study_notes
    ADD CONSTRAINT study_notes_pkey PRIMARY KEY (id);


--
-- Name: topics topics_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.topics
    ADD CONSTRAINT topics_pkey PRIMARY KEY (id);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- Name: comments comments_study_note_comment_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.comments
    ADD CONSTRAINT comments_study_note_comment_id_fkey FOREIGN KEY (study_note_comment_id) REFERENCES public.study_note_comments(id) ON DELETE CASCADE;


--
-- Name: quiz_questions quiz_questions_study_notes_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.quiz_questions
    ADD CONSTRAINT quiz_questions_study_notes_id_fkey FOREIGN KEY (study_notes_id) REFERENCES public.study_notes(id) ON DELETE CASCADE;


--
-- Name: sentences sentences_study_note_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.sentences
    ADD CONSTRAINT sentences_study_note_id_fkey FOREIGN KEY (study_note_id) REFERENCES public.study_notes(id) ON DELETE CASCADE;


--
-- Name: shared_notes shared_notes_study_group_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.shared_notes
    ADD CONSTRAINT shared_notes_study_group_id_fkey FOREIGN KEY (study_group_id) REFERENCES public.study_groups(id) ON DELETE CASCADE;


--
-- Name: shared_notes shared_notes_study_note_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.shared_notes
    ADD CONSTRAINT shared_notes_study_note_id_fkey FOREIGN KEY (study_note_id) REFERENCES public.study_notes(id) ON DELETE CASCADE;


--
-- Name: study_group_members study_group_members_study_group_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.study_group_members
    ADD CONSTRAINT study_group_members_study_group_id_fkey FOREIGN KEY (study_group_id) REFERENCES public.study_groups(id) ON DELETE CASCADE;


--
-- Name: study_group_members study_group_members_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.study_group_members
    ADD CONSTRAINT study_group_members_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: study_note_comments study_note_comments_study_note_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.study_note_comments
    ADD CONSTRAINT study_note_comments_study_note_id_fkey FOREIGN KEY (study_note_id) REFERENCES public.study_notes(id) ON DELETE CASCADE;


--
-- Name: study_note_comments study_note_comments_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.study_note_comments
    ADD CONSTRAINT study_note_comments_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: study_note_topics study_note_topics_study_notes_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.study_note_topics
    ADD CONSTRAINT study_note_topics_study_notes_id_fkey FOREIGN KEY (study_notes_id) REFERENCES public.study_notes(id) ON DELETE CASCADE;


--
-- Name: study_note_topics study_note_topics_topic_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.study_note_topics
    ADD CONSTRAINT study_note_topics_topic_id_fkey FOREIGN KEY (topic_id) REFERENCES public.topics(id) ON DELETE CASCADE;


--
-- PostgreSQL database dump complete
--


--
-- Dbmate schema migrations
--

INSERT INTO public.schema_migrations (version) VALUES
    ('20231218045431'),
    ('20231218053400'),
    ('20231218053750'),
    ('20231218054011'),
    ('20231218054449'),
    ('20231218055611'),
    ('20231218055702'),
    ('20231218055703'),
    ('20231218060902'),
    ('20231218061008'),
    ('20231218061143');
