// ============================================================
// PRUEBAS UNITARIAS: RecuperarContrasenaComponent
// ============================================================
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { CommonModule } from '@angular/common';
import { RecuperarContrasenaComponent } from './recuperar-contrasena.component';
import { AuthService } from '../../services/auth.service';

describe('RecuperarContrasenaComponent', () => {
  let component: RecuperarContrasenaComponent;
  let fixture: ComponentFixture<RecuperarContrasenaComponent>;
  let authSpy: jasmine.SpyObj<AuthService>;

  beforeEach(async () => {
    authSpy = jasmine.createSpyObj('AuthService', ['emailExiste']);
    authSpy.emailExiste.and.returnValue(true);

    await TestBed.configureTestingModule({
      imports: [RecuperarContrasenaComponent, ReactiveFormsModule, RouterTestingModule, CommonModule]
    })
      .overrideComponent(RecuperarContrasenaComponent, {
        set: { providers: [{ provide: AuthService, useValue: authSpy }] }
      })
      .compileComponents();

    fixture = TestBed.createComponent(RecuperarContrasenaComponent);
    component = fixture.componentInstance;
    (component as any).auth = authSpy;
    fixture.detectChanges();
  });

  it('debería crearse correctamente', () => {
    expect(component).toBeTruthy();
  });

  it('debería iniciar en el paso 1', () => {
    expect(component.paso).toBe(1);
  });

  it('debería requerir email en el paso 1', () => {
    component.form.get('email')!.setValue('');
    component.enviarEmail();
    expect(component.paso).toBe(1);
  });

  it('debería requerir email válido', () => {
    component.form.get('email')!.setValue('noemail');
    component.enviarEmail();
    expect(component.paso).toBe(1);
  });

  it('debería mostrar error si el email no existe', () => {
    authSpy.emailExiste.and.returnValue(false);
    component.form.get('email')!.setValue('noexiste@test.cl');
    component.enviarEmail();
    expect(component.error).toContain('No existe');
    expect(component.paso).toBe(1);
  });

  it('debería avanzar al paso 2 si el email existe', () => {
    authSpy.emailExiste.and.returnValue(true);
    component.form.get('email')!.setValue('admin@techstore.cl');
    component.enviarEmail();
    expect(component.paso).toBe(2);
    expect(component.codigoGenerado.length).toBe(6);
  });

  it('debería requerir código de 6 dígitos', () => {
    component.paso = 2;
    component.codigoGenerado = '123456';
    component.formCodigo.get('codigo')!.setValue('123');
    component.verificarCodigo();
    expect(component.paso).toBe(2);
  });

  it('debería mostrar error si el código es incorrecto', () => {
    component.paso = 2;
    component.codigoGenerado = '123456';
    component.formCodigo.get('codigo')!.setValue('999999');
    component.verificarCodigo();
    expect(component.error).toContain('incorrecto');
    expect(component.paso).toBe(2);
  });

  it('debería avanzar al paso 3 si el código es correcto', () => {
    component.paso = 2;
    component.codigoGenerado = '123456';
    component.formCodigo.get('codigo')!.setValue('123456');
    component.verificarCodigo();
    expect(component.paso).toBe(3);
  });

  it('debería mostrar error si las passwords no coinciden en paso 3', () => {
    component.paso = 3;
    component.formNueva.get('password')!.setValue('Segura@123');
    component.formNueva.get('confirmarPassword')!.setValue('Distinta@456');
    component.cambiarPassword();
    expect(component.error).toContain('no coinciden');
  });

  it('debería avanzar al paso 4 si la nueva password es válida', () => {
    component.paso = 3;
    component.formNueva.get('password')!.setValue('Segura@123');
    component.formNueva.get('confirmarPassword')!.setValue('Segura@123');
    component.cambiarPassword();
    expect(component.paso).toBe(4);
  });

  it('debería tener getters definidos', () => {
    expect(component.email).toBeDefined();
    expect(component.codigo).toBeDefined();
    expect(component.nuevaPass).toBeDefined();
    expect(component.confirmPass).toBeDefined();
  });
});
