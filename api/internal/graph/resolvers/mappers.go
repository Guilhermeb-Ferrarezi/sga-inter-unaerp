package resolvers

import (
	"time"

	"github.com/jackc/pgx/v5/pgtype"
	db "github.com/sg/unaerp-api/internal/db/sqlc"
	"github.com/sg/unaerp-api/internal/graph/model"
)

// ---- timestamp helpers ----

func tsToTime(ts pgtype.Timestamptz) time.Time {
	return ts.Time
}

func tsToPtr(ts pgtype.Timestamptz) *time.Time {
	if !ts.Valid {
		return nil
	}
	t := ts.Time
	return &t
}

func int32PtrToIntPtr(v *int32) *int {
	if v == nil {
		return nil
	}
	i := int(*v)
	return &i
}

// ---- Game ----

func gameToModel(g db.Game) *model.Game {
	return &model.Game{
		ID:       g.ID,
		Slug:     g.Slug,
		Name:     g.Name,
		CoverURL: g.CoverUrl,
		Active:   g.Active,
	}
}

// ---- Edition ----

// editionToModel converts a db.Edition to model.Edition.
// game must be pre-fetched and passed in; teams may be nil (lazy).
func editionToModel(e db.Edition, game *model.Game) *model.Edition {
	return &model.Edition{
		ID:        e.ID,
		Game:      game,
		Year:      int(e.Year),
		Name:      e.Name,
		Status:    e.Status,
		StartedAt: tsToPtr(e.StartedAt),
		EndedAt:   tsToPtr(e.EndedAt),
		Teams:     []*model.EditionTeam{},
	}
}

// ---- Team ----

func teamToModel(t db.Team) *model.Team {
	return &model.Team{
		ID:           t.ID,
		Name:         t.Name,
		Slug:         t.Slug,
		LogoURL:      t.LogoUrl,
		PrimaryColor: t.PrimaryColor,
	}
}

// ---- EditionTeam from ListTeamsByEditionRow ----

// editionTeamFromRow builds an EditionTeam model from the combined row.
// edition is pre-fetched and passed in.
func editionTeamFromRow(row db.ListTeamsByEditionRow, edition *model.Edition) *model.EditionTeam {
	team := &model.Team{
		ID:           row.ID,
		Name:         row.Name,
		Slug:         row.Slug,
		LogoURL:      row.LogoUrl,
		PrimaryColor: row.PrimaryColor,
	}
	return &model.EditionTeam{
		ID:             row.EditionTeamID,
		Team:           team,
		Edition:        edition,
		Seed:           int32PtrToIntPtr(row.Seed),
		FinalPlacement: int32PtrToIntPtr(row.FinalPlacement),
		Wins:           int(row.Wins),
		Losses:         int(row.Losses),
		Roster:         []*model.RosterEntry{},
	}
}

// ---- Match result ----

// matchResultFromRow builds a MatchResult if result data is present.
// winner is the EditionTeam for the winner (may be nil if not found).
func matchResultFromGetRow(row db.GetMatchByIDRow, winner *model.EditionTeam) *model.MatchResult {
	if row.WinnerID == nil {
		return nil
	}
	scoreA := 0
	scoreB := 0
	if row.ScoreA != nil {
		scoreA = int(*row.ScoreA)
	}
	if row.ScoreB != nil {
		scoreB = int(*row.ScoreB)
	}
	return &model.MatchResult{
		Winner:   winner,
		Map:      row.Map,
		ScoreA:   scoreA,
		ScoreB:   scoreB,
		PlayedAt: tsToTime(row.PlayedAt),
	}
}

func matchResultFromListRow(row db.ListMatchesByEditionRow, winner *model.EditionTeam) *model.MatchResult {
	if row.WinnerID == nil {
		return nil
	}
	scoreA := 0
	scoreB := 0
	if row.ScoreA != nil {
		scoreA = int(*row.ScoreA)
	}
	if row.ScoreB != nil {
		scoreB = int(*row.ScoreB)
	}
	return &model.MatchResult{
		Winner:   winner,
		Map:      row.Map,
		ScoreA:   scoreA,
		ScoreB:   scoreB,
		PlayedAt: tsToTime(row.PlayedAt),
	}
}

// ---- Match from GetMatchByIDRow ----

func matchFromGetRow(
	row db.GetMatchByIDRow,
	edition *model.Edition,
	teamA *model.EditionTeam,
	teamB *model.EditionTeam,
	result *model.MatchResult,
) *model.Match {
	return &model.Match{
		ID:          row.ID,
		Edition:     edition,
		TeamA:       teamA,
		TeamB:       teamB,
		Round:       row.Round,
		ScheduledAt: tsToPtr(row.ScheduledAt),
		Status:      row.Status,
		Result:      result,
	}
}

// ---- Match from ListMatchesByEditionRow ----

func matchFromListRow(
	row db.ListMatchesByEditionRow,
	edition *model.Edition,
	teamA *model.EditionTeam,
	teamB *model.EditionTeam,
	result *model.MatchResult,
) *model.Match {
	return &model.Match{
		ID:          row.ID,
		Edition:     edition,
		TeamA:       teamA,
		TeamB:       teamB,
		Round:       row.Round,
		ScheduledAt: tsToPtr(row.ScheduledAt),
		Status:      row.Status,
		Result:      result,
	}
}

// ---- Player ----

func playerToModel(p db.Player) *model.Player {
	var sgaUserID *int
	if p.SgaUserID != nil {
		v := int(*p.SgaUserID)
		sgaUserID = &v
	}
	return &model.Player{
		ID:        p.ID,
		SgaUserID: sgaUserID,
		Ign:       p.Ign,
		AvatarURL: p.AvatarUrl,
		Role:      p.Role,
	}
}

// ---- Highlight ----

func highlightToModel(h db.Highlight, edition *model.Edition) *model.Highlight {
	return &model.Highlight{
		ID:           h.ID,
		Edition:      edition,
		Match:        nil, // not pre-fetched in list queries
		CfStreamID:   h.CfStreamID,
		Title:        h.Title,
		ThumbnailURL: h.ThumbnailUrl,
		PublishedAt:  tsToTime(h.PublishedAt),
	}
}

// ---- Media ----

func mediaToModel(m db.Medium, edition *model.Edition) *model.Media {
	return &model.Media{
		ID:      m.ID,
		Edition: edition,
		Match:   nil, // not pre-fetched in list queries
		R2Key:   m.R2Key,
		URL:     m.Url,
		Caption: m.Caption,
		Type:    m.Type,
	}
}
