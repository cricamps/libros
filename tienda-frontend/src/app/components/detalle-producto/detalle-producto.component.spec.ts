// ============================================================
// PRUEBAS UNITARIAS: DetalleProductoComponent
// ============================================================
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { DetalleProductoComponent } from './detalle-producto.component';
import { ProductoService } from '../../services/producto.service';
import { AuthService } from '../../services/auth.service';
import { Producto } from '../../models/producto.model';

const PRODUCTO_MOCK: Producto = {
  id: 1, nombre: 'Laptop ProBook', descripcion: 'Laptop i7 16GB RAM SSD 512GB',
  precio: 899990, stock: 10, categoria: 'Computadores', icono: '💻', disponible: true
};

describe('DetalleProductoComponent', () => {
  let component: DetalleProductoComponent;
  let fixture: ComponentFixture<DetalleProductoComponent>;
  let productoSpy: jasmine.SpyObj<ProductoService>;
  let authSpy: jasmine.SpyObj<AuthService>;

  beforeEach(async () => {
    productoSpy = jasmine.createSpyObj('ProductoService', ['getProductoPorId', 'agregarAlCarrito']);
    productoSpy.getProductoPorId.and.returnValue({ ...PRODUCTO_MOCK });
    productoSpy.agregarAlCarrito.and.stub();

    authSpy = jasmine.createSpyObj('AuthService', ['esAdmin']);
    authSpy.esAdmin.and.returnValue(false);

    await TestBed.configureTestingModule({
      imports: [DetalleProductoComponent, RouterTestingModule, CommonModule],
      providers: [
        { provide: ProductoService, useValue: productoSpy },
        { provide: AuthService, useValue: authSpy },
        { provide: ActivatedRoute, useValue: { snapshot: { paramMap: { get: () => '1' } } } }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(DetalleProductoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('debería crearse correctamente', () => {
    expect(component).toBeTruthy();
  });

  it('debería cargar el producto en ngOnInit', () => {
    expect(component.producto).toBeDefined();
    expect(component.producto!.nombre).toBe('Laptop ProBook');
  });

  it('debería iniciar la cantidad en 1', () => {
    expect(component.cantidad).toBe(1);
  });

  it('debería aumentar la cantidad', () => {
    component.aumentar();
    expect(component.cantidad).toBe(2);
  });

  it('no debería aumentar más allá del stock', () => {
    component.cantidad = 10; // igual al stock
    component.aumentar();
    expect(component.cantidad).toBe(10);
  });

  it('debería disminuir la cantidad', () => {
    component.cantidad = 3;
    component.disminuir();
    expect(component.cantidad).toBe(2);
  });

  it('no debería disminuir menos de 1', () => {
    component.cantidad = 1;
    component.disminuir();
    expect(component.cantidad).toBe(1);
  });

  it('debería agregar al carrito con la cantidad indicada', () => {
    component.cantidad = 2;
    component.agregarAlCarrito();
    expect(productoSpy.agregarAlCarrito).toHaveBeenCalledWith(jasmine.objectContaining({ id: 1 }), 2);
    expect(component.agregado).toBeTrue();
  });

  it('no debería agregar al carrito si no está disponible', () => {
    component.producto = { ...PRODUCTO_MOCK, disponible: false };
    component.agregarAlCarrito();
    expect(productoSpy.agregarAlCarrito).not.toHaveBeenCalled();
  });

  it('debería formatear precio correctamente', () => {
    expect(component.formatearPrecio(899990)).toContain('899');
  });

  it('debería detectar si es admin', () => {
    authSpy.esAdmin.and.returnValue(true);
    component.ngOnInit();
    expect(component.esAdmin).toBeTrue();
  });
});
