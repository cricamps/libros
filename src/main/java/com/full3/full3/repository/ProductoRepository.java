package com.full3.full3.repository;

// Importa la entidad Producto que será administrada por este repository
import com.full3.full3.model.Producto;

// Importa JpaRepository, que entrega operaciones CRUD ya implementadas
import org.springframework.data.jpa.repository.JpaRepository;

// Define el repository de Producto.
// JpaRepository<Producto, Long>:
// - Producto: entidad que administra este repository
// - Long: tipo de la clave primaria (id)
public interface ProductoRepository extends JpaRepository<Producto, Long> {

    // JpaRepository ya provee los métodos CRUD básicos:
    // save()         -> insertar o actualizar
    // findById()     -> buscar por id
    // findAll()      -> listar todos
    // deleteById()   -> eliminar por id
    // existsById()   -> verificar si existe
}
