-- name: ListHighlightsByEdition :many
SELECT * FROM highlights
WHERE edition_id = $1
ORDER BY published_at DESC;

-- name: CreateHighlight :one
INSERT INTO highlights (edition_id, match_id, cf_stream_id, title, thumbnail_url, published_at)
VALUES ($1, $2, $3, $4, $5, $6)
RETURNING *;

-- name: ListMediaByEdition :many
SELECT * FROM media
WHERE edition_id = $1 AND type = $2
ORDER BY created_at DESC;

-- name: CreateMedia :one
INSERT INTO media (edition_id, match_id, r2_key, url, caption, type)
VALUES ($1, $2, $3, $4, $5, $6)
RETURNING *;
