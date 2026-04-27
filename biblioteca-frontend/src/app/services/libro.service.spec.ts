// ============================================================
// TEST: LibroService
// Pruebas unitarias del servicio Facade que gestiona la API
// de libros. Usa HttpClientTestingModule para simular HTTP.
// ============================================================
import { TestBed } from '@angular/core/testing';
import {
  HttpClientTestingModule,
  HttpTestingController
} from '@angular/common/http/testing';

import { LibroService } from './libro.service';
import { Libro } from '../models/libro.model';

describe('LibroService', () => {
  let service: LibroService;
  let httpMock: HttpTestingController;

  const API_URL = 'http://localhost:8082/api/libros';

  const libroMock: Libro = {
    id: 1,
    titulo: 'El Quijote',
    autor: 'Cervantes',
    anioPublicacion: 1605,
    genero: 'Novela'
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [LibroService]
    });
    service = TestBed.inject(LibroService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify(); // verifica que no queden requests pendientes
  });

  // ──────────────────────────────────────────────────────────
  // Instancia del servicio
  // ──────────────────────────────────────────────────────────
  it('debería crearse correctamente (Singleton)', () => {
    expect(service).toBeTruthy();
  });

  // ──────────────────────────────────────────────────────────
  // obtenerTodos()
  // ──────────────────────────────────────────────────────────
  it('obtenerTodos() debería retornar un arreglo de libros', () => {
    const librosMock: Libro[] = [libroMock, { ...libroMock, id: 2, titulo: '1984' }];

    service.obtenerTodos().subscribe(libros => {
      expect(libros.length).toBe(2);
      expect(libros[0].titulo).toBe('El Quijote');
    });

    const req = httpMock.expectOne(API_URL);
    expect(req.request.method).toBe('GET');
    req.flush(librosMock);
  });

  it('obtenerTodos() debería manejar error de conexión (status 0)', () => {
    service.obtenerTodos().subscribe({
      next: () => fail('Debería haber fallado'),
      error: (err: Error) => {
        expect(err.message).toContain('No se puede conectar al servidor');
      }
    });

    const req = httpMock.expectOne(API_URL);
    req.error(new ProgressEvent('error'), { status: 0 });
  });

  // ──────────────────────────────────────────────────────────
  // obtenerPorId()
  // ──────────────────────────────────────────────────────────
  it('obtenerPorId() debería retornar un libro por ID', () => {
    service.obtenerPorId(1).subscribe(libro => {
      expect(libro.id).toBe(1);
      expect(libro.titulo).toBe('El Quijote');
    });

    const req = httpMock.expectOne(`${API_URL}/1`);
    expect(req.request.method).toBe('GET');
    req.flush(libroMock);
  });

  it('obtenerPorId() debería manejar error 404', () => {
    service.obtenerPorId(999).subscribe({
      next: () => fail('Debería haber fallado'),
      error: (err: Error) => {
        expect(err.message).toContain('no fue encontrado');
      }
    });

    const req = httpMock.expectOne(`${API_URL}/999`);
    req.flush('Not found', { status: 404, statusText: 'Not Found' });
  });

  // ──────────────────────────────────────────────────────────
  // crear()
  // ──────────────────────────────────────────────────────────
  it('crear() debería enviar POST y retornar el libro creado', () => {
    const nuevoLibro: Libro = { titulo: 'Nuevo', autor: 'Autor', anioPublicacion: 2020, genero: 'Drama' };

    service.crear(nuevoLibro).subscribe(libro => {
      expect(libro.id).toBe(10);
      expect(libro.titulo).toBe('Nuevo');
    });

    const req = httpMock.expectOne(API_URL);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(nuevoLibro);
    req.flush({ ...nuevoLibro, id: 10 });
  });

  it('crear() debería manejar error 400', () => {
    const nuevoLibro: Libro = { titulo: '', autor: '', anioPublicacion: 0, genero: '' };

    service.crear(nuevoLibro).subscribe({
      next: () => fail('Debería haber fallado'),
      error: (err: Error) => {
        expect(err.message).toContain('Datos inválidos');
      }
    });

    const req = httpMock.expectOne(API_URL);
    req.flush('Bad Request', { status: 400, statusText: 'Bad Request' });
  });

  // ──────────────────────────────────────────────────────────
  // actualizar()
  // ──────────────────────────────────────────────────────────
  it('actualizar() debería enviar PUT y retornar el libro actualizado', () => {
    const libroActualizado: Libro = { ...libroMock, titulo: 'Quijote Actualizado' };

    service.actualizar(1, libroActualizado).subscribe(libro => {
      expect(libro.titulo).toBe('Quijote Actualizado');
    });

    const req = httpMock.expectOne(`${API_URL}/1`);
    expect(req.request.method).toBe('PUT');
    req.flush(libroActualizado);
  });

  it('actualizar() debería manejar error 500', () => {
    service.actualizar(1, libroMock).subscribe({
      next: () => fail('Debería haber fallado'),
      error: (err: Error) => {
        expect(err.message).toContain('Error interno del servidor');
      }
    });

    const req = httpMock.expectOne(`${API_URL}/1`);
    req.flush('Server Error', { status: 500, statusText: 'Internal Server Error' });
  });

  // ──────────────────────────────────────────────────────────
  // eliminar()
  // ──────────────────────────────────────────────────────────
  it('eliminar() debería enviar DELETE', () => {
    service.eliminar(1).subscribe({
      next: () => {
        // DELETE exitoso: el observable void completa sin valor
        expect(true).toBeTrue();
      }
    });

    const req = httpMock.expectOne(`${API_URL}/1`);
    expect(req.request.method).toBe('DELETE');
    req.flush(null, { status: 204, statusText: 'No Content' });
  });

  it('eliminar() debería manejar error 404', () => {
    service.eliminar(999).subscribe({
      next: () => fail('Debería haber fallado'),
      error: (err: Error) => {
        expect(err.message).toContain('no fue encontrado');
      }
    });

    const req = httpMock.expectOne(`${API_URL}/999`);
    req.flush('Not found', { status: 404, statusText: 'Not Found' });
  });
});
