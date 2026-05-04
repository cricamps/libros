package com.duoc.gestion.service;

import com.duoc.gestion.model.Producto;
import com.duoc.gestion.model.ProductoFactory;
import com.duoc.gestion.repository.ProductoRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

/**
 * ============================================================
 * PATRON SINGLETON: GestionService
 * Spring gestiona esta clase como un bean singleton.
 * Una sola instancia maneja toda la logica de negocio
 * para gestion de productos (CRUD admin).
 * ============================================================
 */
@Service
public class GestionService {

    // Inyeccion del repositorio JPA (Oracle Cloud)
    private final ProductoRepository productoRepository;

    public GestionService(ProductoRepository productoRepository) {
        this.productoRepository = productoRepository;
    }

    // Obtener todos los productos
    public List<Producto> obtenerTodos() {
        return productoRepository.findAll();
    }

    // Obtener producto por ID
    public Optional<Producto> obtenerPorId(Long id) {
        return productoRepository.findById(id);
    }

    // Obtener productos por categoria
    public List<Producto> obtenerPorCategoria(String categoria) {
        return productoRepository.findByCategoria(categoria);
    }

    /**
     * Agregar nuevo producto.
     * Usa ProductoFactory para inicializar valores por defecto.
     */
    public Producto agregar(Producto producto) {
        Producto nuevo = ProductoFactory.crearNuevo(
            producto.getNombre(),
            producto.getDescripcion(),
            producto.getPrecio(),
            producto.getStock(),
            producto.getCategoria()
        );
        // Respetar el campo disponible si viene explicitamente
        if (producto.getDisponible() != null) {
            nuevo.setDisponible(producto.getDisponible());
        }
        return productoRepository.save(nuevo);
    }

    /**
     * Modificar producto existente.
     * Usa ProductoFactory para clonar con cambios.
     */
    public Optional<Producto> modificar(Long id, Producto cambios) {
        return productoRepository.findById(id).map(existente -> {
            Producto actualizado = ProductoFactory.clonarConCambios(existente, cambios);
            return productoRepository.save(actualizado);
        });
    }

    /**
     * Eliminar producto por ID.
     * Retorna true si existia y fue eliminado, false si no existia.
     */
    public boolean eliminar(Long id) {
        if (!productoRepository.existsById(id)) return false;
        productoRepository.deleteById(id);
        return true;
    }

    // Cambiar disponibilidad de un producto
    public Optional<Producto> cambiarDisponibilidad(Long id, boolean disponible) {
        return productoRepository.findById(id).map(p -> {
            p.setDisponible(disponible);
            return productoRepository.save(p);
        });
    }
}
