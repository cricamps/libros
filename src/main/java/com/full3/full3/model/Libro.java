package com.full3.full3.model;

// Importa las anotaciones de JPA para mapear la clase a una tabla
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

// Importa anotaciones de validación para controlar datos obligatorios
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.PositiveOrZero;

// Indica que esta clase representa una entidad de base de datos
@Entity

// Indica el nombre exacto de la tabla en Oracle
@Table(name = "LIBROS")
public class Libro {

    // Indica que este atributo es la clave primaria
    @Id

    // Indica que el valor será generado automáticamente
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Valida que el título no venga vacío ni en blanco
    @NotBlank(message = "El título es obligatorio")

    // Mapea este atributo a la columna TITULO
    @Column(name = "TITULO", nullable = false, length = 200)
    private String titulo;

    // Valida que el autor no venga vacío ni en blanco
    @NotBlank(message = "El autor es obligatorio")

    // Mapea este atributo a la columna AUTOR
    @Column(name = "AUTOR", nullable = false, length = 200)
    private String autor;

    // Valida que el año sea cero o positivo
    @PositiveOrZero(message = "El año de publicación debe ser mayor o igual a 0")

    // Mapea este atributo Java a la columna ANIO_PUBLICACION de Oracle
    @Column(name = "ANIO_PUBLICACION")
    private Integer anioPublicacion;

    // Valida que el género no venga vacío ni en blanco
    @NotBlank(message = "El género es obligatorio")

    // Mapea este atributo a la columna GENERO
    @Column(name = "GENERO", length = 100)
    private String genero;

    // Constructor vacío obligatorio para JPA
    public Libro() {
    }

    // Constructor con parámetros para facilitar creación de objetos
    public Libro(Long id, String titulo, String autor, Integer anioPublicacion, String genero) {
        this.id = id;
        this.titulo = titulo;
        this.autor = autor;
        this.anioPublicacion = anioPublicacion;
        this.genero = genero;
    }

    // Devuelve el id del libro
    public Long getId() {
        return id;
    }

    // Asigna el id del libro
    public void setId(Long id) {
        this.id = id;
    }

    // Devuelve el título del libro
    public String getTitulo() {
        return titulo;
    }

    // Asigna el título del libro
    public void setTitulo(String titulo) {
        this.titulo = titulo;
    }

    // Devuelve el autor del libro
    public String getAutor() {
        return autor;
    }

    // Asigna el autor del libro
    public void setAutor(String autor) {
        this.autor = autor;
    }

    // Devuelve el año de publicación del libro
    public Integer getAnioPublicacion() {
        return anioPublicacion;
    }

    // Asigna el año de publicación del libro
    public void setAnioPublicacion(Integer anioPublicacion) {
        this.anioPublicacion = anioPublicacion;
    }

    // Devuelve el género del libro
    public String getGenero() {
        return genero;
    }

    // Asigna el género del libro
    public void setGenero(String genero) {
        this.genero = genero;
    }
}
