package com.duoc.s4.service;

import com.duoc.s4.factory.LibroFactory;
import com.duoc.s4.model.Libro;
import com.duoc.s4.repository.LibroRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

/**
 * ============================================================
 * PATRÓN DE DISEÑO: SINGLETON
 * ============================================================
 * Clase: LibroService
 *
 * DESCRIPCIÓN DEL PATRÓN:
 * El patrón Singleton garantiza que una clase tenga una única
 * instancia durante todo el ciclo de vida de la aplicación,
 * proporcionando un punto de acceso global a esa instancia.
 *
 * APLICACIÓN EN ESTE MICROSERVICIO:
 * Spring Boot implementa Singleton automáticamente para todos
 * los beans anotados con @Service. Cuando LibroController
 * solicita LibroService por inyección de dependencias,
 * Spring siempre entrega la MISMA instancia (no crea una nueva).
 *
 * VENTAJAS:
 *  - Una única instancia gestiona toda la lógica de negocio.
 *  - El estado compartido (como el repositorio) se mantiene
 *    de forma centralizada y consistente.
 *  - Reduce el consumo de memoria al no crear múltiples instancias.
 *  - Facilita el control transaccional y la coherencia de datos.
 *
 * FLUJO:
 *  Spring Container → crea UNA sola instancia de LibroService
 *  LibroController  → siempre recibe esa misma instancia
 * ============================================================
 *
 * Además, LibroService usa LibroFactory (patrón Factory)
 * para actualizar libros en el método actualizar(), delegando
 * la construcción del objeto actualizado a la fábrica.
 */
@Service
@SuppressWarnings("all")
public class LibroService {

    // Repositorio JPA para acceso a la tabla LIBROS en Oracle
    private final LibroRepository libroRepository;

    // Fábrica de libros - patrón Factory inyectado por Spring
    private final LibroFactory libroFactory;

    /**
     * Constructor con inyección de dependencias.
     * Spring Boot entrega automáticamente las instancias
     * de LibroRepository y LibroFactory.
     */
    public LibroService(LibroRepository libroRepository,
                        LibroFactory libroFactory) {
        this.libroRepository = libroRepository;
        this.libroFactory = libroFactory;
    }

    // ==========================================================
    // GET ALL - Obtener todos los libros
    // Endpoint: GET /api/libros
    // ==========================================================
    /**
     * Recupera todos los libros registrados en Oracle.
     * @return Lista completa de libros (puede estar vacía)
     */
    public List<Libro> obtenerTodos() {
        return libroRepository.findAll();
    }

    // ==========================================================
    // GET BY ID - Obtener un libro por su id
    // Endpoint: GET /api/libros/{id}
    // ==========================================================
    /**
     * Busca un libro por su clave primaria.
     * @param id Clave primaria del libro
     * @return Optional con el libro si existe, vacío si no existe
     */
    public Optional<Libro> obtenerPorId(Long id) {
        return libroRepository.findById(id);
    }

    // ==========================================================
    // POST - Guardar un nuevo libro
    // Endpoint: POST /api/libros
    // ==========================================================
    /**
     * Persiste un nuevo libro en Oracle.
     * El objeto Libro llega desde el controlador, que lo creó
     * usando LibroFactory (patrón Factory).
     * @param libro Libro a insertar (id debe ser null)
     * @return Libro guardado con id asignado por Oracle
     */
    public Libro guardar(Libro libro) {
        return libroRepository.save(libro);
    }

    // ==========================================================
    // PUT - Actualizar un libro existente
    // Endpoint: PUT /api/libros/{id}
    // ==========================================================
    /**
     * Actualiza los datos de un libro existente.
     * Usa LibroFactory para construir el objeto actualizado,
     * aplicando el patrón Factory en la capa de servicio.
     * @param id              Id del libro a actualizar
     * @param libroActualizado Libro con los nuevos datos
     * @return Optional con el libro actualizado, vacío si no existe
     */
    public Optional<Libro> actualizar(Long id, Libro libroActualizado) {
        return libroRepository.findById(id).map(libroExistente -> {

            // Usa LibroFactory para construir el objeto actualizado.
            // Esto aplica el patrón Factory: la fábrica centraliza
            // la creación del objeto con los nuevos valores.
            Libro libroConDatosNuevos = libroFactory.actualizarLibro(
                id,
                libroActualizado.getTitulo(),
                libroActualizado.getAutor(),
                libroActualizado.getAnioPublicacion(),
                libroActualizado.getGenero()
            );

            // Persiste el libro actualizado en Oracle
            return libroRepository.save(libroConDatosNuevos);
        });
    }

    // ==========================================================
    // DELETE - Eliminar un libro por su id
    // Endpoint: DELETE /api/libros/{id}
    // ==========================================================
    /**
     * Elimina un libro de Oracle por su clave primaria.
     * @param id Id del libro a eliminar
     * @return true si fue eliminado, false si no existía
     */
    public boolean eliminar(Long id) {
        if (libroRepository.existsById(id)) {
            libroRepository.deleteById(id);
            return true;
        }
        return false;
    }
}
