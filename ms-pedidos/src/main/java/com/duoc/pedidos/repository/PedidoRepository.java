package com.duoc.pedidos.repository;

import com.duoc.pedidos.model.Pedido;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

// ============================================================
// REPOSITORY: PedidoRepository
// Acceso a la tabla PEDIDOS en Oracle Cloud
// ============================================================
public interface PedidoRepository extends JpaRepository<Pedido, Long> {

    // Buscar todos los pedidos de un usuario específico
    List<Pedido> findByUsuarioIdOrderByFechaDesc(Long usuarioId);
}
