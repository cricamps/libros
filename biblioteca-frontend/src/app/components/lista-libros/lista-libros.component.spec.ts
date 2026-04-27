// ============================================================
// TEST: ListaLibrosComponent
// Pruebas del componente que muestra el listado de libros.
// Patrón Observer: verifica suscripción y reacción a datos.
// ============================================================
import { TestBed, ComponentFixture, fakeAsync, tick } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { of, throwError } from 'rxjs';

import { ListaLibrosComponent } from './lista-libros.component';
import { LibroService } from '../../services/libro.service';
import { Libro } from '../../models/libro.model';

describe('ListaLibrosComponent', () => {
  let component: ListaLibrosComponent;
  let fixture: ComponentFixture<ListaLibrosComponent>;
  let libroServiceSpy: jasmine.SpyObj<LibroService>;

  const librosMock: Libro[] = [
    { id: 1, titulo: 'El Quijote', autor: 'Cervantes', anioPublicacion: 1605, genero: 'Novela' },
    { id: 2, titulo: '1984', autor: 'Orwell', anioPublicacion: 1949, genero: 'Distopía' }
  ];

  beforeEach(async () => {
    const spy = jasmine.createSpyObj('LibroService', ['obtenerTodos', 'eliminar']);

    await TestBed.configureTestingModule({
      imports: [ListaLibrosComponent, RouterTestingModule],
      providers: [{ provide: LibroService, useValue: spy }]
    }).compileComponents();

    libroServiceSpy = TestBed.inject(LibroService) as jasmine.SpyObj<LibroService>;
    libroServiceSpy.obtenerTodos.and.returnValue(of(librosMock));

    fixture = TestBed.createComponent(ListaLibrosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  // ──────────────────────────────────────────────────────────
  // Creación
  // ──────────────────────────────────────────────────────────
  it('debería crearse correctamente', () => {
    expect(component).toBeTruthy();
  });

  // ──────────────────────────────────────────────────────────
  // cargarLibros()
  // ──────────────────────────────────────────────────────────
  it('debería cargar los libros al iniciar (ngOnInit)', () => {
    expect(libroServiceSpy.obtenerTodos).toHaveBeenCalled();
    expect(component.libros.length).toBe(2);
    expect(component.cargando).toBeFalse();
  });

  it('debería mostrar mensaje de error si el servicio falla', () => {
    libroServiceSpy.obtenerTodos.and.returnValue(
      throwError(() => new Error('No se puede conectar al servidor'))
    );
    component.cargarLibros();
    expect(component.mensaje).toContain('No se puede conectar');
    expect(component.tipoMensaje).toBe('danger');
  });

  // ──────────────────────────────────────────────────────────
  // eliminarLibro()
  // ──────────────────────────────────────────────────────────
  it('eliminarLibro() debería eliminar el libro de la lista', fakeAsync(() => {
    libroServiceSpy.eliminar.and.returnValue(of(undefined));
    spyOn(window, 'confirm').and.returnValue(true);

    component.libros = [...librosMock];
    component.eliminarLibro(1, 'El Quijote');
    tick(3100); // espera el setTimeout del mensaje

    expect(component.libros.length).toBe(1);
    expect(component.libros[0].id).toBe(2);
  }));

  it('eliminarLibro() no debería eliminar si el usuario cancela el confirm', () => {
    spyOn(window, 'confirm').and.returnValue(false);
    component.libros = [...librosMock];
    component.eliminarLibro(1, 'El Quijote');
    expect(libroServiceSpy.eliminar).not.toHaveBeenCalled();
    expect(component.libros.length).toBe(2);
  });

  it('eliminarLibro() debería mostrar error si el servicio falla', () => {
    libroServiceSpy.eliminar.and.returnValue(
      throwError(() => new Error('Error interno del servidor'))
    );
    spyOn(window, 'confirm').and.returnValue(true);
    component.eliminarLibro(1, 'El Quijote');
    expect(component.mensaje).toContain('Error interno');
    expect(component.tipoMensaje).toBe('danger');
  });

  // ──────────────────────────────────────────────────────────
  // Navegación
  // ──────────────────────────────────────────────────────────
  it('editarLibro() debería navegar a /editar/:id', () => {
    const router = TestBed.inject(RouterTestingModule as any);
    spyOn(component['router'], 'navigate');
    component.editarLibro(1);
    expect(component['router'].navigate).toHaveBeenCalledWith(['/editar', 1]);
  });

  it('verDetalle() debería navegar a /detalle/:id', () => {
    spyOn(component['router'], 'navigate');
    component.verDetalle(2);
    expect(component['router'].navigate).toHaveBeenCalledWith(['/detalle', 2]);
  });

  // ──────────────────────────────────────────────────────────
  // ngOnDestroy
  // ──────────────────────────────────────────────────────────
  it('ngOnDestroy() debería cancelar la suscripción', () => {
    spyOn(component['suscripcion']!, 'unsubscribe');
    component.ngOnDestroy();
    expect(component['suscripcion']!.unsubscribe).toHaveBeenCalled();
  });
});
