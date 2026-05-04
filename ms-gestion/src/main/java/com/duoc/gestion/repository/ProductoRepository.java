package com.duoc.gestion.repository;

import com.duoc.gestion.model.Producto;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * Repositorio JPA para Producto.
 * Spring Data genera automaticamente la implementacion.
 */
@Repository
public interface ProductoRepository extends JpaRepository<Producto, Long> {

    // Buscar por categoria
    List<Producto> findByCategoria(String categoria);

    // Buscar disponibles
    List<Producto> findByDisponibleTrue();

    // Buscar por nombre (parcial, sin distinguir mayusculas)
    List<Producto> findByNombreContainingIgnoreCase(String nombre);
}
