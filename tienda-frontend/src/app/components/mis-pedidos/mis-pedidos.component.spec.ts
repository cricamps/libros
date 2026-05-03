// ============================================================
// PRUEBAS UNITARIAS: MisPedidosComponent
// ============================================================
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { CommonModule } from '@angular/common';
import { MisPedidosComponent } from './mis-pedidos.component';
import { ProductoService } from '../../services/producto.service';
import { AuthService } from '../../services/auth.service';
import { Pedido } from '../../models/producto.model';
import { BehaviorSubject, of } from 'rxjs';

const PEDIDOS_MOCK: Pedido[] = [
  {
    id: 2, usuarioId: 2,
    items: [{ producto: { id: 3, nombre: 'Auriculares', descripcion: 'BT', precio: 129990, stock: 10, categoria: 'Audio', icono: '🎧', disponible: true }, cantidad: 2 }],
    total: 259980, estado: 'ENVIADO', fecha: '2026-03-20'
  },
  {
    id: 1, usuarioId: 2,
    items: [{ producto: { id: 1, nombre: 'Laptop', descripcion: 'Test', precio: 899990, stock: 5, categoria: 'PC', icono: '💻', disponible: true }, cantidad: 1 }],
    total: 899990, estado: 'ENTREGADO', fecha: '2026-01-15'
  }
];

describe('MisPedidosComponent', () => {
  let component: MisPedidosComponent;
  let fixture: ComponentFixture<MisPedidosComponent>;
  let productoSpy: jasmine.SpyObj<ProductoService>;
  let authSpy: jasmine.SpyObj<AuthService>;

  beforeEach(async () => {
    productoSpy = jasmine.createSpyObj('ProductoService', ['getPedidosPorUsuario$', 'getPedidosPorUsuario']);
    productoSpy['getPedidosPorUsuario$'] = jasmine.createSpy().and.returnValue(of([...PEDIDOS_MOCK]));
    productoSpy.getPedidosPorUsuario.and.returnValue([...PEDIDOS_MOCK]);

    authSpy = jasmine.createSpyObj('AuthService', ['getUsuario']);
    authSpy.getUsuario.and.returnValue({ id: 2, nombre: 'Juan', apellido: 'Test', email: 'juan@test.cl', password: 'x', rol: 'CLIENTE' as const });

    await TestBed.configureTestingModule({
      imports: [MisPedidosComponent, RouterTestingModule, CommonModule]
    })
      .overrideComponent(MisPedidosComponent, {
        set: {
          providers: [
            { provide: ProductoService, useValue: productoSpy },
            { provide: AuthService, useValue: authSpy }
          ]
        }
      })
      .compileComponents();

    fixture = TestBed.createComponent(MisPedidosComponent);
    component = fixture.componentInstance;
    (component as any).productoSvc = productoSpy;
    (component as any).auth = authSpy;
    fixture.detectChanges();
  });

  it('debería crearse correctamente', () => {
    expect(component).toBeTruthy();
  });

  it('debería cargar pedidos del usuario al iniciar', () => {
    component.ngOnInit();
    expect(component.pedidos.length).toBe(2);
  });

  it('debería ordenar pedidos con el más reciente primero', () => {
    component.ngOnInit();
    expect(component.pedidos[0].id).toBeGreaterThan(component.pedidos[1].id);
  });

  it('debería formatear precio correctamente en CLP', () => {
    const precio = component.formatearPrecio(899990);
    expect(precio).toContain('899');
  });

  it('debería retornar clase badge para PENDIENTE', () => {
    expect(component.getBadgeClass('PENDIENTE')).toContain('warning');
  });

  it('debería retornar clase badge para ENVIADO', () => {
    expect(component.getBadgeClass('ENVIADO')).toContain('primary');
  });

  it('debería retornar clase badge para ENTREGADO', () => {
    expect(component.getBadgeClass('ENTREGADO')).toContain('success');
  });

  it('debería retornar clase badge para PROCESANDO', () => {
    expect(component.getBadgeClass('PROCESANDO')).toContain('info');
  });

  it('debería retornar badge secundario para estado desconocido', () => {
    expect(component.getBadgeClass('OTRO')).toContain('secondary');
  });

  it('debería desuscribirse en ngOnDestroy', () => {
    component.ngOnInit();
    const sub = (component as any).sub;
    spyOn(sub, 'unsubscribe');
    component.ngOnDestroy();
    expect(sub.unsubscribe).toHaveBeenCalled();
  });

  it('debería mostrar lista vacía si no hay pedidos', () => {
    productoSpy['getPedidosPorUsuario$'] = jasmine.createSpy().and.returnValue(of([]));
    (component as any).productoSvc = productoSpy;
    component.ngOnInit();
    expect(component.pedidos.length).toBe(0);
  });
});
