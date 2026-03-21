package com.full3.full3.controller;

// Importa la clase Libro del modelo
import com.full3.full3.model.Libro;

// Importa el servicio de libros con la lógica de negocio
import com.full3.full3.service.LibroService;

// Importa las clases de Spring para construir respuestas HTTP
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

// Importa las anotaciones de Spring para construir la API REST
import org.springframework.web.bind.annotation.*;

// Importa Jakarta Validation para validar el body recibido
import jakarta.validation.Valid;

// Importa List para devolver listas de libros
import java.util.List;

// Marca esta clase como un controlador REST.
// Spring convertirá automáticamente los objetos Java a JSON.
@RestController

// Define la ruta base de este controlador.
// Todos los endpoints de libros comenzarán con /api/libros
@RequestMapping("/libros")
public class LibroController {

    // Referencia al servicio de libros
    private final LibroService libroService;

    // Constructor con inyección de dependencias.
    // Spring Boot entrega automáticamente una instancia de LibroService.
    public LibroController(LibroService libroService) {
        this.libroService = libroService;
    }

    // ==========================================================
    // LISTAR TODOS LOS LIBROS
    // GET /api/libros
    // ==========================================================

    // Devuelve la lista completa de libros registrados.
    // Respuesta: 200 OK con arreglo JSON de libros.
    @GetMapping
    public List<Libro> obtenerLibros() {

        // Delega al servicio para obtener todos los libros
        return libroService.obtenerTodos();
    }

    // ==========================================================
    // BUSCAR UN LIBRO POR ID
    // GET /api/libros/{id}
    // ==========================================================

    // Busca un libro específico por su clave primaria.
    // Respuesta: 200 OK si existe, 404 Not Found si no existe.
    @GetMapping("/{id}")
    public ResponseEntity<Libro> obtenerLibro(@PathVariable Long id) {

        // Busca el libro y responde según si existe o no
        return libroService.obtenerPorId(id)
                .map(libro -> ResponseEntity.ok(libro))
                .orElse(ResponseEntity.notFound().build());
    }

    // ==========================================================
    // CREAR UN NUEVO LIBRO
    // POST /api/libros
    // ==========================================================

    // Crea un libro nuevo en la base de datos.
    // @Valid activa las validaciones de la entidad
    // Respuesta: 201 Created con el libro creado.
    @PostMapping
    public ResponseEntity<Libro> crearLibro(@Valid @RequestBody Libro libro) {

        // Guarda el libro y retorna 201 Created
        Libro creado = libroService.guardar(libro);
        return ResponseEntity.status(HttpStatus.CREATED).body(creado);
    }

    // ==========================================================
    // ACTUALIZAR UN LIBRO EXISTENTE
    // PUT /api/libros/{id}
    // ==========================================================

    // Modifica los datos de un libro identificado por su id.
    // Respuesta: 200 OK si existe, 404 Not Found si no existe.
    @PutMapping("/{id}")
    public ResponseEntity<Libro> actualizarLibro(@PathVariable Long id,
                                                  @Valid @RequestBody Libro libro) {

        // Delega la actualización al servicio
        return libroService.actualizar(id, libro)
                .map(actualizado -> ResponseEntity.ok(actualizado))
                .orElse(ResponseEntity.notFound().build());
    }

    // ==========================================================
    // ELIMINAR UN LIBRO POR ID
    // DELETE /api/libros/{id}
    // ==========================================================

    // Elimina un libro de la base de datos.
    // Respuesta: 204 No Content si fue eliminado, 404 Not Found si no existía.
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminarLibro(@PathVariable Long id) {

        // Intenta eliminar y responde según el resultado
        if (libroService.eliminar(id)) {
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.notFound().build();
    }
}
