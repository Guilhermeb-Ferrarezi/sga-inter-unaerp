package main

import (
	"context"
	"log"

	"github.com/99designs/gqlgen/graphql/handler"
	"github.com/99designs/gqlgen/graphql/playground"
	"github.com/gin-gonic/gin"

	"github.com/sg/unaerp-api/internal/cache"
	"github.com/sg/unaerp-api/internal/config"
	dbconn "github.com/sg/unaerp-api/internal/db"
	sqlcdb "github.com/sg/unaerp-api/internal/db/sqlc"
	"github.com/sg/unaerp-api/internal/graph/generated"
	"github.com/sg/unaerp-api/internal/graph/resolvers"
	"github.com/sg/unaerp-api/internal/middleware"
	"github.com/sg/unaerp-api/internal/storage"
)

func main() {
	cfg := config.Load()
	ctx := context.Background()

	pool, err := dbconn.Connect(ctx, cfg.DatabaseURL)
	if err != nil {
		log.Fatalf("banco: %v", err)
	}
	defer pool.Close()

	redisClient, err := cache.New(cfg.RedisURL)
	if err != nil {
		log.Fatalf("redis: %v", err)
	}

	queries := sqlcdb.New(pool)

	r2Client := storage.NewR2(
		cfg.CFAccountID,
		cfg.CFR2AccessKey,
		cfg.CFR2SecretKey,
		cfg.CFR2BucketName,
		cfg.CFR2PublicURL,
	)

	streamClient := storage.NewStream(cfg.CFAccountID, cfg.CFStreamToken)

	resolver := &resolvers.Resolver{
		DB:     queries,
		Pool:   pool,
		Redis:  redisClient.Underlying(),
		Config: cfg,
		R2:     r2Client,
		Stream: streamClient,
	}

	schema := generated.NewExecutableSchema(generated.Config{Resolvers: resolver})
	gqlHandler := handler.NewDefaultServer(schema)

	r := gin.Default()
	r.Use(middleware.CORS(cfg.CORSOrigins))
	r.Use(middleware.Auth(cfg.JWTSecret))

	// Helper que registra todas as rotas num grupo (acesso via prefix e direto)
	mountRoutes := func(rg gin.IRoutes) {
		rg.GET("/health", func(c *gin.Context) {
			c.JSON(200, gin.H{"status": "ok"})
		})

		rg.POST("/graphql", func(c *gin.Context) {
			gqlHandler.ServeHTTP(c.Writer, c.Request)
		})

		if cfg.IsDev() {
			rg.GET("/graphql", func(c *gin.Context) {
				gqlHandler.ServeHTTP(c.Writer, c.Request)
			})
			rg.GET("/playground", func(c *gin.Context) {
				playground.Handler("Inter UnaERP", "/graphql").ServeHTTP(c.Writer, c.Request)
			})
		}
	}

	// Rotas direto na raiz (acesso via easypanel.host)
	mountRoutes(r)
	// Mesmas rotas sob o prefixo do reverse proxy do santos-games.com
	mountRoutes(r.Group("/universitarios/inter-unaerp/api"))

	if cfg.IsDev() {
		log.Printf("Playground habilitado em /playground (APP_ENV=%s)", cfg.Env)
	}

	log.Printf("API rodando na porta %s", cfg.Port)
	if err := r.Run(":" + cfg.Port); err != nil {
		log.Fatalf("erro ao iniciar servidor: %v", err)
	}
}
