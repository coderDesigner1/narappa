# ── Stage 1: Build ──────────────────────────────
FROM maven:3.9-eclipse-temurin-21-alpine AS builder
WORKDIR /build
COPY pom.xml .
# Download dependencies first (cached layer)
RUN mvn dependency:go-offline -B
COPY src ./src
RUN mvn clean package -DskipTests -B

# ── Stage 2: Run ────────────────────────────────
FROM bellsoft/liberica-runtime-container:jre-21-musl
WORKDIR /app

# Create uploads directory
RUN mkdir -p /app/uploads

# Copy the built jar
COPY --from=builder /build/target/*.jar app.jar

# Expose port
EXPOSE 8080

# Override hardcoded DB config via environment variables (set in docker-compose)
ENTRYPOINT ["sh", "-c", "java -jar app.jar \
    --spring.datasource.url=${SPRING_DATASOURCE_URL} \
    --spring.datasource.username=${SPRING_DATASOURCE_USERNAME} \
    --spring.datasource.password=${SPRING_DATASOURCE_PASSWORD} \
    --file.upload-dir=${FILE_UPLOAD_DIR}"]