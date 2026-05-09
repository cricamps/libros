package com.duoc.gestion.factory;

import com.duoc.gestion.model.Producto;
import org.springframework.stereotype.Component;

// ============================================================
// PATRÓN FACTORY – ProductoFactory
// Centraliza la creación de objetos Producto con valores seguros.
// Asegura que DISPONIBLE se calcule automáticamente según el stock.
// ============================================================
@Component
public class ProductoFactory {

    public Producto crear(String nombre, String descripcion, Double precio, Integer stock, String categoria) {
        Producto p = new Producto();
        p.setNombre(nombre);
        p.setDescripcion(descripcion);
        p.setPrecio(precio);
        p.setStock(stock);
        p.setCategoria(categoria);
        p.setDisponible(stock > 0 ? 1 : 0);
        return p;
    }
}
