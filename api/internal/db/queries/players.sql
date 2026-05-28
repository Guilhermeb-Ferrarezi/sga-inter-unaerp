-- name: GetPlayerByID :one
SELECT * FROM players WHERE id = $1;

-- name: ListPlayersByEditionTeam :many
SELECT p.*, r.is_captain, r.edition_team_id
FROM players p
JOIN rosters r ON r.player_id = p.id
WHERE r.edition_team_id = $1
ORDER BY r.is_captain DESC, p.ign;

-- name: CreatePlayer :one
INSERT INTO players (sga_user_id, ign, avatar_url, role)
VALUES ($1, $2, $3, $4)
RETURNING *;

-- name: UpdatePlayer :one
UPDATE players SET ign = $2, avatar_url = $3, role = $4 WHERE id = $1 RETURNING *;

-- name: AddPlayerToRoster :one
INSERT INTO rosters (edition_team_id, player_id, is_captain)
VALUES ($1, $2, $3)
RETURNING *;
