package seed

import (
	"context"
	"time"

	"github.com/jackc/pgx/v5/pgtype"
	sqlcdb "github.com/sg/unaerp-api/internal/db/sqlc"
)

func Run(ctx context.Context, q *sqlcdb.Queries) error {
	// Game
	game, err := q.CreateGame(ctx, sqlcdb.CreateGameParams{
		Slug:   "valorant",
		Name:   "Valorant",
		Active: true,
	})
	if err != nil {
		return err
	}

	// Edition
	now := pgtype.Timestamptz{Time: time.Now(), Valid: true}
	edition, err := q.CreateEdition(ctx, sqlcdb.CreateEditionParams{
		GameID:    game.ID,
		Year:      2025,
		Name:      "Inter UnaERP 2025",
		Status:    "ongoing",
		StartedAt: now,
	})
	if err != nil {
		return err
	}

	// Teams seed
	teams := []struct{ name, slug, color string }{
		{"Olimpo", "olimpo", "#818cf8"},
		{"Thunder", "thunder", "#22c55e"},
		{"Dragon", "dragon", "#ef4444"},
		{"Storm", "storm", "#60a5fa"},
		{"Lynx", "lynx", "#facc15"},
		{"Fênix", "fenix", "#d97706"},
		{"Nova", "nova", "#ec4899"},
		{"Titan", "titan", "#f97316"},
		{"Eclipse", "eclipse", "#a855f7"},
	}

	edTeams := make([]sqlcdb.EditionTeam, 0, len(teams))
	for i, t := range teams {
		color := t.color
		team, err := q.CreateTeam(ctx, sqlcdb.CreateTeamParams{
			Name:         t.name,
			Slug:         t.slug,
			PrimaryColor: &color,
		})
		if err != nil {
			return err
		}
		seed := int32(i + 1)
		et, err := q.AddTeamToEdition(ctx, sqlcdb.AddTeamToEditionParams{
			EditionID: edition.ID,
			TeamID:    team.ID,
			Seed:      &seed,
		})
		if err != nil {
			return err
		}
		edTeams = append(edTeams, et)
	}

	// Matches seed
	matchups := []struct{ a, b int }{
		{0, 1}, {2, 3}, {4, 5}, {6, 7},
		{1, 2}, {0, 3}, {4, 6}, {5, 8},
	}
	maps := []string{"Ascent", "Bind", "Haven", "Pearl", "Lotus"}
	rounds := []string{"Grupo A", "Grupo B", "Grupo A", "Grupo B", "Grupo A", "Grupo B", "Grupo C", "Grupo C"}

	for i, m := range matchups {
		match, err := q.CreateMatch(ctx, sqlcdb.CreateMatchParams{
			EditionID: edition.ID,
			TeamAID:   edTeams[m.a].ID,
			TeamBID:   edTeams[m.b].ID,
			Round:     rounds[i],
		})
		if err != nil {
			return err
		}

		// Record results for first 4 matches; leave others scheduled
		if i < 4 {
			winner := edTeams[m.a].ID
			scoreA, scoreB := int32(13), int32(7+i*2)
			mapName := maps[i%len(maps)]
			played := pgtype.Timestamptz{Time: time.Now().Add(-time.Duration(i+1) * 24 * time.Hour), Valid: true}

			_, err = q.RecordMatchResult(ctx, sqlcdb.RecordMatchResultParams{
				MatchID:  match.ID,
				WinnerID: winner,
				Map:      &mapName,
				ScoreA:   scoreA,
				ScoreB:   scoreB,
				PlayedAt: played,
			})
			if err != nil {
				return err
			}
			_, err = q.UpdateMatchStatus(ctx, sqlcdb.UpdateMatchStatusParams{
				ID:     match.ID,
				Status: "done",
			})
			if err != nil {
				return err
			}
			// Update wins/losses
			_, err = q.UpdateEditionTeamStats(ctx, sqlcdb.UpdateEditionTeamStatsParams{
				ID:     edTeams[m.a].ID,
				Wins:   1,
				Losses: 0,
			})
			if err != nil {
				return err
			}
			_, err = q.UpdateEditionTeamStats(ctx, sqlcdb.UpdateEditionTeamStatsParams{
				ID:     edTeams[m.b].ID,
				Wins:   0,
				Losses: 1,
			})
			if err != nil {
				return err
			}
		}
	}

	return nil
}
