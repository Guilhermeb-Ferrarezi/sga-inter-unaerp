-- name: ListGames :many
SELECT * FROM games ORDER BY name;

-- name: GetGameBySlug :one
SELECT * FROM games WHERE slug = $1;

-- name: CreateGame :one
INSERT INTO games (slug, name, cover_url, active)
VALUES ($1, $2, $3, $4)
RETURNING *;

-- name: UpdateGame :one
UPDATE games
SET name = $2, cover_url = $3, active = $4
WHERE id = $1
RETURNING *;

-- name: GetGameByID :one
SELECT * FROM games WHERE id = $1;
