package com.duoc.gestion.service;

import com.duoc.gestion.model.Producto;
import com.duoc.gestion.model.ProductoFactory;
import com.duoc.gestion.repository.ProductoRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

/**
 * ============================================================
 * SERVICIO: GestionService
 * PATRÓN SINGLETON – Spring crea una sola instancia (@Service).
 * Centraliza la lógica de negocio para gestión de productos.
 * Usa ProductoFactory para garantizar integridad al crear/clonar.
 * ============================================================
 */
@Service
public class GestionService {

    private final ProductoRepository repository;

    // Inyección de dependencias por constructor (Singleton pattern)
    public GestionService(ProductoRepository repository) {
        this.repository = repository;
    }

    // Listar todos los productos
    public List<Producto> obtenerTodos() {
        return repository.findAll();
    }

    // Buscar por ID
    public Optional<Producto> obtenerPorId(Long id) {
        return repository.findById(id);
    }

    // Filtrar por categoría
    public List<Producto> obtenerPorCategoria(String categoria) {
        return repository.findByCategoria(categoria);
    }

    // Agregar nuevo producto usando Factory (PATRÓN FACTORY)
    public Producto agregar(Producto producto) {
        Producto nuevo = ProductoFactory.crearNuevo(
            producto.getNombre(),
            producto.getDescripcion(),
            producto.getPrecio(),
            producto.getStock(),
            producto.getCategoria()
        );
        // Respetar disponible si viene explícito
        if (producto.getDisponible() != null) {
            nuevo.setDisponible(producto.getDisponible());
        }
        return repository.save(nuevo);
    }

    // Modificar producto existente usando Factory (clonar con cambios)
    public Optional<Producto> modificar(Long id, Producto datos) {
        return repository.findById(id).map(existente -> {
            Producto actualizado = ProductoFactory.clonarConCambios(existente, datos);
            return repository.save(actualizado);
        });
    }

    // Eliminar producto
    public boolean eliminar(Long id) {
        if (repository.existsById(id)) {
            repository.deleteById(id);
            return true;
        }
        return false;
    }

    // Cambiar disponibilidad de un producto
    public Optional<Producto> cambiarDisponibilidad(Long id, boolean disponible) {
        return repository.findById(id).map(p -> {
            p.setDisponible(disponible);
            return repository.save(p);
        });
    }
}
