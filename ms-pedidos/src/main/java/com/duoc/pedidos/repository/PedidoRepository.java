package com.duoc.pedidos.repository;

import com.duoc.pedidos.model.Pedido;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * ============================================================
 * REPOSITORIO: PedidoRepository
 * Acceso JPA a la tabla PEDIDOS de Oracle Cloud.
 * ============================================================
 */
@Repository
public interface PedidoRepository extends JpaRepository<Pedido, Long> {

    // Historial de pedidos por usuario
    List<Pedido> findByUsuarioIdOrderByFechaDesc(Long usuarioId);

    // Pedidos por estado (ADMIN)
    List<Pedido> findByEstadoOrderByFechaDesc(String estado);
}
