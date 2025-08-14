# Multi-stage build - jednostavno i efikasno
FROM node:18-alpine AS build

WORKDIR /app

# Copy package.json i package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy source kod
COPY . .

# Build React aplikaciju
RUN npm run build

# Production stage sa nginx
FROM nginx:alpine

# Install curl za health check
RUN apk add --no-cache curl

# Copy nginx konfiguraciju
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy build-ovanu aplikaciju iz build stage
COPY --from=build /app/build /usr/share/nginx/html

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=30s --retries=3 \
  CMD curl -f http://localhost/ || exit 1

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]