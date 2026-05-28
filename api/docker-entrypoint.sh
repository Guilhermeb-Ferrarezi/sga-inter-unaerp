#!/bin/sh
set -e

# Roda migrations automaticamente se DATABASE_URL estiver setada
if [ -n "$DATABASE_URL" ]; then
  echo "Rodando migrations contra o banco..."
  migrate -path /app/migrations -database "$DATABASE_URL" up || {
    echo "Aviso: migrations falharam (provavelmente já aplicadas), seguindo..."
  }
fi

exec "$@"
