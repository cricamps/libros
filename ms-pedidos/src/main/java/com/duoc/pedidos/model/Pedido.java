package com.duoc.pedidos.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import java.time.LocalDate;

// ============================================================
// ENTIDAD: Pedido
// Mapea la tabla PEDIDOS en Oracle Cloud
// ============================================================
@Entity
@Table(name = "PEDIDOS")
public class Pedido {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotNull(message = "El ID de usuario es obligatorio")
    @Column(name = "USUARIO_ID", nullable = false)
    private Long usuarioId;

    @NotNull(message = "El total es obligatorio")
    @Positive(message = "El total debe ser mayor que cero")
    @Column(name = "TOTAL", nullable = false)
    private Double total;

    @NotBlank(message = "El estado es obligatorio")
    @Column(name = "ESTADO", nullable = false, length = 20)
    private String estado;

    @Column(name = "FECHA", nullable = false)
    private LocalDate fecha;

    public Pedido() {}

    public Pedido(Long usuarioId, Double total, String estado, LocalDate fecha) {
        this.usuarioId = usuarioId;
        this.total = total;
        this.estado = estado;
        this.fecha = fecha;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public Long getUsuarioId() { return usuarioId; }
    public void setUsuarioId(Long usuarioId) { this.usuarioId = usuarioId; }
    public Double getTotal() { return total; }
    public void setTotal(Double total) { this.total = total; }
    public String getEstado() { return estado; }
    public void setEstado(String estado) { this.estado = estado; }
    public LocalDate getFecha() { return fecha; }
    public void setFecha(LocalDate fecha) { this.fecha = fecha; }
}
