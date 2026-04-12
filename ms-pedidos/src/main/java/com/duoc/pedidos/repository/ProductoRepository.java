package com.duoc.pedidos.repository;

import com.duoc.pedidos.model.Producto;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * ============================================================
 * REPOSITORIO: ProductoRepository
 * Acceso JPA a la tabla PRODUCTOS de Oracle Cloud.
 * ============================================================
 */
@Repository
public interface ProductoRepository extends JpaRepository<Producto, Long> {

    // Buscar productos disponibles
    List<Producto> findByDisponibleTrue();

    // Buscar por categoría
    List<Producto> findByCategoriaIgnoreCase(String categoria);

    // Buscar por nombre (contiene, case-insensitive)
    @Query("SELECT p FROM Producto p WHERE LOWER(p.nombre) LIKE LOWER(CONCAT('%', :nombre, '%'))")
    List<Producto> buscarPorNombre(@Param("nombre") String nombre);

    // Buscar disponibles por categoría
    List<Producto> findByCategoriaIgnoreCaseAndDisponibleTrue(String categoria);
}
