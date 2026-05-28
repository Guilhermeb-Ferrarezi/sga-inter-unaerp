# ──────────── Build stage ────────────
FROM node:22-alpine AS build
WORKDIR /app

# Instala bun via npm (funciona consistentemente)
RUN npm install -g bun@1.3

COPY package.json bun.lock ./
RUN bun install

COPY . .

ARG VITE_GRAPHQL_URL
ARG VITE_SGA_AUTH_URL
ARG VITE_CF_STREAM_BASE
ENV VITE_GRAPHQL_URL=${VITE_GRAPHQL_URL}
ENV VITE_SGA_AUTH_URL=${VITE_SGA_AUTH_URL}
ENV VITE_CF_STREAM_BASE=${VITE_CF_STREAM_BASE}

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
