// ============================================================
// SERVICIO: LibroService
//
// Patrón Facade: actúa como capa de abstracción sobre HttpClient,
//   exponiendo métodos simples al resto de la aplicación.
//
// Patrón Singleton: al usar providedIn: 'root', Angular garantiza
//   una sola instancia del servicio en toda la aplicación.
//
// Patrón Observer: todos los métodos retornan Observables de RxJS,
//   lo que permite reaccionar de forma reactiva a los datos.
// ============================================================

import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Libro } from '../models/libro.model';

@Injectable({
  // Singleton: una sola instancia compartida en toda la app
  providedIn: 'root'
})
export class LibroService {

  // URL base del microservicio Spring Boot que corre localmente
  // Puerto 8081 con context-path /api según application.properties
  private readonly apiUrl = 'http://localhost:8081/api/libros';

  // Inyección de dependencias: Angular entrega HttpClient automáticamente
  constructor(private http: HttpClient) {}

  // ==========================================================
  // GET /api/libros
  // Obtiene todos los libros registrados en la base de datos
  // ==========================================================
  obtenerTodos(): Observable<Libro[]> {
    return this.http.get<Libro[]>(this.apiUrl).pipe(
      catchError(this.manejarError)
    );
  }

  // ==========================================================
  // GET /api/libros/:id
  // Obtiene un libro específico por su ID
  // ==========================================================
  obtenerPorId(id: number): Observable<Libro> {
    return this.http.get<Libro>(`${this.apiUrl}/${id}`).pipe(
      catchError(this.manejarError)
    );
  }

  // ==========================================================
  // POST /api/libros
  // Crea un nuevo libro en la base de datos
  // ==========================================================
  crear(libro: Libro): Observable<Libro> {
    return this.http.post<Libro>(this.apiUrl, libro).pipe(
      catchError(this.manejarError)
    );
  }

  // ==========================================================
  // PUT /api/libros/:id
  // Actualiza los datos de un libro existente
  // ==========================================================
  actualizar(id: number, libro: Libro): Observable<Libro> {
    return this.http.put<Libro>(`${this.apiUrl}/${id}`, libro).pipe(
      catchError(this.manejarError)
    );
  }

  // ==========================================================
  // DELETE /api/libros/:id
  // Elimina un libro de la base de datos por su ID
  // ==========================================================
  eliminar(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`).pipe(
      catchError(this.manejarError)
    );
  }

  // ==========================================================
  // Manejo centralizado de errores HTTP
  // ==========================================================
  private manejarError(error: HttpErrorResponse): Observable<never> {
    let mensaje = 'Ocurrió un error inesperado.';

    if (error.status === 0) {
      mensaje = 'No se puede conectar al servidor. Asegúrate de que el microservicio esté corriendo en http://localhost:8081';
    } else if (error.status === 404) {
      mensaje = 'El libro solicitado no fue encontrado.';
    } else if (error.status === 400) {
      mensaje = 'Datos inválidos. Revisa los campos del formulario.';
    } else if (error.status >= 500) {
      mensaje = 'Error interno del servidor. Inténtalo más tarde.';
    }

    return throwError(() => new Error(mensaje));
  }
}
