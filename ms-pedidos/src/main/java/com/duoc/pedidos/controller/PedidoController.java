package com.duoc.pedidos.controller;

import com.duoc.pedidos.model.Pedido;
import com.duoc.pedidos.model.PedidoRequest;
import com.duoc.pedidos.service.PedidoService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

// ============================================================
// CONTROLADOR: PedidoController
// Ruta base: /api/pedidos
// Maneja la creación y consulta de pedidos.
// POST /api/pedidos – cuerpo alineado con ProductoService Angular
// ============================================================
@RestController
@RequestMapping("/pedidos")
public class PedidoController {

    private final PedidoService pedidoService;

    public PedidoController(PedidoService pedidoService) {
        this.pedidoService = pedidoService;
    }

    // POST /api/pedidos  ← lo llama Angular al finalizar compra
    @PostMapping
    public ResponseEntity<Pedido> crear(@RequestBody PedidoRequest request) {
        Pedido creado = pedidoService.crearPedido(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(creado);
    }

    // GET /api/pedidos?usuarioId=2  ← pedidos del cliente logueado
    @GetMapping
    public List<Pedido> listar(@RequestParam(required = false) Long usuarioId) {
        if (usuarioId != null) {
            return pedidoService.obtenerPedidosPorUsuario(usuarioId);
        }
        return pedidoService.obtenerTodosPedidos();
    }

    // GET /api/pedidos/{id}
    @GetMapping("/{id}")
    public ResponseEntity<Pedido> obtener(@PathVariable Long id) {
        return pedidoService.obtenerPedidoPorId(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
}
