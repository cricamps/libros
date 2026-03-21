package com.full3.full3.service;

// Importa las clases del modelo y del repository
import com.full3.full3.model.Producto;
import com.full3.full3.repository.ProductoRepository;

// Marca esta clase como un componente de servicio de Spring
import org.springframework.stereotype.Service;

// Importa List y Optional para los tipos de retorno
import java.util.List;
import java.util.Optional;

// Indica que esta clase pertenece a la capa de servicio.
// Aquí se ubica la lógica de negocio del microservicio de productos.
@Service
@SuppressWarnings("all")
public class ProductoService {

    // Referencia al repository de productos.
    // Permite acceder a las operaciones de base de datos.
    private final ProductoRepository productoRepository;

    // Constructor con inyección de dependencias.
    // Spring Boot entrega automáticamente una instancia de ProductoRepository.
    public ProductoService(ProductoRepository productoRepository) {
        this.productoRepository = productoRepository;
    }

    // ==========================================================
    // OBTENER TODOS LOS PRODUCTOS
    // ==========================================================

    // Devuelve la lista completa de productos registrados en la tienda.
    // Usado en el endpoint: GET /api/productos
    public List<Producto> obtenerTodos() {

        // findAll() recupera todos los registros de la tabla PRODUCTOS
        return productoRepository.findAll();
    }

    // ==========================================================
    // OBTENER UN PRODUCTO POR ID
    // ==========================================================

    // Busca un producto específico por su clave primaria.
    // Devuelve Optional porque el producto puede no existir.
    // Usado en: GET /api/productos/{id}
    public Optional<Producto> obtenerPorId(Long id) {

        // findById() retorna Optional con el producto o vacío si no existe
        return productoRepository.findById(id);
    }

    // ==========================================================
    // CREAR UN NUEVO PRODUCTO
    // ==========================================================

    // Guarda un nuevo producto en la base de datos.
    // Sólo los usuarios con rol ADMIN pueden usar este endpoint.
    // Usado en: POST /api/productos
    public Producto guardar(Producto producto) {

        // save() con id=null inserta un nuevo registro en PRODUCTOS
        return productoRepository.save(producto);
    }

    // ==========================================================
    // ACTUALIZAR UN PRODUCTO EXISTENTE
    // ==========================================================

    // Modifica los datos de un producto existente buscándolo por id.
    // Si no existe, devuelve Optional vacío.
    // Usado en: PUT /api/productos/{id}
    public Optional<Producto> actualizar(Long id, Producto productoActualizado) {

        // Busca el producto actual. Si existe, actualiza sus campos.
        return productoRepository.findById(id).map(producto -> {

            // Actualiza cada campo con los nuevos valores recibidos
            producto.setNombre(productoActualizado.getNombre());
            producto.setDescripcion(productoActualizado.getDescripcion());
            producto.setPrecio(productoActualizado.getPrecio());
            producto.setStock(productoActualizado.getStock());
            producto.setCategoria(productoActualizado.getCategoria());

            // Guarda y retorna el producto modificado
            return productoRepository.save(producto);
        });
    }

    // ==========================================================
    // ELIMINAR UN PRODUCTO POR ID
    // ==========================================================

    // Elimina un producto usando su id.
    // Retorna true si fue eliminado, false si no existía.
    // Usado en: DELETE /api/productos/{id}
    public boolean eliminar(Long id) {

        // Verifica si el producto existe antes de eliminar
        if (productoRepository.existsById(id)) {

            // Elimina el registro de la base de datos
            productoRepository.deleteById(id);

            // Indica que la eliminación fue exitosa
            return true;
        }

        // El producto no existía, retorna false
        return false;
    }
}
