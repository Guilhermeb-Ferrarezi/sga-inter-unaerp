FROM nginx:alpine
# Servimos sob /inter-unaerp/ — Vite buildou com base="/inter-unaerp/"
COPY dist/ /usr/share/nginx/html/universitarios/inter-unaerp/
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
