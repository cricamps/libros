package com.duoc.gestion;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

/**
 * ============================================================
 * MICROSERVICIO: ms-gestion
 * Gestion de Productos (agregar, modificar, eliminar)
 * Patron Singleton: Spring gestiona GestionService como bean unico
 * Patron Factory: ProductoFactory crea instancias de Producto
 * Puerto: 8082
 * ============================================================
 */
@SpringBootApplication
public class MsGestionApplication {
    public static void main(String[] args) {
        SpringApplication.run(MsGestionApplication.class, args);
    }
}
