package com.duoc.pedidos.model;

// ============================================================
// DTO: PedidoRequest
// Cuerpo que recibe el endpoint POST /api/pedidos desde Angular.
// Coincide exactamente con lo que envía ProductoService.realizarPedido()
// ============================================================
public class PedidoRequest {

    private Long usuarioId;
    private Double total;
    private String estado;
    private java.util.List<ItemRequest> items;

    public PedidoRequest() {}

    public Long getUsuarioId() { return usuarioId; }
    public void setUsuarioId(Long usuarioId) { this.usuarioId = usuarioId; }
    public Double getTotal() { return total; }
    public void setTotal(Double total) { this.total = total; }
    public String getEstado() { return estado; }
    public void setEstado(String estado) { this.estado = estado; }
    public java.util.List<ItemRequest> getItems() { return items; }
    public void setItems(java.util.List<ItemRequest> items) { this.items = items; }

    // ── Item anidado ──────────────────────────────────────────
    public static class ItemRequest {
        private Long productoId;
        private Integer cantidad;
        private Double precio;

        public Long getProductoId() { return productoId; }
        public void setProductoId(Long productoId) { this.productoId = productoId; }
        public Integer getCantidad() { return cantidad; }
        public void setCantidad(Integer cantidad) { this.cantidad = cantidad; }
        public Double getPrecio() { return precio; }
        public void setPrecio(Double precio) { this.precio = precio; }
    }
}
