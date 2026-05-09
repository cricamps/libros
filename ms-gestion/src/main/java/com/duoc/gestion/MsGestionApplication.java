package com.duoc.gestion;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

// ============================================================
// MICROSERVICIO: ms-gestion
// Gestión de Productos – solo accesible por ADMIN
// Patrones: Singleton (GestionService) + Factory (ProductoFactory)
// Puerto: 8082
// Ruta base: /api/gestion/productos
// ============================================================
@SpringBootApplication
public class MsGestionApplication {
    public static void main(String[] args) {
        SpringApplication.run(MsGestionApplication.class, args);
    }
}
