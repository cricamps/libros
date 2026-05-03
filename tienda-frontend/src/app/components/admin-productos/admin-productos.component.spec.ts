// ============================================================
// PRUEBAS UNITARIAS: AdminProductosComponent
// ============================================================
import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { AdminProductosComponent } from './admin-productos.component';
import { ProductoService } from '../../services/producto.service';
import { Producto } from '../../models/producto.model';
import { of } from 'rxjs';

const PRODUCTOS_MOCK: Producto[] = [
  { id: 1, nombre: 'Laptop ProBook', descripcion: 'Laptop i7 16GB RAM SSD', precio: 899990, stock: 10, categoria: 'Computadores', icono: '💻', disponible: true },
  { id: 2, nombre: 'Smartphone X20', descripcion: 'Smartphone 6.5 pulgadas', precio: 499990, stock: 5, categoria: 'Celulares', icono: '📱', disponible: true },
];

describe('AdminProductosComponent', () => {
  let component: AdminProductosComponent;
  let fixture: ComponentFixture<AdminProductosComponent>;
  let productoSpy: jasmine.SpyObj<ProductoService>;
  let routerSpy: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    productoSpy = jasmine.createSpyObj('ProductoService', [
      'getProductosArray', 'agregarProducto', 'actualizarProducto',
      'eliminarProducto', 'getProductoPorId'
    ]);
    productoSpy.getProductosArray.and.returnValue([...PRODUCTOS_MOCK]);
    productoSpy.agregarProducto.and.stub();
    productoSpy.actualizarProducto.and.returnValue(true);
    productoSpy.eliminarProducto.and.returnValue(true);
    productoSpy.getProductoPorId.and.returnValue(undefined);

    routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      imports: [AdminProductosComponent, ReactiveFormsModule, CommonModule, RouterTestingModule],
      providers: [
        { provide: ProductoService, useValue: productoSpy },
        { provide: Router, useValue: routerSpy },
        { provide: ActivatedRoute, useValue: { queryParams: of({}) } }
      ]
    })
      .overrideComponent(AdminProductosComponent, {
        set: {
          providers: [
            { provide: ProductoService, useValue: productoSpy },
            { provide: Router, useValue: routerSpy },
            { provide: ActivatedRoute, useValue: { queryParams: of({}) } }
          ]
        }
      })
      .compileComponents();

    fixture = TestBed.createComponent(AdminProductosComponent);
    component = fixture.componentInstance;
    (component as any).productoSvc = productoSpy;
    (component as any).router = routerSpy;
    fixture.detectChanges();
  });

  it('debería crearse correctamente', () => {
    expect(component).toBeTruthy();
  });

  it('debería cargar productos en ngOnInit', () => {
    expect(component.productos.length).toBe(2);
  });

  it('debería iniciar con formulario oculto', () => {
    expect(component.mostrarFormulario).toBeFalse();
  });

  it('debería abrir formulario en modo nuevo', () => {
    component.abrirNuevo();
    expect(component.mostrarFormulario).toBeTrue();
    expect(component.modoEdicion).toBeFalse();
  });

  it('debería abrir formulario en modo edición con datos del producto', () => {
    component.editarProducto(PRODUCTOS_MOCK[0]);
    expect(component.mostrarFormulario).toBeTrue();
    expect(component.modoEdicion).toBeTrue();
    expect(component.form.get('nombre')!.value).toBe('Laptop ProBook');
  });

  it('debería navegar al detalle al llamar verDetalle', () => {
    component.verDetalle(1);
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/admin-productos', 1]);
  });

  it('debería cancelar y ocultar el formulario', () => {
    component.abrirNuevo();
    component.cancelar();
    expect(component.mostrarFormulario).toBeFalse();
    expect(component.modoEdicion).toBeFalse();
  });

  it('no debería agregar producto con formulario inválido', () => {
    component.abrirNuevo();
    component.form.get('nombre')!.setValue('');
    component.onSubmit();
    expect(productoSpy.agregarProducto).not.toHaveBeenCalled();
  });

  it('debería agregar un producto válido', () => {
    component.abrirNuevo();
    component.form.setValue({
      nombre: 'Webcam HD Nueva', descripcion: 'Webcam de alta definicion 1080p',
      precio: 39990, stock: 20, categoria: 'Periféricos',
      icono: '📷', disponible: true
    });
    component.onSubmit();
    expect(productoSpy.agregarProducto).toHaveBeenCalled();
  });

  it('debería actualizar un producto existente', () => {
    component.editarProducto(PRODUCTOS_MOCK[0]);
    component.form.get('precio')!.setValue(999999);
    component.onSubmit();
    expect(productoSpy.actualizarProducto).toHaveBeenCalledWith(1, jasmine.objectContaining({ precio: 999999 }));
  });

  it('debería eliminar un producto con confirmación', () => {
    spyOn(window, 'confirm').and.returnValue(true);
    component.eliminarProducto(1);
    expect(productoSpy.eliminarProducto).toHaveBeenCalledWith(1);
  });

  it('no debería eliminar si el usuario cancela', () => {
    spyOn(window, 'confirm').and.returnValue(false);
    component.eliminarProducto(1);
    expect(productoSpy.eliminarProducto).not.toHaveBeenCalled();
  });

  it('debería formatear precio correctamente', () => {
    expect(component.formatearPrecio(899990)).toContain('899');
  });

  it('debería mostrar mensaje de éxito y limpiarlo', fakeAsync(() => {
    component.mostrar('Operación exitosa');
    expect(component.mensajeExito).toBe('Operación exitosa');
    tick(3000);
    expect(component.mensajeExito).toBe('');
  }));

  it('debería requerir nombre de al menos 3 caracteres', () => {
    component.abrirNuevo();
    component.form.get('nombre')!.setValue('AB');
    expect(component.form.get('nombre')!.hasError('minlength')).toBeTrue();
  });

  it('debería requerir descripción de al menos 10 caracteres', () => {
    component.abrirNuevo();
    component.form.get('descripcion')!.setValue('corta');
    expect(component.form.get('descripcion')!.hasError('minlength')).toBeTrue();
  });

  it('debería requerir precio mayor a 0', () => {
    component.abrirNuevo();
    component.form.get('precio')!.setValue(0);
    expect(component.form.get('precio')!.hasError('min')).toBeTrue();
  });

  it('debería tener getters definidos', () => {
    component.abrirNuevo();
    expect(component.nombre).toBeDefined();
    expect(component.descripcion).toBeDefined();
    expect(component.precio).toBeDefined();
    expect(component.stock).toBeDefined();
  });
});
