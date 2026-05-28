# ──────────── Build stage ────────────
FROM oven/bun:1.1-alpine AS build
WORKDIR /app

COPY package.json bun.lock ./
RUN bun install --frozen-lockfile

COPY . .

ARG VITE_GRAPHQL_URL
ARG VITE_SGA_AUTH_URL
ENV VITE_GRAPHQL_URL=${VITE_GRAPHQL_URL}
ENV VITE_SGA_AUTH_URL=${VITE_SGA_AUTH_URL}

RUN bun run build

# ──────────── Runtime stage ────────────
FROM nginx:1.27-alpine
WORKDIR /usr/share/nginx/html

RUN rm -rf ./*
COPY --from=build /app/dist .
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD wget -q --spider http://localhost/ || exit 1

CMD ["nginx", "-g", "daemon off;"]
