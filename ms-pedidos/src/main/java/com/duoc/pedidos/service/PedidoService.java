package com.duoc.pedidos.service;

import com.duoc.pedidos.factory.PedidoFactory;
import com.duoc.pedidos.model.Pedido;
import com.duoc.pedidos.model.Producto;
import com.duoc.pedidos.repository.PedidoRepository;
import com.duoc.pedidos.repository.ProductoRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

/**
 * ============================================================
 * PATRÓN DE DISEÑO: SINGLETON
 * ============================================================
 * Clase: PedidoService
 *
 * Spring Boot crea UNA sola instancia de esta clase y la
 * reutiliza en todos los controladores que la inyecten.
 *
 * Responsabilidades:
 *  1. Lógica de búsqueda y visualización de productos
 *  2. Lógica de creación y gestión de pedidos
 *  3. Validaciones de negocio (stock, disponibilidad)
 *
 * Usa PedidoFactory (patrón Factory) para construir
 * los objetos Pedido antes de persistirlos en Oracle.
 * ============================================================
 */
@Service
public class PedidoService {

    private final ProductoRepository productoRepository;
    private final PedidoRepository   pedidoRepository;
    private final PedidoFactory       pedidoFactory;

    public PedidoService(ProductoRepository productoRepository,
                         PedidoRepository pedidoRepository,
                         PedidoFactory pedidoFactory) {
        this.productoRepository = productoRepository;
        this.pedidoRepository   = pedidoRepository;
        this.pedidoFactory      = pedidoFactory;
    }

    // ══════════════════════════════════════════════════════
    // PRODUCTOS — búsqueda y visualización
    // ══════════════════════════════════════════════════════

    /** GET /api/productos — todos los productos */
    public List<Producto> obtenerTodosProductos() {
        return productoRepository.findAll();
    }

    /** GET /api/productos/disponibles — solo disponibles */
    public List<Producto> obtenerProductosDisponibles() {
        return productoRepository.findByDisponibleTrue();
    }

    /** GET /api/productos/{id} — detalle de un producto */
    public Optional<Producto> obtenerProductoPorId(Long id) {
        return productoRepository.findById(id);
    }

    /** GET /api/productos/buscar?nombre=X — búsqueda por nombre */
    public List<Producto> buscarPorNombre(String nombre) {
        return productoRepository.buscarPorNombre(nombre);
    }

    /** GET /api/productos/categoria/{cat} — filtrar por categoría */
    public List<Producto> obtenerPorCategoria(String categoria) {
        return productoRepository.findByCategoriaIgnoreCase(categoria);
    }

    // ══════════════════════════════════════════════════════
    // PEDIDOS — compra y gestión
    // ══════════════════════════════════════════════════════

    /**
     * POST /api/pedidos — realizar una compra.
     * Valida stock y disponibilidad antes de crear el pedido.
     * Usa PedidoFactory para construir el objeto Pedido.
     */
    public Pedido realizarPedido(Long usuarioId, Long productoId, Integer cantidad) {
        Producto producto = productoRepository.findById(productoId)
            .orElseThrow(() -> new RuntimeException("Producto no encontrado con id: " + productoId));

        if (!producto.getDisponible()) {
            throw new RuntimeException("El producto '" + producto.getNombre() + "' no está disponible.");
        }
        if (producto.getStock() < cantidad) {
            throw new RuntimeException("Stock insuficiente. Disponible: " + producto.getStock());
        }

        // Actualizar stock
        producto.setStock(producto.getStock() - cantidad);
        if (producto.getStock() == 0) producto.setDisponible(false);
        productoRepository.save(producto);

        // Crear pedido usando la Factory (patrón Factory)
        Pedido nuevoPedido = pedidoFactory.crearPedido(
            usuarioId, productoId, producto.getNombre(),
            cantidad, producto.getPrecio()
        );

        return pedidoRepository.save(nuevoPedido);
    }

    /** GET /api/pedidos — todos los pedidos (ADMIN) */
    public List<Pedido> obtenerTodosPedidos() {
        return pedidoRepository.findAll();
    }

    /** GET /api/pedidos/usuario/{usuarioId} — historial por usuario */
    public List<Pedido> obtenerPedidosPorUsuario(Long usuarioId) {
        return pedidoRepository.findByUsuarioIdOrderByFechaDesc(usuarioId);
    }

    /** GET /api/pedidos/{id} — detalle de un pedido */
    public Optional<Pedido> obtenerPedidoPorId(Long id) {
        return pedidoRepository.findById(id);
    }

    /**
     * PUT /api/pedidos/{id}/estado — actualizar estado.
     * Estados válidos: PENDIENTE, PROCESANDO, ENVIADO, ENTREGADO.
     * Usa PedidoFactory para construir el objeto actualizado.
     */
    public Optional<Pedido> actualizarEstado(Long id, String nuevoEstado) {
        List<String> estadosValidos = List.of("PENDIENTE", "PROCESANDO", "ENVIADO", "ENTREGADO");
        if (!estadosValidos.contains(nuevoEstado.toUpperCase())) {
            throw new RuntimeException("Estado inválido. Valores permitidos: " + estadosValidos);
        }
        return pedidoRepository.findById(id).map(existente -> {
            // Usa PedidoFactory para construir el pedido con nuevo estado
            Pedido actualizado = pedidoFactory.actualizarEstado(existente, nuevoEstado.toUpperCase());
            return pedidoRepository.save(actualizado);
        });
    }

    /** DELETE /api/pedidos/{id} — cancelar pedido */
    public boolean cancelarPedido(Long id) {
        if (pedidoRepository.existsById(id)) {
            pedidoRepository.deleteById(id);
            return true;
        }
        return false;
    }
}
