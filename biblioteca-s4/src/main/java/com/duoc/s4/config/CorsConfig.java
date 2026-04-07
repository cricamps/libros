package com.duoc.s4.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.lang.NonNull;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

/**
 * ============================================================
 * CONFIGURACIÓN CORS - CorsConfig
 * ============================================================
 * Permite que clientes externos (Angular, Postman, navegador)
 * puedan realizar peticiones HTTP a este microservicio.
 *
 * En desarrollo: permite cualquier origen (*) para facilitar
 * las pruebas con Postman y con el frontend Angular.
 * ============================================================
 */
@Configuration
public class CorsConfig {

    @Bean
    public WebMvcConfigurer corsConfigurer() {
        return new WebMvcConfigurer() {

            @Override
            public void addCorsMappings(@NonNull CorsRegistry registry) {
                registry.addMapping("/**")
                        .allowedOriginPatterns("*")
                        .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS")
                        .allowedHeaders("*");
            }
        };
    }
}
