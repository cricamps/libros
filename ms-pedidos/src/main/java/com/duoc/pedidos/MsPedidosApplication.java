package com.duoc.pedidos;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

// ============================================================
// MICROSERVICIO: ms-pedidos
// Búsqueda, visualización y compra de productos
// Patrones: Singleton (PedidoService) + Factory (PedidoFactory)
// Puerto: 8083
// Rutas: /api/productos (catálogo) | /api/pedidos (compras)
// ============================================================
@SpringBootApplication
public class MsPedidosApplication {
    public static void main(String[] args) {
        SpringApplication.run(MsPedidosApplication.class, args);
    }
}
