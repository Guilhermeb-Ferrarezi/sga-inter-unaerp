package middleware

import (
	"context"
	"net/http"
	"strings"

	"github.com/gin-gonic/gin"
	"github.com/golang-jwt/jwt/v5"
)

type contextKey string

const UserContextKey contextKey = "auth_user"

type AuthUser struct {
	UserID    int
	Email     string
	Login     string
	Role      int
	SessionID string
}

type sgaClaims struct {
	UserID    int    `json:"userId"`
	Email     string `json:"email"`
	Login     string `json:"login"`
	Role      int    `json:"role"`
	SessionID string `json:"sessionId,omitempty"`
	jwt.RegisteredClaims
}

func Auth(jwtSecret string) gin.HandlerFunc {
	return func(c *gin.Context) {
		token := extractToken(c)
		if token == "" {
			c.Next()
			return
		}

		parsed, err := jwt.ParseWithClaims(token, &sgaClaims{}, func(t *jwt.Token) (any, error) {
			if _, ok := t.Method.(*jwt.SigningMethodHMAC); !ok {
				return nil, jwt.ErrSignatureInvalid
			}
			return []byte(jwtSecret), nil
		})
		if err != nil || !parsed.Valid {
			c.Next()
			return
		}

		claims, ok := parsed.Claims.(*sgaClaims)
		if !ok {
			c.Next()
			return
		}

		user := &AuthUser{
			UserID:    claims.UserID,
			Email:     claims.Email,
			Login:     claims.Login,
			Role:      claims.Role,
			SessionID: claims.SessionID,
		}
		ctx := context.WithValue(c.Request.Context(), UserContextKey, user)
		c.Request = c.Request.WithContext(ctx)
		c.Next()
	}
}

func RequireAuth() gin.HandlerFunc {
	return func(c *gin.Context) {
		if UserFromContext(c.Request.Context()) == nil {
			c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"error": "autenticação necessária"})
			return
		}
		c.Next()
	}
}

func UserFromContext(ctx context.Context) *AuthUser {
	u, _ := ctx.Value(UserContextKey).(*AuthUser)
	return u
}

func extractToken(c *gin.Context) string {
	if cookie, err := c.Cookie("sg_auth"); err == nil && cookie != "" {
		return cookie
	}
	if auth := c.GetHeader("Authorization"); strings.HasPrefix(auth, "Bearer ") {
		return strings.TrimPrefix(auth, "Bearer ")
	}
	return ""
}
