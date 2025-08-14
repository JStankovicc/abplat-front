# Multi-stage build za React aplikaciju
FROM node:18-alpine AS build

# Instaliraj potrebne pakete za build
RUN apk add --no-cache git

# Postavi radni direktorij
WORKDIR /app

# Kopiraj package files
COPY package*.json ./

# Instaliraj dependencies
RUN npm ci --only=production --silent

# Kopiraj source code
COPY . .

# Kreiraj production build
RUN npm run build

# Production stage sa Nginx
FROM nginx:alpine

# Instaliraj potrebne pakete
RUN apk add --no-cache tzdata curl

# Setuj timezone na Belgrade
ENV TZ=Europe/Belgrade

# Ukloni default nginx konfiguraciju
RUN rm /etc/nginx/conf.d/default.conf

# Kopiraj custom nginx konfiguraciju
COPY nginx.conf /etc/nginx/conf.d/

# Kopiraj build fajlove iz build stage
COPY --from=build /app/build /usr/share/nginx/html

# Kreiraj korisnika za nginx (security best practice)
RUN addgroup -g 1001 -S nginx-app && \
    adduser -S nginx-app -u 1001 -G nginx-app

# Promeni vlasništvo fajlova
RUN chown -R nginx-app:nginx-app /usr/share/nginx/html && \
    chown -R nginx-app:nginx-app /var/cache/nginx && \
    chown -R nginx-app:nginx-app /var/log/nginx && \
    chown -R nginx-app:nginx-app /etc/nginx/conf.d && \
    touch /var/run/nginx.pid && \
    chown -R nginx-app:nginx-app /var/run/nginx.pid

# Prebaci na nginx-app korisnika
USER nginx-app

# Expose port 80
EXPOSE 80

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=30s --retries=3 \
    CMD curl -f http://localhost:80 || exit 1

# Pokreni nginx
CMD ["nginx", "-g", "daemon off;"]