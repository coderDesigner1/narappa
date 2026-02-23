# ── Stage 1: Build React App ────────────────────
FROM node:18-alpine AS builder
WORKDIR /app

COPY package.json ./
RUN npm install

COPY . .

# Replace hardcoded localhost:8080 API URLs with relative paths
# so that nginx can reverse-proxy them to the backend container
RUN find src -type f \( -name "*.js" -o -name "*.jsx" \) \
    -exec sed -i "s|http://localhost:8080/api|/api|g" {} + && \
    find src -type f \( -name "*.js" -o -name "*.jsx" \) \
    -exec sed -i "s|http://localhost:8080/uploads|/uploads|g" {} +

RUN npm run build

# ── Stage 2: Serve with Nginx ──────────────────
FROM nginx:alpine
COPY --from=builder /app/build /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]