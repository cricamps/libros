# ============================================================
# Dockerfile – ms-gestion
# Microservicio de Gestión de Productos (ADMIN)
# Puerto: 8082
# ============================================================

FROM eclipse-temurin:21-jdk-alpine AS build
WORKDIR /app
COPY .mvn/ .mvn/
COPY mvnw pom.xml ./
RUN ./mvnw dependency:go-offline -q
COPY src ./src
RUN ./mvnw package -DskipTests -q

FROM eclipse-temurin:21-jre-alpine
WORKDIR /app
COPY --from=build /app/target/*.jar ms-gestion.jar
EXPOSE 8082
ENTRYPOINT ["java", "-jar", "ms-gestion.jar"]
