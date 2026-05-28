package main

import (
	"log"

	"github.com/gin-gonic/gin"
	"github.com/sg/unaerp-api/internal/config"
	"github.com/sg/unaerp-api/internal/middleware"
)

func main() {
	cfg := config.Load()

	r := gin.Default()
	r.Use(middleware.CORS(cfg.CORSOrigins))
	r.Use(middleware.Auth(cfg.JWTSecret))

	r.GET("/health", func(c *gin.Context) {
		c.JSON(200, gin.H{"status": "ok"})
	})

	log.Printf("API rodando na porta %s", cfg.Port)
	if err := r.Run(":" + cfg.Port); err != nil {
		log.Fatalf("erro ao iniciar servidor: %v", err)
	}
}
