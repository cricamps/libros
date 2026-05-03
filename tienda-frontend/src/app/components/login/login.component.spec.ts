// ============================================================
// PRUEBAS UNITARIAS: LoginComponent
// ============================================================
import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { LoginComponent } from './login.component';
import { AuthService } from '../../services/auth.service';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let authSpy: jasmine.SpyObj<AuthService>;

  beforeEach(async () => {
    authSpy = jasmine.createSpyObj('AuthService', ['estaLogueado', 'login', 'esAdmin', 'getUsuario']);
    authSpy.estaLogueado.and.returnValue(false);
    authSpy.login.and.returnValue(false);

    await TestBed.configureTestingModule({
      imports: [LoginComponent, ReactiveFormsModule, RouterTestingModule]
    })
      .overrideComponent(LoginComponent, {
        set: { providers: [{ provide: AuthService, useValue: authSpy }] }
      })
      .compileComponents();

    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    // Sobreescribir el authService con el spy
    (component as any).auth = authSpy;
    fixture.detectChanges();
  });

  it('debería crearse correctamente', () => {
    expect(component).toBeTruthy();
  });

  it('debería iniciar con formulario inválido', () => {
    expect(component.form.valid).toBeFalse();
  });

  it('debería tener error de email requerido', () => {
    const emailControl = component.form.get('email')!;
    emailControl.setValue('');
    emailControl.markAsTouched();
    expect(emailControl.hasError('required')).toBeTrue();
  });

  it('debería tener error de email inválido', () => {
    const emailControl = component.form.get('email')!;
    emailControl.setValue('noesunemail');
    expect(emailControl.hasError('email')).toBeTrue();
  });

  it('debería tener error de password requerida', () => {
    const passControl = component.form.get('password')!;
    passControl.setValue('');
    passControl.markAsTouched();
    expect(passControl.hasError('required')).toBeTrue();
  });

  it('debería tener error si password es muy corta', () => {
    const passControl = component.form.get('password')!;
    passControl.setValue('ab');
    expect(passControl.hasError('minlength')).toBeTrue();
  });

  it('debería ser válido con email y password correctos', () => {
    component.form.setValue({ email: 'test@test.cl', password: 'password123' });
    expect(component.form.valid).toBeTrue();
  });

  it('no debería llamar a login si el formulario es inválido', () => {
    component.onSubmit();
    expect(authSpy.login).not.toHaveBeenCalled();
  });

  it('debería mostrar error con credenciales incorrectas', fakeAsync(() => {
    authSpy.login.and.returnValue(false);
    component.form.setValue({ email: 'wrong@test.cl', password: 'wrongpass' });
    component.onSubmit();
    tick(600);
    expect(component.error).toContain('incorrectos');
    expect(component.cargando).toBeFalse();
  }));

  it('debería alternar la visibilidad de la contraseña', () => {
    expect(component.mostrarPassword).toBeFalse();
    component.togglePassword();
    expect(component.mostrarPassword).toBeTrue();
    component.togglePassword();
    expect(component.mostrarPassword).toBeFalse();
  });

  it('debería tener getters de email y password definidos', () => {
    expect(component.email).toBeDefined();
    expect(component.password).toBeDefined();
  });
});
