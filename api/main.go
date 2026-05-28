package main

import (
	"context"
	"log"
	"strings"

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

	// Aceita também requests vindas do reverse proxy do santos-games.com
	// sob o path /universitarios/inter-unaerp/api/* — strippa o prefixo
	// antes do roteamento.
	const apiPrefix = "/universitarios/inter-unaerp/api"
	r.Use(func(c *gin.Context) {
		if strings.HasPrefix(c.Request.URL.Path, apiPrefix) {
			c.Request.URL.Path = strings.TrimPrefix(c.Request.URL.Path, apiPrefix)
			if c.Request.URL.Path == "" {
				c.Request.URL.Path = "/"
			}
		}
		c.Next()
	})

	r.Use(middleware.CORS(cfg.CORSOrigins))
	r.Use(middleware.Auth(cfg.JWTSecret))

	r.GET("/health", func(c *gin.Context) {
		c.JSON(200, gin.H{"status": "ok"})
	})

	r.POST("/graphql", func(c *gin.Context) {
		gqlHandler.ServeHTTP(c.Writer, c.Request)
	})

	if cfg.IsDev() {
		r.GET("/graphql", func(c *gin.Context) {
			gqlHandler.ServeHTTP(c.Writer, c.Request)
		})
		r.GET("/playground", func(c *gin.Context) {
			playground.Handler("Inter UnaERP", "/graphql").ServeHTTP(c.Writer, c.Request)
		})
		log.Printf("Playground habilitado em /playground (APP_ENV=%s)", cfg.Env)
	}

	log.Printf("API rodando na porta %s", cfg.Port)
	if err := r.Run(":" + cfg.Port); err != nil {
		log.Fatalf("erro ao iniciar servidor: %v", err)
	}
}
