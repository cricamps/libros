package com.duoc.s4.factory;

import com.duoc.s4.model.Libro;
import org.springframework.stereotype.Component;

/**
 * ============================================================
 * PATRÓN DE DISEÑO: FACTORY (Fábrica)
 * ============================================================
 * Clase: LibroFactory
 *
 * DESCRIPCIÓN DEL PATRÓN:
 * El patrón Factory define una interfaz para crear objetos,
 * delegando la responsabilidad de instanciación a un componente
 * especializado. Esto permite que el resto de la aplicación
 * no necesite conocer los detalles de construcción del objeto.
 *
 * APLICACIÓN EN ESTE MICROSERVICIO:
 * LibroFactory centraliza la creación de instancias de Libro.
 * En lugar de que el controlador o el servicio hagan "new Libro(...)"
 * directamente, toda construcción pasa por esta fábrica.
 *
 * VENTAJAS:
 *  - Centraliza la lógica de creación de objetos Libro.
 *  - Facilita cambios futuros en la construcción sin modificar
 *    el controlador ni el servicio.
 *  - Permite agregar validaciones o lógica de negocio en la
 *    construcción sin dispersar código.
 *  - Mejora la testeabilidad al tener un único punto de creación.
 *
 * FLUJO DE USO:
 *  Controller → LibroFactory.crearLibro(...) → Libro
 *  Controller → LibroFactory.actualizarLibro(...) → Libro
 * ============================================================
 */
@Component
public class LibroFactory {

    /**
     * Crea un nuevo objeto Libro listo para ser persistido.
     *
     * El id se deja en null para que Oracle lo genere
     * automáticamente con IDENTITY al hacer el INSERT.
     *
     * @param titulo          Título del libro (requerido)
     * @param autor           Autor del libro (requerido)
     * @param anioPublicacion Año de publicación (>=0)
     * @param genero          Género literario (requerido)
     * @return Nueva instancia de Libro sin id asignado
     */
    public Libro crearLibro(String titulo, String autor,
                            Integer anioPublicacion, String genero) {
        // La fábrica construye el objeto con los datos proporcionados.
        // El id es null porque lo asigna Oracle al insertar.
        return new Libro(null, titulo, autor, anioPublicacion, genero);
    }

    /**
     * Crea una copia de un Libro existente con datos actualizados.
     *
     * Se usa en el endpoint PUT para preparar el objeto con los
     * nuevos valores antes de persistirlo en Oracle.
     *
     * @param id              Id del libro existente (se preserva)
     * @param titulo          Nuevo título
     * @param autor           Nuevo autor
     * @param anioPublicacion Nuevo año de publicación
     * @param genero          Nuevo género literario
     * @return Instancia de Libro con el id original y datos actualizados
     */
    public Libro actualizarLibro(Long id, String titulo, String autor,
                                 Integer anioPublicacion, String genero) {
        // Se preserva el id original para que JPA ejecute un UPDATE
        // en lugar de un INSERT al llamar a repository.save().
        return new Libro(id, titulo, autor, anioPublicacion, genero);
    }
}
