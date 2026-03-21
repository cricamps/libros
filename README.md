# Sistema de Gestión de Pedidos - Tienda de Tecnología en Línea
**Asignatura:** Desarrollo Full Stack III (DSY2205)  
**Actividad:** Sumativa 1 - Programando nuestro BackEnd  
**Alumno:** Cristobal Camps  
**Repositorio:** https://github.com/cricamps/libros

---

## Descripción

Aplicación BackEnd desarrollada con **Java 21 + Spring Boot 3.5.11**, conectada a **Oracle Autonomous Database** en la nube. Implementa dos microservicios REST para una tienda de tecnología en línea.

---

## Microservicios desarrollados

### MS1 - Gestión de Usuarios (`/api/usuarios`, `/api/auth/login`)
Permite administrar los usuarios del sistema con dos roles diferenciados:
- **ADMIN**: puede gestionar productos y usuarios
- **CLIENTE**: puede navegar y comprar productos

Operaciones disponibles:
- `GET /api/usuarios` — Listar todos los usuarios
- `GET /api/usuarios/{id}` — Buscar usuario por ID
- `POST /api/usuarios` — Crear nuevo usuario
- `PUT /api/usuarios/{id}` — Actualizar usuario existente
- `DELETE /api/usuarios/{id}` — Eliminar usuario
- `POST /api/auth/login` — Iniciar sesión (valida email y contraseña)

### MS2 - Gestión de Productos (`/api/productos`)
Permite administrar el catálogo de productos de la tienda (solo rol ADMIN).

Operaciones disponibles:
- `GET /api/productos` — Listar catálogo completo
- `GET /api/productos/{id}` — Buscar producto por ID
- `POST /api/productos` — Agregar nuevo producto
- `PUT /api/productos/{id}` — Actualizar producto existente
- `DELETE /api/productos/{id}` — Eliminar producto

---

## Tecnologías utilizadas

| Tecnología | Versión |
|---|---|
| Java | 21 |
| Spring Boot | 3.5.11 |
| Spring Data JPA | incluido en Spring Boot |
| Oracle JDBC (ojdbc11) | incluido en Spring Boot |
| Jakarta Validation | incluido en Spring Boot |
| Oracle Autonomous Database | Cloud (región sa-santiago-1) |

---

## Estructura del proyecto

```
src/main/java/com/full3/full3/
├── controller/          ← Endpoints REST (LibroController, UsuarioController, ProductoController)
├── exception/           ← Manejador global de errores (GlobalExceptionHandler)
├── model/               ← Entidades JPA y DTOs (Libro, Usuario, Producto, LoginRequest)
├── repository/          ← Interfaces JpaRepository
├── service/             ← Lógica de negocio
└── Full3Application.java
```

---

## Configuración del entorno

### Variables de entorno requeridas

Crea un archivo `.env` basado en `.env.example`:

```
SERVER_PORT=8081
DB_URL=jdbc:oracle:thin:@(...)
DB_USERNAME=ADMIN
DB_PASSWORD=tu_contraseña
```

> ⚠️ El archivo `.env` con credenciales reales **no se sube a GitHub**.

### Ejecución local

```bash
# Instalar dependencias y compilar
mvn clean install

# Ejecutar la aplicación
mvn spring-boot:run
```

La API estará disponible en: `http://localhost:8081/api`

---

## Base de datos Oracle

El archivo `script_bd_oracle.sql` contiene:
- Creación de tablas: `LIBROS`, `USUARIOS`, `PRODUCTOS`
- Datos iniciales: 4 usuarios (1 ADMIN + 3 CLIENTES) y 7 productos de tecnología

Ejecutar en **Oracle Database Actions → SQL Worksheet**.

---

## Pruebas con Postman

Importar el archivo `postman_coleccion_sumativa1.json` en Postman.

La colección incluye requests para:
- CRUD completo de usuarios con validaciones
- Login exitoso (ADMIN y CLIENTE) y login fallido
- CRUD completo de productos con validaciones
- Casos de error: 400 (datos inválidos), 404 (no encontrado), 401 (no autorizado)

---

## Buenas prácticas implementadas

- `@Valid` en todos los endpoints POST y PUT para validar datos de entrada
- `ResponseEntity` con códigos HTTP correctos (200, 201, 204, 400, 401, 404, 500)
- `@RestControllerAdvice` para manejo centralizado de excepciones (sin try-catch en controllers)
- Credenciales en variables de entorno (no hardcodeadas)
- `.gitignore` configurado para excluir `target/`, `.env` y wallets
