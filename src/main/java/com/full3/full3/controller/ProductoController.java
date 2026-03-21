package com.full3.full3.controller;

// Importa la clase Producto del modelo
import com.full3.full3.model.Producto;

// Importa el servicio de productos con la lógica de negocio
import com.full3.full3.service.ProductoService;

// Importa las clases de Spring para construir respuestas HTTP
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

// Importa las anotaciones de Spring para construir la API REST
import org.springframework.web.bind.annotation.*;

// Importa Jakarta Validation para validar el body recibido
import jakarta.validation.Valid;

// Importa List para devolver listas de productos
import java.util.List;

// Marca esta clase como un controlador REST.
// Spring convertirá automáticamente los objetos Java a JSON.
@RestController

// Define la ruta base de este controlador.
// Todos los endpoints de productos comenzarán con /api/productos
@RequestMapping("/productos")
public class ProductoController {

    // Referencia al servicio de productos
    private final ProductoService productoService;

    // Constructor con inyección de dependencias.
    // Spring Boot entrega automáticamente una instancia de ProductoService.
    public ProductoController(ProductoService productoService) {
        this.productoService = productoService;
    }

    // ==========================================================
    // LISTAR TODOS LOS PRODUCTOS
    // GET /api/productos
    // ==========================================================

    // Devuelve el catálogo completo de productos de la tienda.
    // Respuesta: 200 OK con arreglo JSON de productos.
    @GetMapping
    public List<Producto> obtenerProductos() {

        // Delega al servicio para obtener todos los productos
        return productoService.obtenerTodos();
    }

    // ==========================================================
    // BUSCAR UN PRODUCTO POR ID
    // GET /api/productos/{id}
    // ==========================================================

    // Busca un producto específico por su clave primaria.
    // Respuesta: 200 OK si existe, 404 Not Found si no existe.
    @GetMapping("/{id}")
    public ResponseEntity<Producto> obtenerProducto(@PathVariable Long id) {

        // Busca el producto y responde según si existe o no
        return productoService.obtenerPorId(id)
                .map(producto -> ResponseEntity.ok(producto))
                .orElse(ResponseEntity.notFound().build());
    }

    // ==========================================================
    // CREAR UN NUEVO PRODUCTO
    // POST /api/productos
    // ==========================================================

    // Agrega un nuevo producto al catálogo de la tienda.
    // Solo usuarios con rol ADMIN deberían usar este endpoint.
    // @Valid activa las validaciones del body (@NotBlank, @Positive, etc.)
    // Respuesta: 201 Created con el producto creado.
    @PostMapping
    public ResponseEntity<Producto> crearProducto(@Valid @RequestBody Producto producto) {

        // Guarda el producto y retorna 201 Created
        Producto creado = productoService.guardar(producto);
        return ResponseEntity.status(HttpStatus.CREATED).body(creado);
    }

    // ==========================================================
    // ACTUALIZAR UN PRODUCTO EXISTENTE
    // PUT /api/productos/{id}
    // ==========================================================

    // Modifica los datos de un producto identificado por su id.
    // Útil para actualizar precio, stock o descripción.
    // Respuesta: 200 OK si existe, 404 Not Found si no existe.
    @PutMapping("/{id}")
    public ResponseEntity<Producto> actualizarProducto(@PathVariable Long id,
                                                        @Valid @RequestBody Producto producto) {

        // Delega la actualización al servicio
        return productoService.actualizar(id, producto)
                .map(actualizado -> ResponseEntity.ok(actualizado))
                .orElse(ResponseEntity.notFound().build());
    }

    // ==========================================================
    // ELIMINAR UN PRODUCTO POR ID
    // DELETE /api/productos/{id}
    // ==========================================================

    // Elimina un producto del catálogo.
    // Respuesta: 204 No Content si fue eliminado, 404 Not Found si no existía.
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminarProducto(@PathVariable Long id) {

        // Intenta eliminar y responde según el resultado
        if (productoService.eliminar(id)) {
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.notFound().build();
    }
}
