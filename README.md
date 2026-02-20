# Narappa

## Quick Start

### Create env file
```bash
# ── Database ──
MYSQL_ROOT_PASSWORD=root123
MYSQL_DATABASE=artist_tribute

# ── Backend ──
SPRING_DATASOURCE_USERNAME=root
SPRING_DATASOURCE_PASSWORD=root123
JWT_SECRET=YourVeryLongSecretKeyForJWTTokenGenerationMustBeAtLeast256BitsLong
FILE_UPLOAD_DIR=/app/uploads
ALLOWED_ORIGINS=http://localhost,http://localhost:80,http://localhost:3000

# ── Ports ──
FRONTEND_PORT=80
BACKEND_PORT=8080
DB_PORT=3306
```

### Deploy
```bash
docker build prune -af
cd narappa
docker compose up -d
```
## Important Notes

### Change to custom domain
```sql
UPDATE award_photos SET image_url = REPLACE(image_url, 'http://localhost:8080', '');
UPDATE paintings SET image_url = REPLACE(image_url, 'http://localhost:8080', '');
UPDATE custom_pages SET content = REPLACE(content, 'http://localhost:8080', '');
```

### CORS Configuration
The backend's CORS is configured to allow the frontend container. If you deploy to a custom domain, update the `ALLOWED_ORIGINS` environment variable in `docker-compose.yml` and also update the hardcoded CORS origins in:
- `backend/src/.../config/CorsConfig.java`
- `backend/src/.../config/WebConfig.java`