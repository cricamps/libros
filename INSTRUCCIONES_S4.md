# INSTRUCCIONES - Semana 4 DSY2205
## Actividad Formativa: "Implementando lineamientos empresariales"

---

## Estructura del proyecto

```
C:\fullstack3\
├── biblioteca-arquetipo\        ← Arquetipo Maven propio (Semana 4)
│   ├── pom.xml
│   └── src\main\resources\
│       ├── META-INF\maven\
│       │   └── archetype-metadata.xml
│       └── archetype-resources\
│           ├── pom.xml
│           └── src\main\
│               ├── java\Application.java
│               └── resources\application.properties
│
├── biblioteca-s4\               ← Microservicio generado desde el arquetipo
│   ├── pom.xml
│   └── src\main\java\com\duoc\s4\
│       ├── BibliotecaS4Application.java
│       ├── config\CorsConfig.java
│       ├── controller\LibroController.java
│       ├── factory\LibroFactory.java      ← PATRÓN FACTORY
│       ├── model\Libro.java
│       ├── repository\LibroRepository.java
│       └── service\LibroService.java      ← PATRÓN SINGLETON
│
├── src\                         ← Microservicio Semana 1 (referencia)
├── instalar-arquetipo.ps1       ← Script instalación arquetipo
└── empaquetar-s4.ps1            ← Script generación ZIP entrega
```

---

## Patrones de diseño implementados

### 1. SINGLETON — LibroService
- **Archivo:** `biblioteca-s4/src/main/java/com/duoc/s4/service/LibroService.java`
- **Implementación:** Anotación `@Service` de Spring Boot.
- **Descripción:** Spring garantiza que existe una **única instancia** de `LibroService`
  durante todo el ciclo de vida de la aplicación. Todos los controladores reciben
  siempre la misma instancia del servicio.

### 2. FACTORY — LibroFactory
- **Archivo:** `biblioteca-s4/src/main/java/com/duoc/s4/factory/LibroFactory.java`
- **Implementación:** Clase `@Component` con métodos `crearLibro()` y `actualizarLibro()`.
- **Descripción:** Centraliza la creación de objetos `Libro`. El controlador
  usa `LibroFactory.crearLibro(...)` en el POST y el servicio usa
  `LibroFactory.actualizarLibro(...)` en el PUT.

---

## Pasos para ejecutar

### Paso 1 — Instalar el arquetipo Maven
```powershell
cd C:\fullstack3
.\instalar-arquetipo.ps1
```
Esto instala `com.duoc.fullstack3:biblioteca-arquetipo:1.0.0` en `~/.m2`.

### Paso 2 — Ejecutar el microservicio biblioteca-s4
```powershell
cd C:\fullstack3\biblioteca-s4
mvn spring-boot:run
```
El servidor levanta en: `http://localhost:8082/api`

### Paso 3 — Probar con Postman

| Método | URL | Body (JSON) |
|--------|-----|-------------|
| GET    | `http://localhost:8082/api/libros` | — |
| GET    | `http://localhost:8082/api/libros/1` | — |
| POST   | `http://localhost:8082/api/libros` | `{"titulo":"...", "autor":"...", "anioPublicacion":2024, "genero":"..."}` |
| PUT    | `http://localhost:8082/api/libros/1` | `{"titulo":"...", "autor":"...", "anioPublicacion":2024, "genero":"..."}` |
| DELETE | `http://localhost:8082/api/libros/1` | — |

### Paso 4 — Git commit
```bash
git add .
git commit -m "Semana 4: arquetipo Maven + patrones Singleton y Factory"
git push
```

### Paso 5 — Generar ZIP de entrega
```powershell
cd C:\fullstack3
.\empaquetar-s4.ps1
```

---

## Base de datos Oracle

- **Instancia:** BibliotecaDB (Oracle Cloud, región sa-santiago-1)
- **Tabla usada:** LIBROS (misma que Semana 1)
- **Puerto:** 8082 (para no colisionar con el microservicio de Semana 1 en 8081)
- **Credenciales:** configuradas en `application.properties` (variables de entorno)
