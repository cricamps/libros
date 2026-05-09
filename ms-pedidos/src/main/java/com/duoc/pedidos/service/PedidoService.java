package com.duoc.pedidos.service;

import com.duoc.pedidos.factory.PedidoFactory;
import com.duoc.pedidos.model.Pedido;
import com.duoc.pedidos.model.PedidoRequest;
import com.duoc.pedidos.model.Producto;
import com.duoc.pedidos.repository.PedidoRepository;
import com.duoc.pedidos.repository.ProductoRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

/**
 * ============================================================
 * SERVICIO: PedidoService
 * PATRÓN SINGLETON – Spring crea una sola instancia (@Service).
 * Centraliza la lógica de catálogo de productos y pedidos.
 * Usa PedidoFactory para garantizar integridad al crear pedidos.
 * ============================================================
 */
@Service
public class PedidoService {

    private final ProductoRepository productoRepo;
    private final PedidoRepository pedidoRepo;
    private final PedidoFactory pedidoFactory;

    // Inyección por constructor (Singleton pattern)
    public PedidoService(ProductoRepository productoRepo,
                         PedidoRepository pedidoRepo,
                         PedidoFactory pedidoFactory) {
        this.productoRepo = productoRepo;
        this.pedidoRepo = pedidoRepo;
        this.pedidoFactory = pedidoFactory;
    }

    // ── Catálogo de Productos ─────────────────────────────────

    /** Todos los productos */
    public List<Producto> obtenerTodosProductos() {
        return productoRepo.findAll();
    }

    /** Solo productos disponibles */
    public List<Producto> obtenerProductosDisponibles() {
        return productoRepo.findByDisponibleTrue();
    }

    /** Buscar producto por ID */
    public Optional<Producto> obtenerProductoPorId(Long id) {
        return productoRepo.findById(id);
    }

    /** Buscar por nombre (parcial, case-insensitive) */
    public List<Producto> buscarPorNombre(String nombre) {
        return productoRepo.buscarPorNombre(nombre);
    }

    /** Filtrar por categoría */
    public List<Producto> obtenerPorCategoria(String categoria) {
        return productoRepo.findByCategoriaIgnoreCase(categoria);
    }

    // ── Pedidos ──────────────────────────────────────────────

    /** Crear nuevo pedido usando PedidoFactory (PATRÓN FACTORY) */
    public Pedido crearPedido(PedidoRequest request) {
        // PedidoFactory asigna estado PENDIENTE y fecha actual
        Pedido pedido = pedidoFactory.crear(request.getUsuarioId(), request.getTotal());
        // Respetar estado si viene explícito en el request
        if (request.getEstado() != null && !request.getEstado().isBlank()) {
            pedido.setEstado(request.getEstado());
        }
        return pedidoRepo.save(pedido);
    }

    /** Pedidos del usuario ordenados por fecha descendente */
    public List<Pedido> obtenerPedidosPorUsuario(Long usuarioId) {
        return pedidoRepo.findByUsuarioIdOrderByFechaDesc(usuarioId);
    }

    /** Todos los pedidos (uso admin) */
    public List<Pedido> obtenerTodosPedidos() {
        return pedidoRepo.findAll();
    }

    /** Buscar pedido por ID */
    public Optional<Pedido> obtenerPedidoPorId(Long id) {
        return pedidoRepo.findById(id);
    }
}
