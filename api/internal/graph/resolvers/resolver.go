package resolvers

import (
	"github.com/jackc/pgx/v5/pgxpool"
	"github.com/redis/go-redis/v9"
	"github.com/sg/unaerp-api/internal/config"
	sqlcdb "github.com/sg/unaerp-api/internal/db/sqlc"
)

// This file will not be regenerated automatically.
//
// It serves as dependency injection for your app, add any dependencies you require here.

type Resolver struct {
	DB     *sqlcdb.Queries
	Pool   *pgxpool.Pool
	Redis  *redis.Client
	Config *config.Config
}
