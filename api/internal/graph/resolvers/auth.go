package resolvers

import (
	"context"
	"errors"

	"github.com/sg/unaerp-api/internal/middleware"
)

var errUnauthorized = errors.New("autenticação necessária")

func requireAuth(ctx context.Context) error {
	if middleware.UserFromContext(ctx) == nil {
		return errUnauthorized
	}
	return nil
}
