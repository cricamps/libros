package com.duoc.gestion.controller;

import com.duoc.gestion.model.Producto;
import com.duoc.gestion.service.GestionService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * ============================================================
 * CONTROLADOR REST: GestionProductoController
 * ============================================================
 * Endpoints de gestion de productos (solo ADMIN).
 *
 * Base URL: /api/gestion/productos  (puerto 8082)
 *
 * Endpoints:
 *   GET    /api/gestion/productos              -> Listar todos
 *   GET    /api/gestion/productos/{id}         -> Obtener por ID
 *   GET    /api/gestion/productos/categoria/{c}-> Filtrar por categoria
 *   POST   /api/gestion/productos              -> Agregar nuevo
 *   PUT    /api/gestion/productos/{id}         -> Modificar existente
 *   DELETE /api/gestion/productos/{id}         -> Eliminar
 *   PATCH  /api/gestion/productos/{id}/disponible -> Cambiar disponibilidad
 *
 * Patron Singleton: GestionService es inyectado como bean unico.
 * ============================================================
 */
@RestController
@RequestMapping("/gestion/productos")
public class GestionProductoController {

    private final GestionService gestionService;

    public GestionProductoController(GestionService gestionService) {
        this.gestionService = gestionService;
    }

    // ── GET /api/gestion/productos ───────────────────────────
    @GetMapping
    public ResponseEntity<List<Producto>> listar() {
        return ResponseEntity.ok(gestionService.obtenerTodos());
    }

    // ── GET /api/gestion/productos/{id} ─────────────────────
    @GetMapping("/{id}")
    public ResponseEntity<Producto> obtener(@PathVariable Long id) {
        return gestionService.obtenerPorId(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // ── GET /api/gestion/productos/categoria/{categoria} ────
    @GetMapping("/categoria/{categoria}")
    public ResponseEntity<List<Producto>> porCategoria(@PathVariable String categoria) {
        return ResponseEntity.ok(gestionService.obtenerPorCategoria(categoria));
    }

    // ── POST /api/gestion/productos ─────────────────────────
    // Agrega un nuevo producto al catalogo (solo ADMIN)
    @PostMapping
    public ResponseEntity<Producto> agregar(@Valid @RequestBody Producto producto) {
        Producto creado = gestionService.agregar(producto);
        return ResponseEntity.status(HttpStatus.CREATED).body(creado);
    }

    // ── PUT /api/gestion/productos/{id} ─────────────────────
    // Modifica un producto existente (precio, stock, descripcion, etc.)
    @PutMapping("/{id}")
    public ResponseEntity<Producto> modificar(@PathVariable Long id,
                                               @Valid @RequestBody Producto producto) {
        return gestionService.modificar(id, producto)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // ── DELETE /api/gestion/productos/{id} ──────────────────
    // Elimina un producto del catalogo
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminar(@PathVariable Long id) {
        if (gestionService.eliminar(id)) {
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.notFound().build();
    }

    // ── PATCH /api/gestion/productos/{id}/disponible ────────
    // Activa o desactiva la disponibilidad de un producto
    @PatchMapping("/{id}/disponible")
    public ResponseEntity<Producto> cambiarDisponibilidad(
            @PathVariable Long id,
            @RequestParam boolean valor) {
        return gestionService.cambiarDisponibilidad(id, valor)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
}
