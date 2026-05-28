-- name: ListTeamsByEdition :many
SELECT t.*, et.id AS edition_team_id, et.seed, et.final_placement, et.wins, et.losses
FROM teams t
JOIN edition_teams et ON et.team_id = t.id
WHERE et.edition_id = $1
ORDER BY et.wins DESC, et.losses ASC;

-- name: GetTeamBySlug :one
SELECT * FROM teams WHERE slug = $1;

-- name: GetEditionTeamByID :one
SELECT * FROM edition_teams WHERE id = $1;

-- name: CreateTeam :one
INSERT INTO teams (name, slug, logo_url, primary_color)
VALUES ($1, $2, $3, $4)
RETURNING *;

-- name: UpdateTeam :one
UPDATE teams SET name = $2, logo_url = $3, primary_color = $4 WHERE id = $1 RETURNING *;

-- name: AddTeamToEdition :one
INSERT INTO edition_teams (edition_id, team_id, seed)
VALUES ($1, $2, $3)
RETURNING *;

-- name: UpdateEditionTeamStats :one
UPDATE edition_teams
SET wins = wins + $2, losses = losses + $3
WHERE id = $1
RETURNING *;

-- name: SetFinalPlacement :one
UPDATE edition_teams SET final_placement = $2 WHERE id = $1 RETURNING *;
