--
-- PostgreSQL database dump
--

-- Dumped from database version 14.12
-- Dumped by pg_dump version 16.3

-- Started on 2024-12-16 11:10:32

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

--
-- TOC entry 4 (class 2615 OID 2200)
-- Name: public; Type: SCHEMA; Schema: -; Owner: postgres
--

-- *not* creating schema, since initdb creates it


ALTER SCHEMA public OWNER TO postgres;

--
-- TOC entry 230 (class 1255 OID 16764)
-- Name: generate_avis_numavis(); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.generate_avis_numavis() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
  NEW."numAvis" := 'A-' || LPAD(nextval('avisPaiement_numAvis_seq')::text, 6, '0');
  RETURN NEW;
END;
$$;


ALTER FUNCTION public.generate_avis_numavis() OWNER TO postgres;

--
-- TOC entry 227 (class 1255 OID 16702)
-- Name: generate_client_numchrono(); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.generate_client_numchrono() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
    NEW."numChrono" := 'CL-' || LPAD(nextval('client_numchrono_seq')::text, 6, '0');
    RETURN NEW;
END;
$$;


ALTER FUNCTION public.generate_client_numchrono() OWNER TO postgres;

--
-- TOC entry 229 (class 1255 OID 16758)
-- Name: generate_devis_numdevis(); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.generate_devis_numdevis() RETURNS trigger
    LANGUAGE plpgsql
    AS $$ 
BEGIN
  NEW.numDevis := 'DEV-' || LPAD(nextval('devis_numDevis_seq')::text, 6, '0');
  RETURN NEW;
END;
$$;


ALTER FUNCTION public.generate_devis_numdevis() OWNER TO postgres;

--
-- TOC entry 228 (class 1255 OID 16814)
-- Name: generate_numpermis(); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.generate_numpermis() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
    -- Génère un identifiant unique basé sur la séquence et un format personnalisé
    NEW."numPermis" := 'PERM-' || LPAD(nextval('permis_seq')::TEXT, 6, '0');
    RETURN NEW;
END;
$$;


ALTER FUNCTION public.generate_numpermis() OWNER TO postgres;

--
-- TOC entry 222 (class 1259 OID 16770)
-- Name: avis_numavis_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.avis_numavis_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.avis_numavis_seq OWNER TO postgres;

--
-- TOC entry 221 (class 1259 OID 16767)
-- Name: avispaiement_numavis_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.avispaiement_numavis_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.avispaiement_numavis_seq OWNER TO postgres;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- TOC entry 210 (class 1259 OID 16502)
-- Name: client; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.client (
    "numChrono" character varying(10) NOT NULL,
    "nomClient" character varying(200) NOT NULL,
    adresse character varying(100) NOT NULL,
    contact character varying(12) NOT NULL
);


ALTER TABLE public.client OWNER TO postgres;

--
-- TOC entry 217 (class 1259 OID 16697)
-- Name: client_numchrono_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.client_numchrono_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.client_numchrono_seq OWNER TO postgres;

--
-- TOC entry 219 (class 1259 OID 16744)
-- Name: client_numdevis_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.client_numdevis_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.client_numdevis_seq OWNER TO postgres;

--
-- TOC entry 214 (class 1259 OID 16582)
-- Name: demande; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.demande (
    "numDemande" character varying NOT NULL,
    "numChrono" character varying(10) NOT NULL,
    "dateDemande" date NOT NULL,
    "typeDemande" character varying(200),
    longueur numeric(10,2),
    largeur numeric(10,2),
    lieu character varying(100)
);


ALTER TABLE public.demande OWNER TO postgres;

--
-- TOC entry 213 (class 1259 OID 16581)
-- Name: demande_numDemande_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."demande_numDemande_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."demande_numDemande_seq" OWNER TO postgres;

--
-- TOC entry 3400 (class 0 OID 0)
-- Dependencies: 213
-- Name: demande_numDemande_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."demande_numDemande_seq" OWNED BY public.demande."numDemande";


--
-- TOC entry 220 (class 1259 OID 16760)
-- Name: devis_numdevis_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.devis_numdevis_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.devis_numdevis_seq OWNER TO postgres;

--
-- TOC entry 212 (class 1259 OID 16569)
-- Name: devis; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.devis (
    "numDevis" character varying(10) DEFAULT ('DEV-'::text || lpad((nextval('public.devis_numdevis_seq'::regclass))::text, 6, '0'::text)) NOT NULL,
    "numDemande" character varying NOT NULL,
    "prixLongueur" numeric(10,2) NOT NULL,
    "prixLargeur" numeric(10,2) NOT NULL,
    montant numeric(10,2) NOT NULL,
    etat character varying(20) DEFAULT 'non payé'::character varying
);


ALTER TABLE public.devis OWNER TO postgres;

--
-- TOC entry 211 (class 1259 OID 16568)
-- Name: devis_numDevis_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."devis_numDevis_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."devis_numDevis_seq" OWNER TO postgres;

--
-- TOC entry 3401 (class 0 OID 0)
-- Dependencies: 211
-- Name: devis_numDevis_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."devis_numDevis_seq" OWNED BY public.devis."numDevis";


--
-- TOC entry 218 (class 1259 OID 16743)
-- Name: devis_num_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.devis_num_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.devis_num_seq OWNER TO postgres;

--
-- TOC entry 223 (class 1259 OID 16802)
-- Name: permis; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.permis (
    "numPermis" character varying(12) NOT NULL,
    "numDevis" character varying(12),
    "numQuittance" character varying(12),
    "datePermis" date DEFAULT CURRENT_DATE
);


ALTER TABLE public.permis OWNER TO postgres;

--
-- TOC entry 224 (class 1259 OID 16813)
-- Name: permis_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.permis_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.permis_seq OWNER TO postgres;

--
-- TOC entry 226 (class 1259 OID 16817)
-- Name: responsable; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.responsable (
    "numResponsable" integer NOT NULL,
    user_id integer NOT NULL,
    "nomResponsable" character varying(100) NOT NULL,
    "motDePasse" character varying(255) NOT NULL
);


ALTER TABLE public.responsable OWNER TO postgres;

--
-- TOC entry 225 (class 1259 OID 16816)
-- Name: responsable_numResponsable_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."responsable_numResponsable_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."responsable_numResponsable_seq" OWNER TO postgres;

--
-- TOC entry 3402 (class 0 OID 0)
-- Dependencies: 225
-- Name: responsable_numResponsable_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."responsable_numResponsable_seq" OWNED BY public.responsable."numResponsable";


--
-- TOC entry 216 (class 1259 OID 16683)
-- Name: users; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.users (
    id integer NOT NULL,
    username character varying(50) NOT NULL,
    password character varying(255) NOT NULL,
    role character varying(20) NOT NULL,
    full_name character varying(100),
    email character varying(100) NOT NULL,
    phone character varying(15),
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.users OWNER TO postgres;

--
-- TOC entry 215 (class 1259 OID 16682)
-- Name: users_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.users_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.users_id_seq OWNER TO postgres;

--
-- TOC entry 3403 (class 0 OID 0)
-- Dependencies: 215
-- Name: users_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.users_id_seq OWNED BY public.users.id;


--
-- TOC entry 209 (class 1259 OID 16441)
-- Name: verificateur; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.verificateur (
    "numVerificateur" character varying(12) NOT NULL,
    "nomVerificateur" character varying(100) NOT NULL,
    "dateDescente" date NOT NULL
);


ALTER TABLE public.verificateur OWNER TO postgres;

--
-- TOC entry 3204 (class 2604 OID 16771)
-- Name: demande numDemande; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.demande ALTER COLUMN "numDemande" SET DEFAULT nextval('public."demande_numDemande_seq"'::regclass);


--
-- TOC entry 3209 (class 2604 OID 16820)
-- Name: responsable numResponsable; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.responsable ALTER COLUMN "numResponsable" SET DEFAULT nextval('public."responsable_numResponsable_seq"'::regclass);


--
-- TOC entry 3205 (class 2604 OID 16686)
-- Name: users id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users ALTER COLUMN id SET DEFAULT nextval('public.users_id_seq'::regclass);


--
-- TOC entry 3377 (class 0 OID 16502)
-- Dependencies: 210
-- Data for Name: client; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.client ("numChrono", "nomClient", adresse, contact) FROM stdin;
CL-000004	RAKOTO Marie	Antarandolo	0345568997
CL-000005	RABETOANDRO Olivier	Ankofafa	0325689655
CL-000007	RASOA Jeanne	Anjoma	0325589965
CL-000006	RAMANANA Elie	Anjoma	0336589970
CL-000008	RANDRIA Jean	Antarandolo	0345689785
CL-000009	RABEMILA Eric	Antarandolo	0345789636
CL-000001	RAKOTOZANDRY Mamitiana	 Antarandolo	0344239786
CL-000003	RAZAKANDRAINY Marc	Anjoma	0342904556
CL-000002	NIRINTSALAMA Harisoa Tsanta	Tanambao	0342358982
CL-000010	RAKOTO Jean Marc	Anjoma	0340000000
CL-000011	Rakotozandry	Tanambao	0345743444
\.


--
-- TOC entry 3381 (class 0 OID 16582)
-- Dependencies: 214
-- Data for Name: demande; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.demande ("numDemande", "numChrono", "dateDemande", "typeDemande", longueur, largeur, lieu) FROM stdin;
1	CL-000001	2024-11-07	Etablissements hôteliers	400.00	300.00	Anjoma
2	CL-000010	2024-11-08	Etablissements culturels	500.00	300.00	Antarandolo
DEM-000001	CL-000005	2024-11-08	Etablissements culturels	800.00	500.00	Antarandolo
DEM-000003	CL-000002	2024-11-06	Etablissements recevant du public	500.00	400.00	Anjoma
DEM-000005	CL-000007	2024-12-05	Etablissements culturels	500.00	200.00	Anjoma
DEM-00004	CL-000004	2024-11-22	Etablissements hôteliers	40.00	20.00	Antarandolo
DEM-000006	CL-000006	2024-12-01	Etablissements industriels	600.00	500.00	Tanambao
DEM-000008	CL-000009	2024-12-08	Etablissements recevant du public	40.00	20.00	Tanambao
DEM-000010	CL-000011	2024-12-13	Etablissements culturels	500.00	300.00	Ankofafa
\.


--
-- TOC entry 3379 (class 0 OID 16569)
-- Dependencies: 212
-- Data for Name: devis; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.devis ("numDevis", "numDemande", "prixLongueur", "prixLargeur", montant, etat) FROM stdin;
DEV-000020	DEM-000003	500000.00	200000.00	700000.00	payé
DEV-000021	DEM-000001	800000.00	250000.00	1050000.00	payé
DEV-000022	DEM-000005	250000.00	60000.00	310000.00	payé
DEV-000023	DEM-00004	20000.00	6000.00	26000.00	payé
DEV-000024	DEM-000006	300000.00	150000.00	450000.00	payé
DEV-000025	DEM-000008	20000.00	6000.00	26000.00	payé
DEV-000026	DEM-000010	250000.00	90000.00	340000.00	payé
\.


--
-- TOC entry 3390 (class 0 OID 16802)
-- Dependencies: 223
-- Data for Name: permis; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.permis ("numPermis", "numDevis", "numQuittance", "datePermis") FROM stdin;
PERM-000005	DEV-000020	Q-11111	2024-11-18
PERM-000006	DEV-000021	Q-111112	2024-12-06
PERM-000008	DEV-000023	Q-000004	2024-12-11
PERM-000009	DEV-000024	Q-000005	2024-12-11
PERM-000011	DEV-000022	Q-000006	2024-12-12
PERM-000012	DEV-000025	Q-000006	2024-12-12
PERM-000013	DEV-000026	Q-10000	2024-12-14
\.


--
-- TOC entry 3393 (class 0 OID 16817)
-- Dependencies: 226
-- Data for Name: responsable; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.responsable ("numResponsable", user_id, "nomResponsable", "motDePasse") FROM stdin;
1	2	Responsable Ubanisme	$2a$10$6J/iLrnYIVFz951Px.VulOjvyg2wRn/93gKKXSg13Ba5badFiXx6.
\.


--
-- TOC entry 3383 (class 0 OID 16683)
-- Dependencies: 216
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.users (id, username, password, role, full_name, email, phone, created_at, updated_at) FROM stdin;
1	Mamitiana	$2a$10$00Ek9OQaEA8.Bio6Qw6BiOWPfevARaTSWazJjuifdR.atCehFv6TK	Admin	RAKOTOZANDRY Mamitiana Christiano	christamamitiana@gmail.com	0344239786	2024-10-31 21:06:07.195203	2024-10-31 21:06:07.195203
2	Responsable	$2a$10$6J/iLrnYIVFz951Px.VulOjvyg2wRn/93gKKXSg13Ba5badFiXx6.	Responsable	Responsable Ubanisme	responsable@gmail.com	0345743444	2024-10-31 21:10:57.079819	2024-10-31 21:10:57.079819
\.


--
-- TOC entry 3376 (class 0 OID 16441)
-- Dependencies: 209
-- Data for Name: verificateur; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.verificateur ("numVerificateur", "nomVerificateur", "dateDescente") FROM stdin;
V002	RATSIMBASON Mickael	2024-11-15
V003	RAKOTO Olivier	2024-11-21
\.


--
-- TOC entry 3404 (class 0 OID 0)
-- Dependencies: 222
-- Name: avis_numavis_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.avis_numavis_seq', 1, false);


--
-- TOC entry 3405 (class 0 OID 0)
-- Dependencies: 221
-- Name: avispaiement_numavis_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.avispaiement_numavis_seq', 4, true);


--
-- TOC entry 3406 (class 0 OID 0)
-- Dependencies: 217
-- Name: client_numchrono_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.client_numchrono_seq', 11, true);


--
-- TOC entry 3407 (class 0 OID 0)
-- Dependencies: 219
-- Name: client_numdevis_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.client_numdevis_seq', 1, false);


--
-- TOC entry 3408 (class 0 OID 0)
-- Dependencies: 213
-- Name: demande_numDemande_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."demande_numDemande_seq"', 2, true);


--
-- TOC entry 3409 (class 0 OID 0)
-- Dependencies: 211
-- Name: devis_numDevis_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."devis_numDevis_seq"', 1, false);


--
-- TOC entry 3410 (class 0 OID 0)
-- Dependencies: 218
-- Name: devis_num_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.devis_num_seq', 1, false);


--
-- TOC entry 3411 (class 0 OID 0)
-- Dependencies: 220
-- Name: devis_numdevis_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.devis_numdevis_seq', 26, true);


--
-- TOC entry 3412 (class 0 OID 0)
-- Dependencies: 224
-- Name: permis_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.permis_seq', 13, true);


--
-- TOC entry 3413 (class 0 OID 0)
-- Dependencies: 225
-- Name: responsable_numResponsable_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."responsable_numResponsable_seq"', 1, true);


--
-- TOC entry 3414 (class 0 OID 0)
-- Dependencies: 215
-- Name: users_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.users_id_seq', 2, true);


--
-- TOC entry 3213 (class 2606 OID 16506)
-- Name: client client_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.client
    ADD CONSTRAINT client_pkey PRIMARY KEY ("numChrono");


--
-- TOC entry 3217 (class 2606 OID 16773)
-- Name: demande demande_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.demande
    ADD CONSTRAINT demande_pkey PRIMARY KEY ("numDemande");


--
-- TOC entry 3215 (class 2606 OID 16595)
-- Name: devis devis_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.devis
    ADD CONSTRAINT devis_pkey PRIMARY KEY ("numDevis");


--
-- TOC entry 3225 (class 2606 OID 16807)
-- Name: permis permis_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.permis
    ADD CONSTRAINT permis_pkey PRIMARY KEY ("numPermis");


--
-- TOC entry 3227 (class 2606 OID 16822)
-- Name: responsable responsable_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.responsable
    ADD CONSTRAINT responsable_pkey PRIMARY KEY ("numResponsable");


--
-- TOC entry 3229 (class 2606 OID 16824)
-- Name: responsable responsable_user_id_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.responsable
    ADD CONSTRAINT responsable_user_id_key UNIQUE (user_id);


--
-- TOC entry 3219 (class 2606 OID 16696)
-- Name: users users_email_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key UNIQUE (email);


--
-- TOC entry 3221 (class 2606 OID 16692)
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- TOC entry 3223 (class 2606 OID 16694)
-- Name: users users_username_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_username_key UNIQUE (username);


--
-- TOC entry 3211 (class 2606 OID 16445)
-- Name: verificateur verificateur_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.verificateur
    ADD CONSTRAINT verificateur_pkey PRIMARY KEY ("numVerificateur");


--
-- TOC entry 3234 (class 2620 OID 16703)
-- Name: client set_client_numchrono; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER set_client_numchrono BEFORE INSERT ON public.client FOR EACH ROW WHEN ((new."numChrono" IS NULL)) EXECUTE FUNCTION public.generate_client_numchrono();


--
-- TOC entry 3235 (class 2620 OID 16762)
-- Name: devis set_devis_numdevis; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER set_devis_numdevis BEFORE INSERT ON public.devis FOR EACH ROW WHEN ((new."numDevis" IS NULL)) EXECUTE FUNCTION public.generate_devis_numdevis();


--
-- TOC entry 3236 (class 2620 OID 16815)
-- Name: permis set_numpermis; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER set_numpermis BEFORE INSERT ON public.permis FOR EACH ROW WHEN ((new."numPermis" IS NULL)) EXECUTE FUNCTION public.generate_numpermis();


--
-- TOC entry 3231 (class 2606 OID 16588)
-- Name: demande fk_numchrono; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.demande
    ADD CONSTRAINT fk_numchrono FOREIGN KEY ("numChrono") REFERENCES public.client("numChrono");


--
-- TOC entry 3230 (class 2606 OID 16790)
-- Name: devis fk_numdemande; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.devis
    ADD CONSTRAINT fk_numdemande FOREIGN KEY ("numDemande") REFERENCES public.demande("numDemande") ON DELETE CASCADE;


--
-- TOC entry 3232 (class 2606 OID 16808)
-- Name: permis permis_numDevis_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.permis
    ADD CONSTRAINT "permis_numDevis_fkey" FOREIGN KEY ("numDevis") REFERENCES public.devis("numDevis") ON DELETE CASCADE;


--
-- TOC entry 3233 (class 2606 OID 16825)
-- Name: responsable responsable_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.responsable
    ADD CONSTRAINT responsable_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- TOC entry 3399 (class 0 OID 0)
-- Dependencies: 4
-- Name: SCHEMA public; Type: ACL; Schema: -; Owner: postgres
--

REVOKE USAGE ON SCHEMA public FROM PUBLIC;
GRANT ALL ON SCHEMA public TO PUBLIC;


-- Completed on 2024-12-16 11:10:32

--
-- PostgreSQL database dump complete
--

