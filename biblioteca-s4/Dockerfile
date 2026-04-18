# ============================================================
# Dockerfile - biblioteca-s4 (BackEnd Spring Boot)
# DSY2205 - Semana 6 - Actividad Formativa 4
#
# Multi-stage build:
#   Stage 1 (builder): compila el JAR con Maven
#   Stage 2 (runtime): corre el JAR con JRE liviano
# ============================================================

# ── Stage 1: Compilar ────────────────────────────────────────
FROM maven:3.9.6-eclipse-temurin-21 AS builder

WORKDIR /app

# Copiar primero solo el pom.xml para aprovechar caché de capas
COPY pom.xml .
RUN mvn dependency:go-offline -B

# Copiar el código fuente y compilar
COPY src ./src
RUN mvn clean package -DskipTests -B

# ── Stage 2: Imagen de producción ────────────────────────────
FROM eclipse-temurin:21-jre-alpine

WORKDIR /app

# Copiar el JAR generado en el stage anterior
COPY --from=builder /app/target/biblioteca-s4-1.0.0.jar app.jar

# Puerto que expone el microservicio (definido en application.properties)
EXPOSE 8082

# Variables de entorno con valores por defecto (se sobreescriben en docker-compose)
ENV DB_URL="jdbc:oracle:thin:@(description=(retry_count=20)(retry_delay=3)(address=(protocol=tcps)(port=1522)(host=adb.sa-santiago-1.oraclecloud.com))(connect_data=(service_name=g1c6677be04d407_bibliotecadb_tp.adb.oraclecloud.com))(security=(ssl_server_dn_match=no)))"
ENV DB_USERNAME="ADMIN"
ENV DB_PASSWORD="Biblioteca2026X"

ENTRYPOINT ["java", "-jar", "app.jar"]
