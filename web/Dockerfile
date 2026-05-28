# Static-only build — dist/ é pré-buildado e committado
# Para rebuild com novos env vars, rebuilde local e commit dist/
FROM nginx:1.27-alpine
WORKDIR /usr/share/nginx/html

RUN rm -rf ./*
COPY dist/ ./
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD wget -q --spider http://localhost/ || exit 1

CMD ["nginx", "-g", "daemon off;"]
