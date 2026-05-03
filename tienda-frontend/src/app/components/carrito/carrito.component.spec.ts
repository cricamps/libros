// ============================================================
// PRUEBAS UNITARIAS: CarritoComponent
// ============================================================
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { CommonModule } from '@angular/common';
import { CarritoComponent } from './carrito.component';
import { ProductoService } from '../../services/producto.service';
import { AuthService } from '../../services/auth.service';
import { ItemCarrito, Pedido } from '../../models/producto.model';
import { BehaviorSubject } from 'rxjs';

const ITEM_MOCK: ItemCarrito = {
  producto: { id: 1, nombre: 'Laptop', descripcion: 'Test', precio: 899990, stock: 5, categoria: 'PC', icono: '💻', disponible: true },
  cantidad: 2
};

describe('CarritoComponent', () => {
  let component: CarritoComponent;
  let fixture: ComponentFixture<CarritoComponent>;
  let productoSpy: jasmine.SpyObj<ProductoService>;
  let authSpy: jasmine.SpyObj<AuthService>;
  let carritoSubject: BehaviorSubject<ItemCarrito[]>;

  beforeEach(async () => {
    carritoSubject = new BehaviorSubject<ItemCarrito[]>([]);

    productoSpy = jasmine.createSpyObj('ProductoService', [
      'getCarrito', 'getTotalCarrito', 'actualizarCantidad',
      'quitarDelCarrito', 'realizarPedido', 'vaciarCarrito'
    ]);
    productoSpy.getCarrito.and.returnValue(carritoSubject.asObservable());
    productoSpy.getTotalCarrito.and.returnValue(0);
    productoSpy.realizarPedido.and.returnValue(null);

    authSpy = jasmine.createSpyObj('AuthService', ['getUsuario']);
    authSpy.getUsuario.and.returnValue({ id: 2, nombre: 'Juan', apellido: 'Test', email: 'juan@test.cl', password: 'x', rol: 'CLIENTE' as const });

    await TestBed.configureTestingModule({
      imports: [CarritoComponent, RouterTestingModule, CommonModule]
    })
      .overrideComponent(CarritoComponent, {
        set: {
          providers: [
            { provide: ProductoService, useValue: productoSpy },
            { provide: AuthService, useValue: authSpy }
          ]
        }
      })
      .compileComponents();

    fixture = TestBed.createComponent(CarritoComponent);
    component = fixture.componentInstance;
    (component as any).productoSvc = productoSpy;
    (component as any).auth = authSpy;
    fixture.detectChanges();
  });

  it('debería crearse correctamente', () => {
    expect(component).toBeTruthy();
  });

  it('debería suscribirse al carrito en ngOnInit', () => {
    carritoSubject.next([ITEM_MOCK]);
    expect(component.items.length).toBe(1);
  });

  it('debería iniciar sin pedido realizado', () => {
    expect(component.pedidoRealizado).toBeFalse();
  });

  it('debería obtener el total del carrito', () => {
    productoSpy.getTotalCarrito.and.returnValue(1799980);
    expect(component.getTotal()).toBe(1799980);
  });

  it('debería llamar a actualizarCantidad al cambiar cantidad', () => {
    component.cambiarCantidad(1, 3);
    expect(productoSpy.actualizarCantidad).toHaveBeenCalledWith(1, 3);
  });

  it('debería llamar a quitarDelCarrito al quitar ítem', () => {
    component.quitar(1);
    expect(productoSpy.quitarDelCarrito).toHaveBeenCalledWith(1);
  });

  it('debería confirmar pedido correctamente', () => {
    const pedidoMock: Pedido = {
      id: 5, usuarioId: 2, items: [ITEM_MOCK],
      total: 1799980, estado: 'PENDIENTE', fecha: '2025-01-01'
    };
    productoSpy.realizarPedido.and.returnValue(pedidoMock);
    component.confirmarPedido();
    expect(component.pedidoRealizado).toBeTrue();
    expect(component.numeroPedido).toBe(5);
  });

  it('no debería marcar pedidoRealizado si realizarPedido retorna null', () => {
    productoSpy.realizarPedido.and.returnValue(null);
    component.confirmarPedido();
    expect(component.pedidoRealizado).toBeFalse();
  });

  it('debería formatear precio correctamente', () => {
    const precio = component.formatearPrecio(49990);
    expect(precio).toContain('49');
  });

  it('debería desuscribirse en ngOnDestroy', () => {
    const sub = (component as any).sub;
    spyOn(sub, 'unsubscribe');
    component.ngOnDestroy();
    expect(sub.unsubscribe).toHaveBeenCalled();
  });
});
