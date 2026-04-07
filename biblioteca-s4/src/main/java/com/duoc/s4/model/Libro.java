package com.duoc.s4.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.PositiveOrZero;

/**
 * ============================================================
 * ENTIDAD Libro - Capa de Modelo
 * ============================================================
 * Mapea la tabla LIBROS de Oracle Cloud.
 * Contiene los atributos id, titulo, autor, anioPublicacion
 * y genero, con validaciones de Jakarta Validation.
 *
 * Nota sobre patrones:
 * Los objetos Libro son creados a través de LibroFactory
 * (patrón Factory), garantizando que la construcción siempre
 * pase por un punto centralizado de validación de datos.
 * ============================================================
 */
@Entity
@Table(name = "LIBROS")
public class Libro {

    // Clave primaria generada automáticamente por Oracle
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Título del libro - obligatorio, máximo 200 caracteres
    @NotBlank(message = "El título es obligatorio")
    @Column(name = "TITULO", nullable = false, length = 200)
    private String titulo;

    // Autor del libro - obligatorio, máximo 200 caracteres
    @NotBlank(message = "El autor es obligatorio")
    @Column(name = "AUTOR", nullable = false, length = 200)
    private String autor;

    // Año de publicación - debe ser cero o positivo
    @PositiveOrZero(message = "El año de publicación debe ser mayor o igual a 0")
    @Column(name = "ANIO_PUBLICACION")
    private Integer anioPublicacion;

    // Género literario - obligatorio, máximo 100 caracteres
    @NotBlank(message = "El género es obligatorio")
    @Column(name = "GENERO", length = 100)
    private String genero;

    // Constructor vacío requerido por JPA
    public Libro() {}

    // Constructor completo usado por LibroFactory
    public Libro(Long id, String titulo, String autor,
                 Integer anioPublicacion, String genero) {
        this.id = id;
        this.titulo = titulo;
        this.autor = autor;
        this.anioPublicacion = anioPublicacion;
        this.genero = genero;
    }

    // Getters y Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getTitulo() { return titulo; }
    public void setTitulo(String titulo) { this.titulo = titulo; }

    public String getAutor() { return autor; }
    public void setAutor(String autor) { this.autor = autor; }

    public Integer getAnioPublicacion() { return anioPublicacion; }
    public void setAnioPublicacion(Integer anioPublicacion) {
        this.anioPublicacion = anioPublicacion;
    }

    public String getGenero() { return genero; }
    public void setGenero(String genero) { this.genero = genero; }
}
