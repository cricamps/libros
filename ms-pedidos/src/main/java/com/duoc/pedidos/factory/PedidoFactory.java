package com.duoc.pedidos.factory;

import com.duoc.pedidos.model.Pedido;
import org.springframework.stereotype.Component;
import java.time.LocalDate;

/**
 * ============================================================
 * PATRÓN DE DISEÑO: FACTORY
 * ============================================================
 * Clase: PedidoFactory
 *
 * Centraliza la creación de instancias Pedido.
 * El controlador y el servicio nunca hacen "new Pedido(...)"
 * directamente — siempre delegan a esta fábrica.
 *
 * VENTAJAS:
 *  - Centraliza lógica de construcción (fecha automática, total)
 *  - Facilita cambios sin tocar controlador/servicio
 *  - Un único punto de creación de Pedido
 * ============================================================
 */
@Component
public class PedidoFactory {

    /**
     * Crea un nuevo Pedido listo para persistir.
     * El id es null → Oracle lo genera con IDENTITY.
     * La fecha se asigna automáticamente al día actual.
     * El total se calcula: precioUnitario × cantidad.
     */
    public Pedido crearPedido(Long usuarioId, Long productoId, String nombreProducto,
                              Integer cantidad, Double precioUnitario) {
        double total = precioUnitario * cantidad;
        String fecha = LocalDate.now().toString();
        return new Pedido(null, usuarioId, productoId, nombreProducto,
                          cantidad, precioUnitario, total, "PENDIENTE", fecha);
    }

    /**
     * Crea una copia de Pedido con estado actualizado.
     * Usado en el endpoint PUT /pedidos/{id}/estado.
     */
    public Pedido actualizarEstado(Pedido pedidoExistente, String nuevoEstado) {
        return new Pedido(
            pedidoExistente.getId(),
            pedidoExistente.getUsuarioId(),
            pedidoExistente.getProductoId(),
            pedidoExistente.getNombreProducto(),
            pedidoExistente.getCantidad(),
            pedidoExistente.getPrecioUnitario(),
            pedidoExistente.getTotal(),
            nuevoEstado,
            pedidoExistente.getFecha()
        );
    }
}
