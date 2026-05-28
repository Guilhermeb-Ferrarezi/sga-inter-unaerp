# ──────────── Build stage ────────────
FROM node:22-alpine AS build
WORKDIR /app

# Copia tudo (sem bun.lock — vamos gerar package-lock.json com npm)
COPY package.json ./

# Instala via npm (mais previsível em containers do que bun)
RUN npm install --no-audit --no-fund --legacy-peer-deps

COPY . .

ARG VITE_GRAPHQL_URL
ARG VITE_SGA_AUTH_URL
ARG VITE_CF_STREAM_BASE
ENV VITE_GRAPHQL_URL=${VITE_GRAPHQL_URL}
ENV VITE_SGA_AUTH_URL=${VITE_SGA_AUTH_URL}
ENV VITE_CF_STREAM_BASE=${VITE_CF_STREAM_BASE}

RUN npm run build

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
