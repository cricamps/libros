package com.duoc.pedidos.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;

/**
 * ============================================================
 * ENTIDAD: Producto
 * Mapea la tabla PRODUCTOS de Oracle Cloud.
 * Usada para búsqueda y visualización en el catálogo.
 * ============================================================
 */
@Entity
@Table(name = "PRODUCTOS")
public class Producto {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "El nombre es obligatorio")
    @Column(name = "NOMBRE", nullable = false, length = 200)
    private String nombre;

    @NotBlank(message = "La descripcion es obligatoria")
    @Column(name = "DESCRIPCION", length = 500)
    private String descripcion;

    @NotNull(message = "El precio es obligatorio")
    @Positive(message = "El precio debe ser mayor a 0")
    @Column(name = "PRECIO", nullable = false)
    private Double precio;

    @NotNull(message = "El stock es obligatorio")
    @PositiveOrZero(message = "El stock no puede ser negativo")
    @Column(name = "STOCK", nullable = false)
    private Integer stock;

    @NotBlank(message = "La categoria es obligatoria")
    @Column(name = "CATEGORIA", length = 100)
    private String categoria;

    @Column(name = "DISPONIBLE", nullable = false)
    private Boolean disponible = true;

    // Constructor vacío requerido por JPA
    public Producto() {}

    // Constructor completo usado por ProductoFactory
    public Producto(Long id, String nombre, String descripcion,
                    Double precio, Integer stock, String categoria, Boolean disponible) {
        this.id = id;
        this.nombre = nombre;
        this.descripcion = descripcion;
        this.precio = precio;
        this.stock = stock;
        this.categoria = categoria;
        this.disponible = disponible;
    }

    // Getters y Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getNombre() { return nombre; }
    public void setNombre(String nombre) { this.nombre = nombre; }

    public String getDescripcion() { return descripcion; }
    public void setDescripcion(String descripcion) { this.descripcion = descripcion; }

    public Double getPrecio() { return precio; }
    public void setPrecio(Double precio) { this.precio = precio; }

    public Integer getStock() { return stock; }
    public void setStock(Integer stock) { this.stock = stock; }

    public String getCategoria() { return categoria; }
    public void setCategoria(String categoria) { this.categoria = categoria; }

    public Boolean getDisponible() { return disponible; }
    public void setDisponible(Boolean disponible) { this.disponible = disponible; }
}
