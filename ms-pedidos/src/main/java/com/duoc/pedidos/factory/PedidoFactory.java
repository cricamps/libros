package com.duoc.pedidos.factory;

import com.duoc.pedidos.model.Pedido;
import org.springframework.stereotype.Component;

import java.time.LocalDate;

// ============================================================
// PATRÓN FACTORY – PedidoFactory
// Centraliza la creación de objetos Pedido.
// Garantiza que ESTADO y FECHA se inicialicen correctamente.
// ============================================================
@Component
public class PedidoFactory {

    // Crea un pedido nuevo con estado PENDIENTE y fecha actual
    public Pedido crear(Long usuarioId, Double total) {
        Pedido p = new Pedido();
        p.setUsuarioId(usuarioId);
        p.setTotal(total);
        p.setEstado("PENDIENTE");
        p.setFecha(LocalDate.now());
        return p;
    }
}
