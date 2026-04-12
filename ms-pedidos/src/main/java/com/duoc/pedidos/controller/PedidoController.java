package com.duoc.pedidos.controller;

import com.duoc.pedidos.model.Pedido;
import com.duoc.pedidos.service.PedidoService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

/**
 * ============================================================
 * CONTROLADOR REST: PedidoController
 * ============================================================
 * Expone endpoints de compra y gestión de pedidos.
 *
 * Base URL : /api/pedidos  (puerto 8083)
 *
 * Endpoints:
 *   POST /api/pedidos                       → Realizar compra
 *   GET  /api/pedidos                       → Todos (ADMIN)
 *   GET  /api/pedidos/{id}                  → Detalle pedido
 *   GET  /api/pedidos/usuario/{usuarioId}   → Historial usuario
 *   PUT  /api/pedidos/{id}/estado           → Actualizar estado
 *   DELETE /api/pedidos/{id}                → Cancelar pedido
 *
 * Patrones aplicados:
 *   - Singleton: PedidoService (instancia única de Spring)
 *   - Factory:   PedidoFactory usada en el servicio para crear
 *                y actualizar objetos Pedido
 * ============================================================
 */
@RestController
@RequestMapping("/pedidos")
public class PedidoController {

    // Singleton: Spring entrega siempre la misma instancia
    private final PedidoService pedidoService;

    public PedidoController(PedidoService pedidoService) {
        this.pedidoService = pedidoService;
    }

    // ──────────────────────────────────────────────────────
    // POST /api/pedidos
    // Realiza una compra: valida stock, descuenta inventario,
    // crea el pedido en Oracle usando PedidoFactory
    //
    // Body esperado:
    // {
    //   "usuarioId": 2,
    //   "productoId": 1,
    //   "cantidad": 2
    // }
    // ──────────────────────────────────────────────────────
    @PostMapping
    public ResponseEntity<Pedido> realizarPedido(
            @RequestBody Map<String, Object> body) {
        Long usuarioId  = Long.valueOf(body.get("usuarioId").toString());
        Long productoId = Long.valueOf(body.get("productoId").toString());
        Integer cantidad = Integer.valueOf(body.get("cantidad").toString());

        Pedido pedido = pedidoService.realizarPedido(usuarioId, productoId, cantidad);
        return ResponseEntity.status(HttpStatus.CREATED).body(pedido);
    }

    // ──────────────────────────────────────────────────────
    // GET /api/pedidos
    // Lista todos los pedidos (uso ADMIN)
    // ──────────────────────────────────────────────────────
    @GetMapping
    public ResponseEntity<List<Pedido>> obtenerTodos() {
        return ResponseEntity.ok(pedidoService.obtenerTodosPedidos());
    }

    // ──────────────────────────────────────────────────────
    // GET /api/pedidos/{id}
    // Detalle de un pedido por su ID
    // ──────────────────────────────────────────────────────
    @GetMapping("/{id}")
    public ResponseEntity<Pedido> obtenerPorId(@PathVariable Long id) {
        return pedidoService.obtenerPedidoPorId(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // ──────────────────────────────────────────────────────
    // GET /api/pedidos/usuario/{usuarioId}
    // Historial de pedidos de un usuario específico
    // ──────────────────────────────────────────────────────
    @GetMapping("/usuario/{usuarioId}")
    public ResponseEntity<List<Pedido>> obtenerPorUsuario(
            @PathVariable Long usuarioId) {
        return ResponseEntity.ok(pedidoService.obtenerPedidosPorUsuario(usuarioId));
    }

    // ──────────────────────────────────────────────────────
    // PUT /api/pedidos/{id}/estado
    // Actualiza el estado de un pedido (ADMIN)
    // Usa PedidoFactory para construir el objeto actualizado
    //
    // Body esperado: { "estado": "ENVIADO" }
    // Estados válidos: PENDIENTE, PROCESANDO, ENVIADO, ENTREGADO
    // ──────────────────────────────────────────────────────
    @PutMapping("/{id}/estado")
    public ResponseEntity<Pedido> actualizarEstado(
            @PathVariable Long id,
            @RequestBody Map<String, String> body) {
        String nuevoEstado = body.get("estado");
        return pedidoService.actualizarEstado(id, nuevoEstado)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // ──────────────────────────────────────────────────────
    // DELETE /api/pedidos/{id}
    // Cancela/elimina un pedido
    // ──────────────────────────────────────────────────────
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> cancelarPedido(@PathVariable Long id) {
        if (pedidoService.cancelarPedido(id)) {
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.notFound().build();
    }
}
