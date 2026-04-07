package com.duoc.s4;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

/**
 * ============================================================
 * CLASE PRINCIPAL - biblioteca-s4
 * ============================================================
 * Microservicio de gestión de libros generado desde el
 * arquetipo Maven propio: biblioteca-arquetipo v1.0.0
 *
 * Patrones de diseño implementados en este microservicio:
 *
 *  1. SINGLETON  → LibroService
 *     Spring garantiza una única instancia del servicio en toda
 *     la aplicación mediante la anotación @Service.
 *     Esto centraliza la lógica de negocio y el acceso a datos.
 *
 *  2. FACTORY    → LibroFactory
 *     Encapsula la creación de objetos Libro, separando la lógica
 *     de construcción del resto de la aplicación.
 *     El controlador usa LibroFactory para crear instancias
 *     con validación centralizada antes de persistirlas.
 *
 * Curso   : DSY2205 - Desarrollo Full Stack III
 * Semana  : 4 - Arquetipos, branching y gestión de componentes
 * ============================================================
 */
@SpringBootApplication
public class BibliotecaS4Application {

    public static void main(String[] args) {
        SpringApplication.run(BibliotecaS4Application.class, args);
    }
}
