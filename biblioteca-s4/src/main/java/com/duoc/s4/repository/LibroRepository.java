package com.duoc.s4.repository;

import com.duoc.s4.model.Libro;
import org.springframework.data.jpa.repository.JpaRepository;

/**
 * ============================================================
 * REPOSITORIO LibroRepository - Capa de Acceso a Datos
 * ============================================================
 * Extiende JpaRepository para obtener automáticamente los
 * métodos CRUD:
 *   save()        → insertar o actualizar un libro
 *   findById()    → buscar un libro por su id
 *   findAll()     → obtener todos los libros
 *   deleteById()  → eliminar un libro por su id
 *   existsById()  → verificar si existe un libro con ese id
 *
 * Spring Data JPA genera la implementación en tiempo de
 * ejecución, no es necesario escribir queries SQL manualmente.
 * ============================================================
 */
public interface LibroRepository extends JpaRepository<Libro, Long> {
    // JpaRepository provee todos los métodos CRUD necesarios.
    // No se requieren métodos adicionales para este microservicio.
}
