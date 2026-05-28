CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE games (
  id         uuid        PRIMARY KEY DEFAULT uuid_generate_v4(),
  slug       text        NOT NULL UNIQUE,
  name       text        NOT NULL,
  cover_url  text,
  active     boolean     NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE editions (
  id         uuid        PRIMARY KEY DEFAULT uuid_generate_v4(),
  game_id    uuid        NOT NULL REFERENCES games(id),
  year       int         NOT NULL,
  name       text        NOT NULL,
  status     text        NOT NULL DEFAULT 'draft'
               CHECK (status IN ('draft', 'ongoing', 'finished')),
  started_at timestamptz,
  ended_at   timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(game_id, year)
);
