package com.full3.full3.service;

// Importa la entidad Libro.
// Esta clase representa cada registro de la tabla LIBROS en Oracle.
import com.full3.full3.model.Libro;

// Importa el repository.
// El repository es la capa que se comunica con la base de datos mediante JPA.
import com.full3.full3.repository.LibroRepository;

// Marca esta clase como un servicio de Spring.
// Spring detectará esta clase y podrá inyectarla donde sea necesaria.
import org.springframework.stereotype.Service;

// Importa List para poder trabajar con listas de libros.
import java.util.List;

// Importa Optional para representar resultados que pueden existir o no.
// Se usa especialmente al buscar por id.
import java.util.Optional;

// Indica que esta clase pertenece a la capa de servicio.
// Aquí se ubica la lógica de negocio básica del sistema.
@Service
@SuppressWarnings("all")
public class LibroService {

    // Referencia al repository.
    // Esta variable permitirá acceder a los métodos CRUD de JPA.
    private final LibroRepository libroRepository;

    // Constructor con inyección de dependencias.
    // Spring Boot entrega automáticamente una instancia de LibroRepository.
    public LibroService(LibroRepository libroRepository) {
        this.libroRepository = libroRepository;
    }

    // ==========================================================
    // OBTENER TODOS LOS LIBROS
    // ==========================================================

    // Este método devuelve todos los libros registrados en la base de datos.
    // Se utilizará para el endpoint:
    // GET http://localhost:8080/libros
    public List<Libro> obtenerTodos() {

        // findAll() es un método heredado de JpaRepository.
        // Recupera todos los registros de la tabla LIBROS.
        return libroRepository.findAll();
    }

    // ==========================================================
    // OBTENER UN LIBRO POR SU ID
    // ==========================================================

    // Este método busca un libro usando su clave primaria.
    // Devuelve un Optional porque el libro puede existir o no.
    public Optional<Libro> obtenerPorId(Long id) {

        // findById() busca un registro por su id.
        // Si lo encuentra, devuelve Optional con el libro.
        // Si no lo encuentra, devuelve Optional vacío.
        return libroRepository.findById(id);
    }

    // ==========================================================
    // GUARDAR UN NUEVO LIBRO
    // ==========================================================

    // Este método guarda un libro en la base de datos.
    // Se usará principalmente en el endpoint POST.
    public Libro guardar(Libro libro) {

        // save() inserta un nuevo registro cuando el id es null
        // o actualiza un registro si ya existe uno con ese id.
        return libroRepository.save(libro);
    }

    // ==========================================================
    // ACTUALIZAR UN LIBRO EXISTENTE
    // ==========================================================

    // Este método actualiza un libro a partir de su id.
    // Si el libro existe, se modifican sus campos y se guarda nuevamente.
    // Si el libro no existe, se devuelve Optional vacío.
    public Optional<Libro> actualizar(Long id, Libro libroActualizado) {

        // Primero se busca el libro actual en la base de datos.
        return libroRepository.findById(id).map(libro -> {

            // Si el libro existe, se reemplazan sus valores actuales
            // por los nuevos valores recibidos desde el controlador.
            libro.setTitulo(libroActualizado.getTitulo());
            libro.setAutor(libroActualizado.getAutor());
            libro.setAnioPublicacion(libroActualizado.getAnioPublicacion());
            libro.setGenero(libroActualizado.getGenero());

            // Luego se guardan los cambios en la base de datos
            // y se devuelve el libro ya actualizado.
            return libroRepository.save(libro);
        });
    }

    // ==========================================================
    // ELIMINAR UN LIBRO POR SU ID
    // ==========================================================

    // Este método elimina un libro usando su id.
    // Devuelve:
    // true  -> si el libro existía y fue eliminado
    // false -> si el libro no existía
    public boolean eliminar(Long id) {

        // Primero se verifica si el libro existe en la base de datos.
        if (libroRepository.existsById(id)) {

            // Si existe, se elimina usando su clave primaria.
            libroRepository.deleteById(id);

            // Se retorna true para indicar que la eliminación fue exitosa.
            return true;
        }

        // Si no existe ningún libro con ese id, se retorna false.
        return false;
    }
}
