package com.full3.full3.repository;

// Importa la entidad Libro, que será administrada por este repository
import com.full3.full3.model.Libro;

// Importa JpaRepository, que entrega operaciones CRUD ya implementadas
import org.springframework.data.jpa.repository.JpaRepository;

// Define una interfaz repository para trabajar con la entidad Libro
// JpaRepository<Libro, Long> significa:
// - Libro: la entidad que manejará este repository
// - Long: el tipo de dato de la clave primaria (id)
public interface LibroRepository extends JpaRepository<Libro, Long> {

    // JpaRepository ya provee los métodos CRUD básicos:
    // save()         -> insertar o actualizar
    // findById()     -> buscar por id
    // findAll()      -> listar todos
    // deleteById()   -> eliminar por id
    // existsById()   -> verificar si existe
}
