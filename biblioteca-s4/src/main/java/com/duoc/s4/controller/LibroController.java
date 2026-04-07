package com.duoc.s4.controller;

import com.duoc.s4.factory.LibroFactory;
import com.duoc.s4.model.Libro;
import com.duoc.s4.service.LibroService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * ============================================================
 * CONTROLADOR REST - LibroController
 * ============================================================
 * Expone los endpoints CRUD de la tabla LIBROS en Oracle Cloud.
 *
 * Base URL : /api/libros   (puerto 8082)
 *
 * Endpoints disponibles:
 *   GET    /api/libros        → Obtener todos los libros
 *   GET    /api/libros/{id}   → Obtener un libro por id
 *   POST   /api/libros        → Crear un nuevo libro
 *   PUT    /api/libros/{id}   → Actualizar un libro existente
 *   DELETE /api/libros/{id}   → Eliminar un libro
 *
 * Uso del patrón Factory en este controlador:
 *   - POST: LibroFactory.crearLibro()    → crea el objeto Libro
 *   - PUT:  LibroFactory.actualizarLibro() se usa en el servicio
 *
 * Uso del patrón Singleton en este controlador:
 *   - LibroService es un singleton gestionado por Spring.
 *     Este controlador siempre recibe la misma instancia.
 * ============================================================
 */
@RestController
@RequestMapping("/libros")
public class LibroController {

    // Servicio de lógica de negocio - SINGLETON (una sola instancia)
    private final LibroService libroService;

    // Fábrica de objetos Libro - FACTORY (centraliza la creación)
    private final LibroFactory libroFactory;

    /**
     * Constructor con inyección de dependencias.
     * Spring Boot proporciona automáticamente las instancias.
     */
    public LibroController(LibroService libroService,
                           LibroFactory libroFactory) {
        this.libroService = libroService;
        this.libroFactory = libroFactory;
    }

    // ==========================================================
    // GET /api/libros
    // Obtener todos los libros registrados
    // ==========================================================
    /**
     * Retorna la lista completa de libros desde Oracle.
     * Respuesta: 200 OK con arreglo JSON de libros.
     */
    @GetMapping
    public ResponseEntity<List<Libro>> obtenerLibros() {
        List<Libro> libros = libroService.obtenerTodos();
        return ResponseEntity.ok(libros);
    }

    // ==========================================================
    // GET /api/libros/{id}
    // Obtener un libro específico por su id
    // ==========================================================
    /**
     * Busca un libro por su clave primaria.
     * Respuesta: 200 OK si existe, 404 Not Found si no existe.
     */
    @GetMapping("/{id}")
    public ResponseEntity<Libro> obtenerLibro(@PathVariable Long id) {
        return libroService.obtenerPorId(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // ==========================================================
    // POST /api/libros
    // Crear un nuevo libro usando LibroFactory (patrón Factory)
    // ==========================================================
    /**
     * Crea un nuevo libro en Oracle.
     *
     * USO DEL PATRÓN FACTORY:
     * El controlador extrae los campos del body JSON recibido
     * y los pasa a LibroFactory.crearLibro(). La fábrica
     * construye el objeto Libro con id=null para que Oracle
     * genere el id automáticamente al insertar.
     *
     * Respuesta: 201 Created con el libro creado (incluye id asignado).
     */
    @PostMapping
    public ResponseEntity<Libro> crearLibro(@Valid @RequestBody Libro libroRequest) {

        // La Factory construye el objeto Libro a insertar.
        // Esto desacopla la construcción del objeto del controlador.
        Libro nuevoLibro = libroFactory.crearLibro(
            libroRequest.getTitulo(),
            libroRequest.getAutor(),
            libroRequest.getAnioPublicacion(),
            libroRequest.getGenero()
        );

        // El servicio (Singleton) persiste el libro en Oracle
        Libro guardado = libroService.guardar(nuevoLibro);
        return ResponseEntity.status(HttpStatus.CREATED).body(guardado);
    }

    // ==========================================================
    // PUT /api/libros/{id}
    // Actualizar un libro existente
    // ==========================================================
    /**
     * Modifica los datos de un libro identificado por su id.
     * La Factory es usada dentro del servicio para construir
     * el objeto actualizado (LibroFactory.actualizarLibro()).
     * Respuesta: 200 OK si existe, 404 Not Found si no existe.
     */
    @PutMapping("/{id}")
    public ResponseEntity<Libro> actualizarLibro(
            @PathVariable Long id,
            @Valid @RequestBody Libro libroRequest) {

        return libroService.actualizar(id, libroRequest)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // ==========================================================
    // DELETE /api/libros/{id}
    // Eliminar un libro por su id
    // ==========================================================
    /**
     * Elimina un libro de Oracle por su clave primaria.
     * Respuesta: 204 No Content si fue eliminado,
     *            404 Not Found si no existía.
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminarLibro(@PathVariable Long id) {
        if (libroService.eliminar(id)) {
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.notFound().build();
    }
}
