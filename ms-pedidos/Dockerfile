# ============================================================
# Dockerfile – ms-pedidos
# Microservicio de Búsqueda, Visualización y Compra
# Puerto: 8083
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
COPY --from=build /app/target/*.jar ms-pedidos.jar
EXPOSE 8083
ENTRYPOINT ["java", "-jar", "ms-pedidos.jar"]
