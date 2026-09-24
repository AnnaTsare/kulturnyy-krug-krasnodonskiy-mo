-- База данных «Культурный круг · Краснодонский МО»
-- PostgreSQL 14+ / 17+

CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE TABLE IF NOT EXISTS site_settings (
  id              boolean PRIMARY KEY DEFAULT true CHECK (id),
  site_name       varchar(100) NOT NULL DEFAULT 'Культурный круг',
  municipality    varchar(100) NOT NULL DEFAULT 'Краснодонский МО',
  eyebrow         varchar(120) NOT NULL DEFAULT 'Городская культурная платформа',
  hero_title      varchar(120) NOT NULL DEFAULT 'Культура начинается',
  hero_accent     varchar(80) NOT NULL DEFAULT 'со встречи',
  hero_description text NOT NULL DEFAULT '',
  footer_description text NOT NULL DEFAULT '',
  contact_email   varchar(255),
  updated_at      timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS institutions (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name            varchar(255) NOT NULL,
  group_name      varchar(80) NOT NULL CHECK (group_name IN ('Детские школы искусств', 'Дворцы культуры и клубы', 'Библиотечные системы', 'Парк', 'НКО')),
  address         text,
  phone           varchar(80),
  email           varchar(255),
  committee_phone varchar(80),
  committee_email varchar(255),
  programs        text,
  admission       text,
  committee       text,
  schedule        text,
  requirements    text,
  documents       text,
  published       boolean NOT NULL DEFAULT true,
  created_at      timestamptz NOT NULL DEFAULT now(),
  updated_at      timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS events (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title           varchar(255) NOT NULL,
  category        varchar(80) NOT NULL,
  direction       varchar(80),
  starts_at       timestamptz NOT NULL,
  time_to_be_confirmed boolean NOT NULL DEFAULT false,
  venue           text NOT NULL,
  description     text NOT NULL,
  capacity        integer NOT NULL DEFAULT 0 CHECK (capacity >= 0),
  poster_color    varchar(20) NOT NULL DEFAULT '#e55b32',
  published       boolean NOT NULL DEFAULT true,
  created_at      timestamptz NOT NULL DEFAULT now(),
  updated_at      timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS events_starts_at_idx ON events (starts_at);
CREATE INDEX IF NOT EXISTS events_direction_idx ON events (direction);

CREATE TABLE IF NOT EXISTS event_bookings (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id        uuid NOT NULL REFERENCES events(id) ON DELETE CASCADE,
  visitor_name    varchar(160) NOT NULL,
  phone           varchar(80) NOT NULL,
  email           varchar(255),
  tickets         integer NOT NULL DEFAULT 1 CHECK (tickets BETWEEN 1 AND 20),
  consent_at      timestamptz NOT NULL,
  created_at      timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS event_bookings_event_idx ON event_bookings (event_id);

CREATE TABLE IF NOT EXISTS cinema_movies (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title           varchar(255) NOT NULL,
  cinema_name     varchar(120) NOT NULL,
  city            varchar(120) NOT NULL,
  genre           varchar(100),
  duration        varchar(50),
  age_rating      varchar(20),
  poster_color    varchar(20),
  price           numeric(10,2),
  pushkin_card    boolean NOT NULL DEFAULT false,
  published       boolean NOT NULL DEFAULT true
);

CREATE TABLE IF NOT EXISTS cinema_sessions (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  movie_id        uuid NOT NULL REFERENCES cinema_movies(id) ON DELETE CASCADE,
  starts_at       timestamptz NOT NULL,
  capacity        integer NOT NULL DEFAULT 0 CHECK (capacity >= 0)
);

CREATE TABLE IF NOT EXISTS cinema_orders (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id      uuid NOT NULL REFERENCES cinema_sessions(id),
  customer_name   varchar(160) NOT NULL,
  phone           varchar(80) NOT NULL,
  tickets         integer NOT NULL DEFAULT 1 CHECK (tickets BETWEEN 1 AND 20),
  status          varchar(30) NOT NULL DEFAULT 'new' CHECK (status IN ('new', 'paid', 'cancelled')),
  created_at      timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS feedback_ideas (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name            varchar(160) NOT NULL,
  idea            text NOT NULL,
  format          varchar(100) NOT NULL,
  contact         varchar(255),
  consent_at      timestamptz NOT NULL,
  created_at      timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS enrollment_requests (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  institution_id  uuid NOT NULL REFERENCES institutions(id),
  parent_name     varchar(160) NOT NULL,
  phone           varchar(80) NOT NULL,
  child_name      varchar(160),
  child_birth_year integer,
  program        varchar(255) NOT NULL,
  message         text,
  consent_at      timestamptz NOT NULL,
  status          varchar(30) NOT NULL DEFAULT 'new' CHECK (status IN ('new', 'in_progress', 'done', 'rejected')),
  created_at      timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS enrollment_requests_institution_idx ON enrollment_requests (institution_id);

CREATE TABLE IF NOT EXISTS staff_users (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email           varchar(255) UNIQUE NOT NULL,
  password_hash   text NOT NULL,
  role            varchar(30) NOT NULL DEFAULT 'editor' CHECK (role IN ('admin', 'editor', 'viewer')),
  created_at      timestamptz NOT NULL DEFAULT now()
);

INSERT INTO site_settings (hero_description, footer_description)
VALUES ('Находите события, бронируйте места и помогайте учреждениям создавать программу, которая действительно нужна людям.', 'Единое пространство для учреждений культуры и их посетителей.')
ON CONFLICT (id) DO NOTHING;

-- Представления для панели учреждения
CREATE OR REPLACE VIEW event_attendance AS
SELECT e.id, e.title, e.capacity, COALESCE(SUM(b.tickets), 0)::integer AS booked,
       GREATEST(e.capacity - COALESCE(SUM(b.tickets), 0), 0)::integer AS available
FROM events e LEFT JOIN event_bookings b ON b.event_id = e.id
GROUP BY e.id, e.title, e.capacity;
