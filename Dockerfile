# Jednostavan build bez multi-stage
FROM node:18-alpine

WORKDIR /app

# Copy sve odjednom
COPY . .

# Install dependencies sa --legacy-peer-deps da izbegne konflikte
RUN npm install --legacy-peer-deps

# Build aplikaciju
RUN npm run build

# Install nginx
RUN apk add --no-cache nginx curl

# Copy nginx config
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy build u nginx folder
RUN cp -r build/* /usr/share/nginx/html/

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=30s --retries=3 \
  CMD curl -f http://localhost/ || exit 1

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]