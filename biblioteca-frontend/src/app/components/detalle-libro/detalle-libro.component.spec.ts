// ============================================================
// TEST: DetalleLibroComponent
// Pruebas del componente que muestra el detalle de un libro.
// ============================================================
import { TestBed, ComponentFixture } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { ActivatedRoute } from '@angular/router';
import { of, throwError } from 'rxjs';

import { DetalleLibroComponent } from './detalle-libro.component';
import { LibroService } from '../../services/libro.service';
import { Libro } from '../../models/libro.model';

describe('DetalleLibroComponent', () => {
  let component: DetalleLibroComponent;
  let fixture: ComponentFixture<DetalleLibroComponent>;
  let libroServiceSpy: jasmine.SpyObj<LibroService>;

  const libroMock: Libro = {
    id: 1,
    titulo: 'El Quijote',
    autor: 'Cervantes',
    anioPublicacion: 1605,
    genero: 'Novela'
  };

  function crearComponente(idParam: string) {
    const spy = jasmine.createSpyObj('LibroService', ['obtenerPorId', 'eliminar']);

    TestBed.configureTestingModule({
      imports: [DetalleLibroComponent, RouterTestingModule],
      providers: [
        { provide: LibroService, useValue: spy },
        {
          provide: ActivatedRoute,
          useValue: { snapshot: { paramMap: { get: () => idParam } } }
        }
      ]
    });

    libroServiceSpy = TestBed.inject(LibroService) as jasmine.SpyObj<LibroService>;
    libroServiceSpy.obtenerPorId.and.returnValue(of(libroMock));
    libroServiceSpy.eliminar.and.returnValue(of(undefined));

    fixture = TestBed.createComponent(DetalleLibroComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }

  afterEach(() => TestBed.resetTestingModule());

  // ──────────────────────────────────────────────────────────
  // Creación y carga
  // ──────────────────────────────────────────────────────────
  it('debería crearse correctamente', () => {
    crearComponente('1');
    expect(component).toBeTruthy();
  });

  it('debería cargar el libro correctamente cuando el ID es válido', () => {
    crearComponente('1');
    expect(libroServiceSpy.obtenerPorId).toHaveBeenCalledWith(1);
    expect(component.libro).toEqual(libroMock);
    expect(component.cargando).toBeFalse();
  });

  it('debería mostrar error si el ID es inválido', () => {
    crearComponente('abc');
    expect(component.error).toBe('ID de libro inválido.');
    expect(libroServiceSpy.obtenerPorId).not.toHaveBeenCalled();
  });

  it('debería mostrar error si el ID es 0', () => {
    crearComponente('0');
    expect(component.error).toBe('ID de libro inválido.');
  });

  it('debería manejar error del servicio al cargar', () => {
    const spy = jasmine.createSpyObj('LibroService', ['obtenerPorId', 'eliminar']);
    spy.obtenerPorId.and.returnValue(throwError(() => new Error('no fue encontrado')));

    TestBed.configureTestingModule({
      imports: [DetalleLibroComponent, RouterTestingModule],
      providers: [
        { provide: LibroService, useValue: spy },
        {
          provide: ActivatedRoute,
          useValue: { snapshot: { paramMap: { get: () => '999' } } }
        }
      ]
    });

    fixture = TestBed.createComponent(DetalleLibroComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    expect(component.error).toContain('no fue encontrado');
  });

  // ──────────────────────────────────────────────────────────
  // Navegación
  // ──────────────────────────────────────────────────────────
  it('editar() debería navegar a /editar/:id', () => {
    crearComponente('1');
    spyOn(component['router'], 'navigate');
    component.editar();
    expect(component['router'].navigate).toHaveBeenCalledWith(['/editar', 1]);
  });

  it('volver() debería navegar a /libros', () => {
    crearComponente('1');
    spyOn(component['router'], 'navigate');
    component.volver();
    expect(component['router'].navigate).toHaveBeenCalledWith(['/libros']);
  });

  // ──────────────────────────────────────────────────────────
  // eliminar()
  // ──────────────────────────────────────────────────────────
  it('eliminar() debería navegar a /libros tras eliminar', () => {
    crearComponente('1');
    spyOn(window, 'confirm').and.returnValue(true);
    spyOn(component['router'], 'navigate');
    component.eliminar();
    expect(libroServiceSpy.eliminar).toHaveBeenCalledWith(1);
    expect(component['router'].navigate).toHaveBeenCalledWith(['/libros']);
  });

  it('eliminar() no debería hacer nada si el usuario cancela', () => {
    crearComponente('1');
    spyOn(window, 'confirm').and.returnValue(false);
    component.eliminar();
    expect(libroServiceSpy.eliminar).not.toHaveBeenCalled();
  });

  it('eliminar() debería mostrar error si el servicio falla', () => {
    crearComponente('1');
    spyOn(window, 'confirm').and.returnValue(true);
    libroServiceSpy.eliminar.and.returnValue(
      throwError(() => new Error('Error interno del servidor'))
    );
    component.eliminar();
    expect(component.error).toContain('Error interno');
  });
});
