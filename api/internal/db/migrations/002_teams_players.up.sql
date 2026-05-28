CREATE TABLE teams (
  id            uuid        PRIMARY KEY DEFAULT uuid_generate_v4(),
  name          text        NOT NULL,
  slug          text        NOT NULL UNIQUE,
  logo_url      text,
  primary_color text,
  created_at    timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE edition_teams (
  id               uuid        PRIMARY KEY DEFAULT uuid_generate_v4(),
  edition_id       uuid        NOT NULL REFERENCES editions(id) ON DELETE CASCADE,
  team_id          uuid        NOT NULL REFERENCES teams(id),
  seed             int,
  final_placement  int,
  wins             int         NOT NULL DEFAULT 0,
  losses           int         NOT NULL DEFAULT 0,
  created_at       timestamptz NOT NULL DEFAULT now(),
  UNIQUE(edition_id, team_id)
);

CREATE TABLE players (
  id          uuid        PRIMARY KEY DEFAULT uuid_generate_v4(),
  sga_user_id int,
  ign         text        NOT NULL,
  avatar_url  text,
  role        text,
  created_at  timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE rosters (
  id               uuid        PRIMARY KEY DEFAULT uuid_generate_v4(),
  edition_team_id  uuid        NOT NULL REFERENCES edition_teams(id) ON DELETE CASCADE,
  player_id        uuid        NOT NULL REFERENCES players(id),
  is_captain       boolean     NOT NULL DEFAULT false,
  created_at       timestamptz NOT NULL DEFAULT now(),
  UNIQUE(edition_team_id, player_id)
);
