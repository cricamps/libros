package com.duoc.gestion.factory;

import com.duoc.gestion.model.Producto;
import org.springframework.stereotype.Component;

// ============================================================
// PATRON FACTORY - ProductoFactory
// Centraliza la creacion de instancias de Producto (bean Spring).
// Aplica valores por defecto y calcula disponibilidad segun stock.
// ============================================================
@Component
public class ProductoFactory {

    // Crea un Producto nuevo con disponibilidad calculada segun stock
    public Producto crear(String nombre, String descripcion,
                          Double precio, Integer stock, String categoria) {
        Producto p = new Producto();
        p.setNombre(nombre);
        p.setDescripcion(descripcion);
        p.setPrecio(precio);
        p.setStock(stock != null ? stock : 0);
        p.setCategoria(categoria);
        p.setDisponible(stock != null && stock > 0);
        return p;
    }
}
