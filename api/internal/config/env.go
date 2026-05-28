package config

import (
	"log"
	"os"
	"strings"

	"github.com/joho/godotenv"
)

type Config struct {
	Port        string
	DatabaseURL string
	RedisURL    string
	JWTSecret   string
	CORSOrigins []string
	Env         string

	CFAccountID    string
	CFR2AccessKey  string
	CFR2SecretKey  string
	CFR2BucketName string
	CFR2PublicURL  string
	CFStreamToken  string
}

func Load() *Config {
	_ = godotenv.Load()

	cfg := &Config{
		Port:        getEnv("PORT", "8080"),
		DatabaseURL: mustEnv("DATABASE_URL"),
		RedisURL:    getEnv("REDIS_URL", "redis://localhost:6379"),
		JWTSecret:   mustEnv("JWT_SECRET"),
		CORSOrigins: strings.Split(getEnv("CORS_ORIGINS", "http://localhost:5173"), ","),
		Env:         getEnv("APP_ENV", "development"),

		CFAccountID:    mustEnv("CF_ACCOUNT_ID"),
		CFR2AccessKey:  mustEnv("CF_R2_ACCESS_KEY"),
		CFR2SecretKey:  mustEnv("CF_R2_SECRET_KEY"),
		CFR2BucketName: mustEnv("CF_R2_BUCKET_NAME"),
		CFR2PublicURL:  mustEnv("CF_R2_PUBLIC_URL"),
		CFStreamToken:  mustEnv("CF_STREAM_TOKEN"),
	}
	return cfg
}

func getEnv(key, fallback string) string {
	if v := os.Getenv(key); v != "" {
		return v
	}
	return fallback
}

func mustEnv(key string) string {
	v := os.Getenv(key)
	if v == "" {
		log.Fatalf("variável de ambiente obrigatória não definida: %s", key)
	}
	return v
}

func (c *Config) IsDev() bool {
	return c.Env != "production"
}
