// ============================================================
// TEST: FormularioLibroComponent
// Pruebas del componente de creación y edición de libros.
// Cubre modo 'crear' y modo 'editar'.
// ============================================================
import { TestBed, ComponentFixture } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { ActivatedRoute } from '@angular/router';
import { of, throwError } from 'rxjs';
import { NgForm } from '@angular/forms';

import { FormularioLibroComponent } from './formulario-libro.component';
import { LibroService } from '../../services/libro.service';
import { Libro } from '../../models/libro.model';

describe('FormularioLibroComponent - Modo CREAR', () => {
  let component: FormularioLibroComponent;
  let fixture: ComponentFixture<FormularioLibroComponent>;
  let libroServiceSpy: jasmine.SpyObj<LibroService>;

  const libroCreado: Libro = {
    id: 5,
    titulo: 'Nuevo Libro',
    autor: 'Autor Test',
    anioPublicacion: 2020,
    genero: 'Ciencia'
  };

  beforeEach(async () => {
    const spy = jasmine.createSpyObj('LibroService', ['obtenerPorId', 'crear', 'actualizar']);

    await TestBed.configureTestingModule({
      imports: [FormularioLibroComponent, RouterTestingModule],
      providers: [
        { provide: LibroService, useValue: spy },
        { provide: ActivatedRoute, useValue: { snapshot: { paramMap: { get: () => null } } } }
      ]
    }).compileComponents();

    libroServiceSpy = TestBed.inject(LibroService) as jasmine.SpyObj<LibroService>;
    fixture = TestBed.createComponent(FormularioLibroComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('debería crearse en modo crear', () => {
    expect(component).toBeTruthy();
    expect(component.modo).toBe('crear');
    expect(component.libroId).toBeNull();
  });

  it('guardar() con formulario válido debería llamar a crear() y navegar al detalle', () => {
    libroServiceSpy.crear.and.returnValue(of(libroCreado));
    spyOn(component['router'], 'navigate');

    const formMock = {
      invalid: false,
      form: { markAllAsTouched: jasmine.createSpy() }
    } as unknown as NgForm;

    component.libro = { titulo: 'Nuevo Libro', autor: 'Autor Test', anioPublicacion: 2020, genero: 'Ciencia' };
    component.guardar(formMock);

    expect(libroServiceSpy.crear).toHaveBeenCalled();
    expect(component['router'].navigate).toHaveBeenCalledWith(['/detalle', 5]);
  });

  it('guardar() con formulario inválido debería mostrar mensaje de error', () => {
    const formMock = {
      invalid: true,
      form: { markAllAsTouched: jasmine.createSpy() }
    } as unknown as NgForm;

    component.guardar(formMock);

    expect(component.mensaje).toContain('completa todos los campos');
    expect(component.tipoMensaje).toBe('danger');
    expect(libroServiceSpy.crear).not.toHaveBeenCalled();
  });

  it('guardar() debería mostrar error si crear() falla', () => {
    libroServiceSpy.crear.and.returnValue(throwError(() => new Error('Error interno del servidor')));

    const formMock = {
      invalid: false,
      form: { markAllAsTouched: jasmine.createSpy() }
    } as unknown as NgForm;

    component.guardar(formMock);

    expect(component.mensaje).toContain('Error interno');
    expect(component.tipoMensaje).toBe('danger');
  });

  it('cancelar() en modo crear debería navegar a /libros', () => {
    spyOn(component['router'], 'navigate');
    component.cancelar();
    expect(component['router'].navigate).toHaveBeenCalledWith(['/libros']);
  });
});

describe('FormularioLibroComponent - Modo EDITAR', () => {
  let component: FormularioLibroComponent;
  let fixture: ComponentFixture<FormularioLibroComponent>;
  let libroServiceSpy: jasmine.SpyObj<LibroService>;

  const libroExistente: Libro = {
    id: 3,
    titulo: 'Libro Existente',
    autor: 'Autor',
    anioPublicacion: 2000,
    genero: 'Historia'
  };

  beforeEach(async () => {
    const spy = jasmine.createSpyObj('LibroService', ['obtenerPorId', 'crear', 'actualizar']);
    spy.obtenerPorId.and.returnValue(of(libroExistente));

    await TestBed.configureTestingModule({
      imports: [FormularioLibroComponent, RouterTestingModule],
      providers: [
        { provide: LibroService, useValue: spy },
        { provide: ActivatedRoute, useValue: { snapshot: { paramMap: { get: () => '3' } } } }
      ]
    }).compileComponents();

    libroServiceSpy = TestBed.inject(LibroService) as jasmine.SpyObj<LibroService>;
    fixture = TestBed.createComponent(FormularioLibroComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('debería crearse en modo editar y cargar el libro', () => {
    expect(component.modo).toBe('editar');
    expect(component.libroId).toBe(3);
    expect(component.libro.titulo).toBe('Libro Existente');
  });

  it('debería manejar error al cargar libro en modo editar', () => {
    libroServiceSpy.obtenerPorId.and.returnValue(throwError(() => new Error('no fue encontrado')));
    component.cargarLibro(999);
    expect(component.mensaje).toContain('no fue encontrado');
  });

  it('guardar() en modo editar debería llamar a actualizar() y navegar al detalle', () => {
    libroServiceSpy.actualizar.and.returnValue(of(libroExistente));
    spyOn(component['router'], 'navigate');

    const formMock = {
      invalid: false,
      form: { markAllAsTouched: jasmine.createSpy() }
    } as unknown as NgForm;

    component.guardar(formMock);

    expect(libroServiceSpy.actualizar).toHaveBeenCalledWith(3, component.libro);
    expect(component['router'].navigate).toHaveBeenCalledWith(['/detalle', 3]);
  });

  it('guardar() debería mostrar error si actualizar() falla', () => {
    libroServiceSpy.actualizar.and.returnValue(throwError(() => new Error('Error interno del servidor')));

    const formMock = {
      invalid: false,
      form: { markAllAsTouched: jasmine.createSpy() }
    } as unknown as NgForm;

    component.guardar(formMock);
    expect(component.mensaje).toContain('Error interno');
  });

  it('cancelar() en modo editar debería navegar a /detalle/:id', () => {
    spyOn(component['router'], 'navigate');
    component.cancelar();
    expect(component['router'].navigate).toHaveBeenCalledWith(['/detalle', 3]);
  });
});
