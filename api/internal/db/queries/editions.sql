-- name: ListEditionsByGame :many
SELECT * FROM editions WHERE game_id = $1 ORDER BY year DESC;

-- name: GetActiveEdition :one
SELECT e.* FROM editions e
JOIN games g ON g.id = e.game_id
WHERE g.slug = $1 AND e.status = 'ongoing'
ORDER BY e.year DESC
LIMIT 1;

-- name: GetEditionByID :one
SELECT * FROM editions WHERE id = $1;

-- name: CreateEdition :one
INSERT INTO editions (game_id, year, name, status, started_at)
VALUES ($1, $2, $3, $4, $5)
RETURNING *;

-- name: UpdateEditionStatus :one
UPDATE editions SET status = $2, ended_at = $3 WHERE id = $1 RETURNING *;
