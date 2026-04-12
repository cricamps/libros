# ============================================================
# Dockerfile - BackEnd ms-pedidos (Spring Boot)
# Multi-stage: build con Maven → run con JRE
# DSY2205 - Sumativa 2
# ============================================================

# ── Etapa 1: Build con Maven ──────────────────────────────
FROM maven:3.9.6-eclipse-temurin-21 AS build
WORKDIR /app

# Copiar pom.xml y descargar dependencias (caché de capas)
COPY pom.xml .
RUN mvn dependency:go-offline -B

# Copiar código fuente y compilar
COPY src ./src
RUN mvn clean package -DskipTests -B

# ── Etapa 2: Runtime con JRE mínimo ──────────────────────
FROM eclipse-temurin:21-jre-alpine
LABEL maintainer="TechStore DSY2205"

WORKDIR /app

# Copiar JAR generado
COPY --from=build /app/target/ms-pedidos-1.0.0.jar app.jar

# Variables de entorno (se sobreescriben en docker-compose)
ENV DB_URL=""
ENV DB_USERNAME="ADMIN"
ENV DB_PASSWORD=""

EXPOSE 8083

ENTRYPOINT ["java", "-jar", "app.jar"]
