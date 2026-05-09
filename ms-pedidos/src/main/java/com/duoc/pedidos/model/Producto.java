package com.duoc.pedidos.model;

import jakarta.persistence.*;

/**
 * ============================================================
 * ENTIDAD: Producto (solo lectura desde ms-pedidos)
 * ms-pedidos consulta la tabla PRODUCTOS para el catálogo.
 * La escritura (CRUD) queda exclusivamente en ms-gestion.
 * ============================================================
 */
@Entity
@Table(name = "PRODUCTOS")
public class Producto {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "NOMBRE")
    private String nombre;

    @Column(name = "DESCRIPCION")
    private String descripcion;

    @Column(name = "PRECIO")
    private Double precio;

    @Column(name = "STOCK")
    private Integer stock;

    @Column(name = "CATEGORIA")
    private String categoria;

    // Oracle NUMBER(1) mapeado a Boolean: 1=true, 0=false
    @Column(name = "DISPONIBLE")
    private Boolean disponible;

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
