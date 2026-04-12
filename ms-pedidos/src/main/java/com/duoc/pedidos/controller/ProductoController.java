package com.duoc.pedidos.controller;

import com.duoc.pedidos.model.Producto;
import com.duoc.pedidos.service.PedidoService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * ============================================================
 * CONTROLADOR REST: ProductoController
 * ============================================================
 * Expone endpoints de búsqueda y visualización de productos.
 *
 * Base URL : /api/productos  (puerto 8083)
 *
 * Endpoints:
 *   GET /api/productos                    → Todos los productos
 *   GET /api/productos/disponibles        → Solo disponibles
 *   GET /api/productos/{id}              → Detalle por ID
 *   GET /api/productos/buscar?nombre=X   → Búsqueda por nombre
 *   GET /api/productos/categoria/{cat}   → Filtrar por categoría
 *
 * Uso del patrón Singleton:
 *   PedidoService es gestionado por Spring como singleton.
 *   Este controlador siempre recibe la misma instancia.
 * ============================================================
 */
@RestController
@RequestMapping("/productos")
public class ProductoController {

    // Singleton: una sola instancia del servicio
    private final PedidoService pedidoService;

    public ProductoController(PedidoService pedidoService) {
        this.pedidoService = pedidoService;
    }

    // ──────────────────────────────────────────────────────
    // GET /api/productos
    // Retorna todos los productos registrados en Oracle
    // ──────────────────────────────────────────────────────
    @GetMapping
    public ResponseEntity<List<Producto>> obtenerTodos() {
        return ResponseEntity.ok(pedidoService.obtenerTodosProductos());
    }

    // ──────────────────────────────────────────────────────
    // GET /api/productos/disponibles
    // Retorna solo productos con disponible = true
    // ──────────────────────────────────────────────────────
    @GetMapping("/disponibles")
    public ResponseEntity<List<Producto>> obtenerDisponibles() {
        return ResponseEntity.ok(pedidoService.obtenerProductosDisponibles());
    }

    // ──────────────────────────────────────────────────────
    // GET /api/productos/{id}
    // Detalle de un producto por su ID
    // ──────────────────────────────────────────────────────
    @GetMapping("/{id}")
    public ResponseEntity<Producto> obtenerPorId(@PathVariable Long id) {
        return pedidoService.obtenerProductoPorId(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // ──────────────────────────────────────────────────────
    // GET /api/productos/buscar?nombre=laptop
    // Búsqueda de productos por nombre (parcial, sin mayúsculas)
    // ──────────────────────────────────────────────────────
    @GetMapping("/buscar")
    public ResponseEntity<List<Producto>> buscarPorNombre(
            @RequestParam String nombre) {
        return ResponseEntity.ok(pedidoService.buscarPorNombre(nombre));
    }

    // ──────────────────────────────────────────────────────
    // GET /api/productos/categoria/{categoria}
    // Filtrar productos por categoría
    // ──────────────────────────────────────────────────────
    @GetMapping("/categoria/{categoria}")
    public ResponseEntity<List<Producto>> obtenerPorCategoria(
            @PathVariable String categoria) {
        return ResponseEntity.ok(pedidoService.obtenerPorCategoria(categoria));
    }
}
