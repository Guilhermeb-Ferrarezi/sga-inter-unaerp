CREATE TABLE highlights (
  id            uuid        PRIMARY KEY DEFAULT uuid_generate_v4(),
  edition_id    uuid        NOT NULL REFERENCES editions(id) ON DELETE CASCADE,
  match_id      uuid        REFERENCES matches(id) ON DELETE SET NULL,
  cf_stream_id  text        NOT NULL,
  title         text        NOT NULL,
  thumbnail_url text,
  published_at  timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE media (
  id         uuid        PRIMARY KEY DEFAULT uuid_generate_v4(),
  edition_id uuid        NOT NULL REFERENCES editions(id) ON DELETE CASCADE,
  match_id   uuid        REFERENCES matches(id) ON DELETE SET NULL,
  r2_key     text        NOT NULL,
  url        text        NOT NULL,
  caption    text,
  type       text        NOT NULL DEFAULT 'photo'
               CHECK (type IN ('photo', 'cover', 'logo')),
  created_at timestamptz NOT NULL DEFAULT now()
);
