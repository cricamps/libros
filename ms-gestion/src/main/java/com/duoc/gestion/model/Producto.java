package com.duoc.gestion.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;

/**
 * ============================================================
 * ENTIDAD: Producto
 * Mapea la tabla PRODUCTOS en Oracle Cloud (BibliotecaDB).
 * Compartida entre ms-gestion (escritura) y ms-pedidos (lectura).
 * ============================================================
 */
@Entity
@Table(name = "PRODUCTOS")
public class Producto {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "El nombre del producto es obligatorio")
    @Column(name = "NOMBRE", nullable = false, length = 200)
    private String nombre;

    @NotBlank(message = "La descripción es obligatoria")
    @Column(name = "DESCRIPCION", nullable = false, length = 500)
    private String descripcion;

    @NotNull(message = "El precio es obligatorio")
    @Positive(message = "El precio debe ser mayor que cero")
    @Column(name = "PRECIO", nullable = false)
    private Double precio;

    @NotNull(message = "El stock es obligatorio")
    @Min(value = 0, message = "El stock no puede ser negativo")
    @Column(name = "STOCK", nullable = false)
    private Integer stock;

    @NotBlank(message = "La categoría es obligatoria")
    @Column(name = "CATEGORIA", nullable = false, length = 100)
    private String categoria;

    // Oracle almacena DISPONIBLE como NUMBER(1): 1=true, 0=false
    // Se mapea a Boolean con columnDefinition NUMBER(1)
    @Column(name = "DISPONIBLE", nullable = false)
    private Boolean disponible = true;

    public Producto() {}

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
