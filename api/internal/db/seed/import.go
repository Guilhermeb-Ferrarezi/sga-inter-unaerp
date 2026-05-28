package seed

import (
	"context"
	"encoding/json"
	"fmt"
	"time"

	"github.com/jackc/pgx/v5/pgtype"
	sqlcdb "github.com/sg/unaerp-api/internal/db/sqlc"
)

type ImportPayload struct {
	Game    string        `json:"game"`
	Year    int           `json:"year"`
	Name    string        `json:"name"`
	Teams   []ImportTeam  `json:"teams"`
	Matches []ImportMatch `json:"matches"`
}

type ImportTeam struct {
	Name    string         `json:"name"`
	Slug    string         `json:"slug"`
	Color   string         `json:"color"`
	Players []ImportPlayer `json:"players"`
}

type ImportPlayer struct {
	Ign       string `json:"ign"`
	Role      string `json:"role"`
	IsCaptain bool   `json:"isCaptain"`
}

type ImportMatch struct {
	TeamA  string `json:"teamA"`
	TeamB  string `json:"teamB"`
	Round  string `json:"round"`
	Map    string `json:"map,omitempty"`
	ScoreA int    `json:"scoreA"`
	ScoreB int    `json:"scoreB"`
	Winner string `json:"winner"`
}

func ParseImport(raw string) (*ImportPayload, error) {
	var p ImportPayload
	if err := json.Unmarshal([]byte(raw), &p); err != nil {
		return nil, err
	}
	if p.Game == "" || p.Year == 0 || len(p.Teams) == 0 {
		return nil, fmt.Errorf("payload incompleto: game, year e teams são obrigatórios")
	}
	return &p, nil
}

// Import inserts a historical edition with teams, players, matches, and results.
// Idempotency note: this assumes the game already exists (by slug); duplicate
// edition years for the same game will fail the UNIQUE(game_id, year) constraint.
func Import(ctx context.Context, q *sqlcdb.Queries, data *ImportPayload) error {
	game, err := q.GetGameBySlug(ctx, data.Game)
	if err != nil {
		return fmt.Errorf("game %q não encontrado: %w", data.Game, err)
	}

	now := pgtype.Timestamptz{Time: time.Now(), Valid: true}
	edition, err := q.CreateEdition(ctx, sqlcdb.CreateEditionParams{
		GameID:    game.ID,
		Year:      int32(data.Year),
		Name:      data.Name,
		Status:    "finished",
		StartedAt: now,
	})
	if err != nil {
		return fmt.Errorf("criar edição: %w", err)
	}

	editionTeamBySlug := make(map[string]sqlcdb.EditionTeam, len(data.Teams))

	for _, t := range data.Teams {
		color := t.Color
		team, err := q.CreateTeam(ctx, sqlcdb.CreateTeamParams{
			Name:         t.Name,
			Slug:         t.Slug,
			PrimaryColor: &color,
		})
		if err != nil {
			return fmt.Errorf("criar time %s: %w", t.Slug, err)
		}

		et, err := q.AddTeamToEdition(ctx, sqlcdb.AddTeamToEditionParams{
			EditionID: edition.ID,
			TeamID:    team.ID,
		})
		if err != nil {
			return fmt.Errorf("adicionar time %s à edição: %w", t.Slug, err)
		}
		editionTeamBySlug[t.Slug] = et

		for _, p := range t.Players {
			role := p.Role
			player, err := q.CreatePlayer(ctx, sqlcdb.CreatePlayerParams{
				Ign:  p.Ign,
				Role: &role,
			})
			if err != nil {
				return fmt.Errorf("criar jogador %s: %w", p.Ign, err)
			}
			if _, err := q.AddPlayerToRoster(ctx, sqlcdb.AddPlayerToRosterParams{
				EditionTeamID: et.ID,
				PlayerID:      player.ID,
				IsCaptain:     p.IsCaptain,
			}); err != nil {
				return fmt.Errorf("roster %s: %w", p.Ign, err)
			}
		}
	}

	for _, m := range data.Matches {
		teamA, okA := editionTeamBySlug[m.TeamA]
		teamB, okB := editionTeamBySlug[m.TeamB]
		winner, okW := editionTeamBySlug[m.Winner]
		if !okA || !okB || !okW {
			return fmt.Errorf("partida referencia time inexistente: %s vs %s (winner=%s)", m.TeamA, m.TeamB, m.Winner)
		}

		match, err := q.CreateMatch(ctx, sqlcdb.CreateMatchParams{
			EditionID: edition.ID,
			TeamAID:   teamA.ID,
			TeamBID:   teamB.ID,
			Round:     m.Round,
		})
		if err != nil {
			return fmt.Errorf("criar partida: %w", err)
		}

		mapName := m.Map
		var mapPtr *string
		if mapName != "" {
			mapPtr = &mapName
		}

		if _, err := q.RecordMatchResult(ctx, sqlcdb.RecordMatchResultParams{
			MatchID:  match.ID,
			WinnerID: winner.ID,
			Map:      mapPtr,
			ScoreA:   int32(m.ScoreA),
			ScoreB:   int32(m.ScoreB),
			PlayedAt: pgtype.Timestamptz{Time: time.Now(), Valid: true},
		}); err != nil {
			return fmt.Errorf("registrar resultado: %w", err)
		}

		if _, err := q.UpdateMatchStatus(ctx, sqlcdb.UpdateMatchStatusParams{
			ID:     match.ID,
			Status: "done",
		}); err != nil {
			return fmt.Errorf("atualizar status: %w", err)
		}

		// Update wins/losses
		aWin, aLoss := int32(0), int32(1)
		bWin, bLoss := int32(1), int32(0)
		if winner.ID == teamA.ID {
			aWin, aLoss = 1, 0
			bWin, bLoss = 0, 1
		}
		if _, err := q.UpdateEditionTeamStats(ctx, sqlcdb.UpdateEditionTeamStatsParams{
			ID: teamA.ID, Wins: aWin, Losses: aLoss,
		}); err != nil {
			return fmt.Errorf("stats teamA: %w", err)
		}
		if _, err := q.UpdateEditionTeamStats(ctx, sqlcdb.UpdateEditionTeamStatsParams{
			ID: teamB.ID, Wins: bWin, Losses: bLoss,
		}); err != nil {
			return fmt.Errorf("stats teamB: %w", err)
		}
	}

	return nil
}
