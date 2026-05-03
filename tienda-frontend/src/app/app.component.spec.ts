// ============================================================
// PRUEBAS UNITARIAS: AppComponent
// ============================================================
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { CommonModule } from '@angular/common';
import { AppComponent } from './app.component';
import { AuthService } from './services/auth.service';
import { ProductoService } from './services/producto.service';
import { BehaviorSubject } from 'rxjs';
import { Usuario } from './models/usuario.model';
import { ItemCarrito } from './models/producto.model';

describe('AppComponent', () => {
  let component: AppComponent;
  let fixture: ComponentFixture<AppComponent>;
  let authSpy: jasmine.SpyObj<AuthService>;
  let productoSpy: jasmine.SpyObj<ProductoService>;
  let usuarioSubject: BehaviorSubject<Usuario | null>;

  beforeEach(async () => {
    usuarioSubject = new BehaviorSubject<Usuario | null>(null);

    authSpy = jasmine.createSpyObj('AuthService', ['getUsuarioActual', 'esAdmin', 'logout']);
    authSpy.getUsuarioActual.and.returnValue(usuarioSubject.asObservable());
    authSpy.esAdmin.and.returnValue(false);

    productoSpy = jasmine.createSpyObj('ProductoService', ['getCarrito']);
    productoSpy.getCarrito.and.returnValue(new BehaviorSubject<ItemCarrito[]>([]).asObservable());

    await TestBed.configureTestingModule({
      imports: [AppComponent, RouterTestingModule, CommonModule],
      providers: [
        { provide: AuthService, useValue: authSpy },
        { provide: ProductoService, useValue: productoSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('debería crearse correctamente', () => {
    expect(component).toBeTruthy();
  });

  it('debería iniciar con navbar oculto', () => {
    expect(component.mostrarNav).toBeFalse();
  });

  it('debería mostrar navbar cuando el usuario está logueado', () => {
    const usuario: Usuario = { id: 1, nombre: 'Admin', apellido: 'Test', email: 'admin@test.cl', password: 'x', rol: 'ADMIN' };
    usuarioSubject.next(usuario);
    expect(component.mostrarNav).toBeTrue();
  });

  it('debería ocultar navbar al hacer logout', () => {
    const usuario: Usuario = { id: 1, nombre: 'Admin', apellido: 'Test', email: 'admin@test.cl', password: 'x', rol: 'ADMIN' };
    usuarioSubject.next(usuario);
    expect(component.mostrarNav).toBeTrue();
    usuarioSubject.next(null);
    expect(component.mostrarNav).toBeFalse();
  });
});
