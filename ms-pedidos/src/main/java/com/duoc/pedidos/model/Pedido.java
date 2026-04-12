package com.duoc.pedidos.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;

/**
 * ============================================================
 * ENTIDAD: Pedido
 * Mapea la tabla PEDIDOS de Oracle Cloud.
 * Representa una orden de compra realizada por un usuario.
 * ============================================================
 */
@Entity
@Table(name = "PEDIDOS")
public class Pedido {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotNull(message = "El usuarioId es obligatorio")
    @Column(name = "USUARIO_ID", nullable = false)
    private Long usuarioId;

    @NotNull(message = "El productoId es obligatorio")
    @Column(name = "PRODUCTO_ID", nullable = false)
    private Long productoId;

    @NotBlank(message = "El nombre del producto es obligatorio")
    @Column(name = "NOMBRE_PRODUCTO", nullable = false, length = 200)
    private String nombreProducto;

    @NotNull(message = "La cantidad es obligatoria")
    @Positive(message = "La cantidad debe ser mayor a 0")
    @Column(name = "CANTIDAD", nullable = false)
    private Integer cantidad;

    @NotNull(message = "El precio unitario es obligatorio")
    @Positive(message = "El precio debe ser mayor a 0")
    @Column(name = "PRECIO_UNITARIO", nullable = false)
    private Double precioUnitario;

    @Column(name = "TOTAL", nullable = false)
    private Double total;

    @Column(name = "ESTADO", length = 20, nullable = false)
    private String estado = "PENDIENTE";

    @Column(name = "FECHA", length = 20, nullable = false)
    private String fecha;

    // Constructor vacío requerido por JPA
    public Pedido() {}

    // Constructor completo usado por PedidoFactory
    public Pedido(Long id, Long usuarioId, Long productoId, String nombreProducto,
                  Integer cantidad, Double precioUnitario, Double total,
                  String estado, String fecha) {
        this.id = id;
        this.usuarioId = usuarioId;
        this.productoId = productoId;
        this.nombreProducto = nombreProducto;
        this.cantidad = cantidad;
        this.precioUnitario = precioUnitario;
        this.total = total;
        this.estado = estado;
        this.fecha = fecha;
    }

    // Getters y Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getUsuarioId() { return usuarioId; }
    public void setUsuarioId(Long usuarioId) { this.usuarioId = usuarioId; }

    public Long getProductoId() { return productoId; }
    public void setProductoId(Long productoId) { this.productoId = productoId; }

    public String getNombreProducto() { return nombreProducto; }
    public void setNombreProducto(String nombreProducto) { this.nombreProducto = nombreProducto; }

    public Integer getCantidad() { return cantidad; }
    public void setCantidad(Integer cantidad) { this.cantidad = cantidad; }

    public Double getPrecioUnitario() { return precioUnitario; }
    public void setPrecioUnitario(Double precioUnitario) { this.precioUnitario = precioUnitario; }

    public Double getTotal() { return total; }
    public void setTotal(Double total) { this.total = total; }

    public String getEstado() { return estado; }
    public void setEstado(String estado) { this.estado = estado; }

    public String getFecha() { return fecha; }
    public void setFecha(String fecha) { this.fecha = fecha; }
}
