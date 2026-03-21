package com.full3.full3.model;

// Importa las anotaciones de JPA para mapear la clase a una tabla de Oracle
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

// Importa anotaciones de validación para controlar los datos recibidos
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

// Indica que esta clase es una entidad JPA
@Entity

// Define el nombre de la tabla en Oracle
@Table(name = "PRODUCTOS")
public class Producto {

    // Clave primaria generada automáticamente
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // El nombre del producto no puede estar vacío
    @NotBlank(message = "El nombre del producto es obligatorio")

    // Columna NOMBRE en la tabla PRODUCTOS
    @Column(name = "NOMBRE", nullable = false, length = 200)
    private String nombre;

    // La descripción no puede estar vacía
    @NotBlank(message = "La descripción es obligatoria")

    // Columna DESCRIPCION en la tabla PRODUCTOS
    @Column(name = "DESCRIPCION", nullable = false, length = 500)
    private String descripcion;

    // El precio no puede ser nulo y debe ser mayor que cero
    @NotNull(message = "El precio es obligatorio")
    @Positive(message = "El precio debe ser mayor que cero")

    // Columna PRECIO en la tabla PRODUCTOS
    @Column(name = "PRECIO", nullable = false)
    private Double precio;

    // El stock no puede ser nulo y debe ser cero o mayor
    @NotNull(message = "El stock es obligatorio")
    @Min(value = 0, message = "El stock no puede ser negativo")

    // Columna STOCK en la tabla PRODUCTOS
    @Column(name = "STOCK", nullable = false)
    private Integer stock;

    // La categoría no puede estar vacía
    @NotBlank(message = "La categoría es obligatoria")

    // Columna CATEGORIA en la tabla PRODUCTOS
    @Column(name = "CATEGORIA", nullable = false, length = 100)
    private String categoria;

    // Constructor vacío obligatorio para JPA
    public Producto() {
    }

    // Constructor con todos los campos para facilitar la creación de objetos
    public Producto(Long id, String nombre, String descripcion, Double precio, Integer stock, String categoria) {
        this.id = id;
        this.nombre = nombre;
        this.descripcion = descripcion;
        this.precio = precio;
        this.stock = stock;
        this.categoria = categoria;
    }

    // Devuelve el id del producto
    public Long getId() {
        return id;
    }

    // Asigna el id del producto
    public void setId(Long id) {
        this.id = id;
    }

    // Devuelve el nombre del producto
    public String getNombre() {
        return nombre;
    }

    // Asigna el nombre del producto
    public void setNombre(String nombre) {
        this.nombre = nombre;
    }

    // Devuelve la descripción del producto
    public String getDescripcion() {
        return descripcion;
    }

    // Asigna la descripción del producto
    public void setDescripcion(String descripcion) {
        this.descripcion = descripcion;
    }

    // Devuelve el precio del producto
    public Double getPrecio() {
        return precio;
    }

    // Asigna el precio del producto
    public void setPrecio(Double precio) {
        this.precio = precio;
    }

    // Devuelve el stock disponible del producto
    public Integer getStock() {
        return stock;
    }

    // Asigna el stock del producto
    public void setStock(Integer stock) {
        this.stock = stock;
    }

    // Devuelve la categoría del producto
    public String getCategoria() {
        return categoria;
    }

    // Asigna la categoría del producto
    public void setCategoria(String categoria) {
        this.categoria = categoria;
    }
}
