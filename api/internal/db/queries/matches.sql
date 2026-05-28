-- name: ListMatchesByEdition :many
SELECT m.*, mr.winner_id, mr.map, mr.score_a, mr.score_b, mr.played_at
FROM matches m
LEFT JOIN match_results mr ON mr.match_id = m.id
WHERE m.edition_id = $1
ORDER BY COALESCE(mr.played_at, m.scheduled_at) DESC;

-- name: GetMatchByID :one
SELECT m.*, mr.winner_id, mr.map, mr.score_a, mr.score_b, mr.played_at
FROM matches m
LEFT JOIN match_results mr ON mr.match_id = m.id
WHERE m.id = $1;

-- name: CreateMatch :one
INSERT INTO matches (edition_id, team_a_id, team_b_id, round, scheduled_at)
VALUES ($1, $2, $3, $4, $5)
RETURNING *;

-- name: RecordMatchResult :one
INSERT INTO match_results (match_id, winner_id, map, score_a, score_b, played_at)
VALUES ($1, $2, $3, $4, $5, $6)
RETURNING *;

-- name: UpdateMatchStatus :one
UPDATE matches SET status = $2 WHERE id = $1 RETURNING *;
