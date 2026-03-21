package com.full3.full3.controller;

// Importa las clases del modelo necesarias para este controlador
import com.full3.full3.model.LoginRequest;
import com.full3.full3.model.Usuario;

// Importa el servicio de usuarios con la lógica de negocio
import com.full3.full3.service.UsuarioService;

// Importa las clases de Spring para construir respuestas HTTP
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

// Importa las anotaciones de Spring para construir la API REST
import org.springframework.web.bind.annotation.*;

// Importa Jakarta Validation para validar el body recibido
import jakarta.validation.Valid;

// Importa List para devolver listas de usuarios
import java.util.List;

// Marca esta clase como un controlador REST.
// Todos los métodos devolverán respuestas JSON automáticamente.
@RestController
public class UsuarioController {

    // Referencia al servicio de usuarios
    private final UsuarioService usuarioService;

    // Constructor con inyección de dependencias.
    // Spring Boot entrega automáticamente una instancia de UsuarioService.
    public UsuarioController(UsuarioService usuarioService) {
        this.usuarioService = usuarioService;
    }

    // ==========================================================
    // LISTAR TODOS LOS USUARIOS
    // GET /api/usuarios
    // ==========================================================

    // Devuelve la lista completa de usuarios registrados.
    // Respuesta: 200 OK con arreglo JSON de usuarios.
    @GetMapping("/usuarios")
    public List<Usuario> obtenerUsuarios() {

        // Delega al servicio para obtener todos los usuarios
        return usuarioService.obtenerTodos();
    }

    // ==========================================================
    // BUSCAR UN USUARIO POR ID
    // GET /api/usuarios/{id}
    // ==========================================================

    // Busca un usuario específico.
    // Respuesta: 200 OK si existe, 404 Not Found si no existe.
    @GetMapping("/usuarios/{id}")
    public ResponseEntity<Usuario> obtenerUsuario(@PathVariable Long id) {

        // Busca el usuario y devuelve la respuesta adecuada según si existe o no
        return usuarioService.obtenerPorId(id)
                .map(usuario -> ResponseEntity.ok(usuario))
                .orElse(ResponseEntity.notFound().build());
    }

    // ==========================================================
    // CREAR UN NUEVO USUARIO
    // POST /api/usuarios
    // ==========================================================

    // Crea un usuario nuevo en la base de datos.
    // @Valid activa las validaciones de la entidad (@NotBlank, @Email, etc.)
    // Respuesta: 201 Created con el usuario creado.
    @PostMapping("/usuarios")
    public ResponseEntity<Usuario> crearUsuario(@Valid @RequestBody Usuario usuario) {

        // Guarda el usuario y retorna 201 Created
        Usuario creado = usuarioService.guardar(usuario);
        return ResponseEntity.status(HttpStatus.CREATED).body(creado);
    }

    // ==========================================================
    // ACTUALIZAR UN USUARIO EXISTENTE
    // PUT /api/usuarios/{id}
    // ==========================================================

    // Modifica los datos de un usuario identificado por su id.
    // @Valid activa las validaciones del body recibido.
    // Respuesta: 200 OK si existe, 404 Not Found si no existe.
    @PutMapping("/usuarios/{id}")
    public ResponseEntity<Usuario> actualizarUsuario(@PathVariable Long id,
                                                      @Valid @RequestBody Usuario usuario) {

        // Delega la actualización al servicio
        return usuarioService.actualizar(id, usuario)
                .map(actualizado -> ResponseEntity.ok(actualizado))
                .orElse(ResponseEntity.notFound().build());
    }

    // ==========================================================
    // ELIMINAR UN USUARIO POR ID
    // DELETE /api/usuarios/{id}
    // ==========================================================

    // Elimina un usuario de la base de datos.
    // Respuesta: 204 No Content si fue eliminado, 404 Not Found si no existía.
    @DeleteMapping("/usuarios/{id}")
    public ResponseEntity<Void> eliminarUsuario(@PathVariable Long id) {

        // Intenta eliminar y responde según el resultado
        if (usuarioService.eliminar(id)) {
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.notFound().build();
    }

    // ==========================================================
    // LOGIN DE USUARIO
    // POST /api/auth/login
    // ==========================================================

    // Valida las credenciales de un usuario (email + contraseña).
    // Si son correctas, devuelve el usuario con su rol asignado.
    // Respuesta: 200 OK si las credenciales son válidas,
    //            401 Unauthorized si son incorrectas.
    @PostMapping("/auth/login")
    public ResponseEntity<Usuario> login(@RequestBody LoginRequest loginRequest) {

        // Delega la validación al servicio de usuarios
        return usuarioService.login(loginRequest.getEmail(), loginRequest.getPassword())
                .map(usuario -> ResponseEntity.ok(usuario))
                .orElse(ResponseEntity.status(HttpStatus.UNAUTHORIZED).build());
    }
}
