# ──────────── Build stage ────────────
FROM golang:1.25-alpine AS build
WORKDIR /src

RUN apk add --no-cache git ca-certificates tzdata

COPY go.mod go.sum ./
RUN go mod download

COPY . .
RUN CGO_ENABLED=0 GOOS=linux go build -ldflags="-s -w" -o /out/api ./

# ──────────── Migrations stage ────────────
FROM golang:1.25-alpine AS migrate-build
RUN go install -tags 'postgres' github.com/golang-migrate/migrate/v4/cmd/migrate@v4.18.1
# Binário em $GOPATH/bin/migrate (default /go/bin/migrate)

# ──────────── Runtime ────────────
FROM alpine:3.20
RUN apk add --no-cache ca-certificates tzdata wget && \
    addgroup -S app && adduser -S -G app app

WORKDIR /app
COPY --from=build /out/api ./api
COPY --from=migrate-build /go/bin/migrate /usr/local/bin/migrate
COPY --from=build /src/internal/db/migrations ./migrations
COPY docker-entrypoint.sh /usr/local/bin/docker-entrypoint.sh
RUN chmod +x /usr/local/bin/docker-entrypoint.sh

USER app
EXPOSE 8080
ENV PORT=8080 GIN_MODE=release

HEALTHCHECK --interval=30s --timeout=3s --start-period=10s --retries=3 \
  CMD wget -qO- http://localhost:8080/health || exit 1

ENTRYPOINT ["docker-entrypoint.sh"]
CMD ["/app/api"]
