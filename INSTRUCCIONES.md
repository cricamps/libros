# INSTRUCCIONES - Semana 6
## DSY2205 - Desarrollo Full Stack III
## Actividad Formativa 4: Integrando FrontEnd con BackEnd

---

## Estructura del proyecto

```
C:\fullstack3\
├── biblioteca-s4\          ← BackEnd Spring Boot (arquetipo Maven)
│   ├── Dockerfile
│   ├── .dockerignore
│   ├── pom.xml
│   └── src\
├── biblioteca-frontend\    ← FrontEnd Angular 17
│   ├── Dockerfile
│   ├── .dockerignore
│   ├── nginx.conf
│   └── src\
├── docker-compose.yml      ← Orquestación de contenedores
└── docker-push.ps1         ← Script para subir a Docker Hub
```

---

## Requisitos previos

- Docker Desktop instalado y corriendo
- Cuenta en Docker Hub (https://hub.docker.com)
- Acceso a Oracle Cloud (BibliotecaDB)

---

## Opción A — Correr localmente con Docker

```powershell
# Desde C:\fullstack3
docker-compose up --build
```

Accesos:
- **FrontEnd**: http://localhost
- **BackEnd**: http://localhost:8082/api/libros

Para detener:
```powershell
docker-compose down
```

---

## Opción B — Subir a Docker Hub

1. Editar `docker-push.ps1` y reemplazar `TU_USUARIO` con tu usuario de Docker Hub
2. Ejecutar:

```powershell
.\docker-push.ps1
```

---

## Verificación con Postman

Base URL: `http://localhost:8082/api/libros`

| Método | URL                              | Body (JSON)                                                    |
|--------|----------------------------------|----------------------------------------------------------------|
| GET    | /api/libros                      | —                                                              |
| GET    | /api/libros/{id}                 | —                                                              |
| POST   | /api/libros                      | `{"titulo":"...","autor":"...","isbn":"...","anio":2024}`      |
| PUT    | /api/libros/{id}                 | `{"titulo":"...","autor":"...","isbn":"...","anio":2024}`      |
| DELETE | /api/libros/{id}                 | —                                                              |

---

## Patrones de diseño implementados

| Patrón   | Dónde                       | Descripción                                      |
|----------|-----------------------------|--------------------------------------------------|
| MVC      | Spring Boot (controller/service/repository) | Separación de capas            |
| Singleton | LibroService (Angular)      | Una sola instancia via `providedIn: 'root'`      |
| Observer  | Observables RxJS (Angular)  | Datos reactivos con `subscribe()`                |
| Facade    | LibroService (Angular)      | Abstracción de HttpClient para el resto de la app|
| Factory   | LibroFactory (Spring Boot)  | Creación controlada de objetos Libro             |

---

## Base de datos Oracle Cloud

- **Instancia**: BibliotecaDB
- **Región**: sa-santiago-1
- **Tabla**: LIBROS
- **Conexión**: TCPS sin wallet (mTLS deshabilitado)
