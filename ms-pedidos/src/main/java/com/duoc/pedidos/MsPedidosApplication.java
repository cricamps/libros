package com.duoc.pedidos;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

/**
 * ============================================================
 * APLICACIÓN PRINCIPAL - ms-pedidos
 * Microservicio de Búsqueda, Visualización y Compra de Productos
 * Puerto: 8083 | Context-path: /api
 *
 * Endpoints principales:
 *   GET  /api/productos          → Listar todos los productos
 *   GET  /api/productos/{id}     → Ver detalle de un producto
 *   GET  /api/productos/buscar   → Buscar por nombre/categoría
 *   POST /api/pedidos            → Realizar una compra
 *   GET  /api/pedidos/{usuarioId}→ Historial de pedidos
 *   GET  /api/pedidos            → Todos los pedidos (ADMIN)
 *   PUT  /api/pedidos/{id}/estado→ Actualizar estado pedido
 * ============================================================
 */
@SpringBootApplication
public class MsPedidosApplication {
    public static void main(String[] args) {
        SpringApplication.run(MsPedidosApplication.class, args);
    }
}
