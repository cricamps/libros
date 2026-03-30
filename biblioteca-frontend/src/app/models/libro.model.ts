// ============================================================
// MODELO: Libro
// Representa la estructura de datos de un libro.
// Corresponde a la capa "Modelo" del patrón MVC.
// ============================================================

export interface Libro {
  // Identificador único generado por la base de datos Oracle
  id?: number;

  // Título del libro (obligatorio)
  titulo: string;

  // Autor del libro (obligatorio)
  autor: string;

  // Año de publicación del libro
  anioPublicacion: number;

  // Género literario del libro (obligatorio)
  genero: string;
}
