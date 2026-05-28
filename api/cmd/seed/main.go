package main

import (
	"context"
	"log"
	"os"

	"github.com/jackc/pgx/v5/pgxpool"
	"github.com/joho/godotenv"

	"github.com/sg/unaerp-api/internal/db/seed"
	sqlcdb "github.com/sg/unaerp-api/internal/db/sqlc"
)

func main() {
	_ = godotenv.Load()

	dbURL := os.Getenv("DATABASE_URL")
	if dbURL == "" {
		log.Fatal("DATABASE_URL não definida")
	}

	ctx := context.Background()
	pool, err := pgxpool.New(ctx, dbURL)
	if err != nil {
		log.Fatalf("conectar banco: %v", err)
	}
	defer pool.Close()

	queries := sqlcdb.New(pool)
	if err := seed.Run(ctx, queries); err != nil {
		log.Fatalf("seed: %v", err)
	}

	log.Println("seed concluído ✓")
}
