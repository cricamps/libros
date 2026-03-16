package com.full3.full3.controller;

// Importa la clase Libro.
// Esta clase representa el objeto que se enviará y recibirá como JSON.
import com.full3.full3.model.Libro;

// Importa la capa de servicio.
// El controller no habla directo con la base de datos;
// toda la lógica pasa primero por el service.
import com.full3.full3.service.LibroService;

// Importa las anotaciones necesarias para construir una API REST.
import org.springframework.web.bind.annotation.*;

// Importa List para poder devolver una lista de libros.
import java.util.List;

// Importa Optional para representar que una búsqueda puede o no encontrar resultado.
import java.util.Optional;

// Marca esta clase como un controlador REST.
// Spring convertirá automáticamente los objetos Java a JSON.
@RestController

// Define la ruta base de este controlador.
// Todos los endpoints de esta clase comenzarán con /libros
@RequestMapping("/libros")
public class LibroController {

    // Referencia al servicio de libros.
    // Desde aquí se llamarán los métodos que contienen la lógica del sistema.
    private final LibroService libroService;

    // Constructor con inyección de dependencias.
    // Spring Boot entrega automáticamente una instancia de LibroService.
    public LibroController(LibroService libroService) {
        this.libroService = libroService;
    }

    // ==========================================================
    // LISTAR TODOS LOS LIBROS
    // ==========================================================

    // Este método responde a solicitudes HTTP GET sin id.
    // Ejemplo:
    // GET http://localhost:8080/libros
    @GetMapping
    public List<Libro> obtenerLibros() {

        // Llama al service para obtener todos los libros registrados.
        return libroService.obtenerTodos();
    }

    // ==========================================================
    // BUSCAR UN LIBRO POR SU ID
    // ==========================================================

    // Este método responde a solicitudes HTTP GET con id en la URL.
    // Ejemplo:
    // GET http://localhost:8080/libros/1
    @GetMapping("/{id}")
    public Optional<Libro> obtenerLibro(@PathVariable Long id) {

        // @PathVariable toma el valor que viene en la URL
        // y lo guarda en el parámetro id.
        //
        // Luego se delega la búsqueda al service.
        return libroService.obtenerPorId(id);
    }

    // ==========================================================
    // CREAR UN NUEVO LIBRO
    // ==========================================================

    // Este método responde a solicitudes HTTP POST.
    // Ejemplo:
    // POST http://localhost:8080/libros
    //
    // El libro viaja en el body de la petición en formato JSON.
    @PostMapping
    public Libro crearLibro(@RequestBody Libro libro) {

        // @RequestBody convierte automáticamente el JSON recibido
        // en un objeto Java de tipo Libro.
        //
        // Luego se llama al service para guardar el libro en Oracle.
        return libroService.guardar(libro);
    }

    // ==========================================================
    // ACTUALIZAR UN LIBRO EXISTENTE
    // ==========================================================

    // Este método responde a solicitudes HTTP PUT.
    // Ejemplo:
    // PUT http://localhost:8080/libros/1
    //
    // El id del libro va en la URL.
    // Los nuevos datos del libro viajan en el body.
    @PutMapping("/{id}")
    public Optional<Libro> actualizarLibro(@PathVariable Long id, @RequestBody Libro libro) {

        // Se envía al service el id a modificar
        // junto con los nuevos datos del libro.
        return libroService.actualizar(id, libro);
    }

    // ==========================================================
    // ELIMINAR UN LIBRO POR SU ID
    // ==========================================================

    // Este método responde a solicitudes HTTP DELETE.
    // Ejemplo:
    // DELETE http://localhost:8080/libros/1
    @DeleteMapping("/{id}")
    public boolean eliminarLibro(@PathVariable Long id) {

        // Llama al service para eliminar el libro.
        //
        // Retorna:
        // true  -> si el libro existía y fue eliminado
        // false -> si no existía
        return libroService.eliminar(id);
    }
}
