package com.duoc.gestion.model;

/**
 * ============================================================
 * PATRON FACTORY: ProductoFactory
 * Centraliza la creacion de instancias de Producto.
 * Aplica valores por defecto y validaciones de negocio.
 * ============================================================
 */
public class ProductoFactory {

    // Constructor privado: clase de utilidad, no instanciable
    private ProductoFactory() {}

    /**
     * Crea un nuevo Producto con valores por defecto.
     * Stock inicial = 0, disponible = false hasta que se agregue stock.
     */
    public static Producto crearNuevo(String nombre, String descripcion,
                                       Double precio, Integer stock,
                                       String categoria) {
        Producto p = new Producto();
        p.setNombre(nombre);
        p.setDescripcion(descripcion);
        p.setPrecio(precio);
        p.setStock(stock != null ? stock : 0);
        p.setCategoria(categoria);
        p.setDisponible(stock != null && stock > 0);
        return p;
    }

    /**
     * Clona un producto existente para actualizacion.
     * Mantiene el id original.
     */
    public static Producto clonarConCambios(Producto original, Producto cambios) {
        original.setNombre(cambios.getNombre() != null ? cambios.getNombre() : original.getNombre());
        original.setDescripcion(cambios.getDescripcion() != null ? cambios.getDescripcion() : original.getDescripcion());
        original.setPrecio(cambios.getPrecio() != null ? cambios.getPrecio() : original.getPrecio());
        original.setStock(cambios.getStock() != null ? cambios.getStock() : original.getStock());
        original.setCategoria(cambios.getCategoria() != null ? cambios.getCategoria() : original.getCategoria());
        if (cambios.getDisponible() != null) {
            original.setDisponible(cambios.getDisponible());
        }
        return original;
    }
}
