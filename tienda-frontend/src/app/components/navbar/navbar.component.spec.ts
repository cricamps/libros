// ============================================================
// PRUEBAS UNITARIAS: NavbarComponent
// ============================================================
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from './navbar.component';
import { AuthService } from '../../services/auth.service';
import { ProductoService } from '../../services/producto.service';
import { BehaviorSubject } from 'rxjs';
import { Usuario } from '../../models/usuario.model';
import { ItemCarrito } from '../../models/producto.model';

describe('NavbarComponent', () => {
  let component: NavbarComponent;
  let fixture: ComponentFixture<NavbarComponent>;
  let authSpy: jasmine.SpyObj<AuthService>;
  let productoSpy: jasmine.SpyObj<ProductoService>;
  let usuarioSubject: BehaviorSubject<Usuario | null>;
  let carritoSubject: BehaviorSubject<ItemCarrito[]>;

  beforeEach(async () => {
    usuarioSubject = new BehaviorSubject<Usuario | null>(null);
    carritoSubject = new BehaviorSubject<ItemCarrito[]>([]);

    authSpy = jasmine.createSpyObj('AuthService', ['getUsuarioActual', 'logout', 'esAdmin']);
    authSpy.getUsuarioActual.and.returnValue(usuarioSubject.asObservable());
    authSpy.esAdmin.and.returnValue(false);
    authSpy.logout.and.stub();

    productoSpy = jasmine.createSpyObj('ProductoService', ['getCarrito']);
    productoSpy.getCarrito.and.returnValue(carritoSubject.asObservable());

    await TestBed.configureTestingModule({
      imports: [NavbarComponent, RouterTestingModule, CommonModule]
    })
      .overrideComponent(NavbarComponent, {
        set: {
          providers: [
            { provide: AuthService, useValue: authSpy },
            { provide: ProductoService, useValue: productoSpy }
          ]
        }
      })
      .compileComponents();

    fixture = TestBed.createComponent(NavbarComponent);
    component = fixture.componentInstance;
    (component as any).auth = authSpy;
    (component as any).productoSvc = productoSpy;
    fixture.detectChanges();
  });

  it('debería crearse correctamente', () => {
    expect(component).toBeTruthy();
  });

  it('debería iniciar sin usuario', () => {
    expect(component.usuario).toBeNull();
  });

  it('debería actualizar usuario al recibir evento del observable', () => {
    const usuario: Usuario = { id: 1, nombre: 'Admin', apellido: 'Test', email: 'admin@test.cl', password: 'x', rol: 'ADMIN' };
    usuarioSubject.next(usuario);
    expect(component.usuario?.nombre).toBe('Admin');
  });

  it('debería iniciar con carrito vacío', () => {
    expect(component.cantidadCarrito).toBe(0);
  });

  it('debería actualizar cantidad del carrito reactivamente', () => {
    const items: ItemCarrito[] = [
      { producto: { id: 1, nombre: 'Laptop', descripcion: 'Test', precio: 899990, stock: 5, categoria: 'PC', icono: '💻', disponible: true }, cantidad: 3 }
    ];
    carritoSubject.next(items);
    expect(component.cantidadCarrito).toBe(3);
  });

  it('debería llamar a logout al cerrar sesión', () => {
    component.logout();
    expect(authSpy.logout).toHaveBeenCalled();
  });

  it('debería verificar si es admin', () => {
    authSpy.esAdmin.and.returnValue(true);
    expect(component.esAdmin()).toBeTrue();
  });

  it('debería retornar false si no es admin', () => {
    authSpy.esAdmin.and.returnValue(false);
    expect(component.esAdmin()).toBeFalse();
  });

  it('debería desuscribirse en ngOnDestroy', () => {
    const subs = (component as any).subs;
    spyOn(subs, 'unsubscribe');
    component.ngOnDestroy();
    expect(subs.unsubscribe).toHaveBeenCalled();
  });
});
