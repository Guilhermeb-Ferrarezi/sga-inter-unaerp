FROM nginx:alpine
# API_UPSTREAM: host:port do serviço da API (default: inter-unaerp-api:8080).
# Define no Easypanel se o serviço tiver outro nome interno.
ENV API_UPSTREAM=inter-unaerp-api:8080
COPY dist/ /usr/share/nginx/html/universitarios/inter-unaerp/
COPY nginx.conf.template /etc/nginx/templates/default.conf.template
EXPOSE 80
