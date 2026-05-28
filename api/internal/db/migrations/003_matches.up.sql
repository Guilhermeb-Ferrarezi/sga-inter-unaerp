CREATE TABLE matches (
  id           uuid        PRIMARY KEY DEFAULT uuid_generate_v4(),
  edition_id   uuid        NOT NULL REFERENCES editions(id) ON DELETE CASCADE,
  team_a_id    uuid        NOT NULL REFERENCES edition_teams(id),
  team_b_id    uuid        NOT NULL REFERENCES edition_teams(id),
  round        text        NOT NULL,
  scheduled_at timestamptz,
  status       text        NOT NULL DEFAULT 'scheduled'
                 CHECK (status IN ('scheduled', 'live', 'done')),
  created_at   timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE match_results (
  id        uuid        PRIMARY KEY DEFAULT uuid_generate_v4(),
  match_id  uuid        NOT NULL UNIQUE REFERENCES matches(id) ON DELETE CASCADE,
  winner_id uuid        NOT NULL REFERENCES edition_teams(id),
  map       text,
  score_a   int         NOT NULL DEFAULT 0,
  score_b   int         NOT NULL DEFAULT 0,
  played_at timestamptz NOT NULL DEFAULT now()
);
