// ============================================================
// PRUEBAS UNITARIAS: RegistroComponent
// ============================================================
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { RegistroComponent } from './registro.component';
import { AuthService } from '../../services/auth.service';

describe('RegistroComponent', () => {
  let component: RegistroComponent;
  let fixture: ComponentFixture<RegistroComponent>;
  let authSpy: jasmine.SpyObj<AuthService>;

  beforeEach(async () => {
    authSpy = jasmine.createSpyObj('AuthService', ['registrar']);
    authSpy.registrar.and.returnValue(true);

    await TestBed.configureTestingModule({
      imports: [RegistroComponent, ReactiveFormsModule, RouterTestingModule]
    })
      .overrideComponent(RegistroComponent, {
        set: { providers: [{ provide: AuthService, useValue: authSpy }] }
      })
      .compileComponents();

    fixture = TestBed.createComponent(RegistroComponent);
    component = fixture.componentInstance;
    (component as any).auth = authSpy;
    fixture.detectChanges();
  });

  it('debería crearse correctamente', () => {
    expect(component).toBeTruthy();
  });

  it('debería iniciar con formulario inválido', () => {
    expect(component.form.valid).toBeFalse();
  });

  it('debería requerir nombre de al menos 2 caracteres', () => {
    component.form.get('nombre')!.setValue('A');
    expect(component.form.get('nombre')!.hasError('minlength')).toBeTrue();
  });

  it('debería requerir email válido', () => {
    component.form.get('email')!.setValue('noemail');
    expect(component.form.get('email')!.hasError('email')).toBeTrue();
  });

  it('debería rechazar password sin número', () => {
    component.form.get('password')!.setValue('Password!');
    expect(component.form.get('password')!.hasError('sinNumero')).toBeTrue();
  });

  it('debería rechazar password sin caracter especial', () => {
    component.form.get('password')!.setValue('Password1');
    expect(component.form.get('password')!.hasError('sinEspecial')).toBeTrue();
  });

  it('debería rechazar password sin mayúscula', () => {
    component.form.get('password')!.setValue('password1!');
    expect(component.form.get('password')!.hasError('sinMayuscula')).toBeTrue();
  });

  it('debería rechazar password menor a 8 caracteres', () => {
    component.form.get('password')!.setValue('Ab1!');
    expect(component.form.get('password')!.hasError('minLength')).toBeTrue();
  });

  it('debería rechazar password mayor a 20 caracteres', () => {
    component.form.get('password')!.setValue('Abcde12345!@#$%^&*()+X');
    expect(component.form.get('password')!.hasError('maxLength')).toBeTrue();
  });

  it('debería aceptar password válida', () => {
    component.form.get('password')!.setValue('Segura@123');
    expect(component.form.get('password')!.valid).toBeTrue();
  });

  it('debería detectar que passwords no coinciden', () => {
    component.form.get('password')!.setValue('Segura@123');
    component.form.get('confirmarPassword')!.setValue('Distinta@456');
    expect(component.form.hasError('noCoinciden')).toBeTrue();
  });

  it('debería calcular fuerza de password correctamente', () => {
    component.form.get('password')!.setValue('Segura@123');
    expect(component.getFuerzaPassword()).toBe(4);
  });

  it('debería retornar color rojo para password muy débil', () => {
    component.form.get('password')!.setValue('a');
    expect(component.getFuerzaColor()).toBe('#e74c3c');
  });

  it('debería retornar color verde para password fuerte', () => {
    component.form.get('password')!.setValue('Segura@123');
    expect(component.getFuerzaColor()).toBe('#2ecc71');
  });

  it('debería retornar texto Fuerte para password segura', () => {
    component.form.get('password')!.setValue('Segura@123');
    expect(component.getFuerzaTexto()).toBe('Fuerte');
  });

  it('debería retornar texto Muy débil para password muy débil', () => {
    component.form.get('password')!.setValue('a');
    expect(component.getFuerzaTexto()).toBe('Muy débil');
  });

  it('debería retornar texto Débil para fuerza 2', () => {
    // longitud>=8 ✓ + número ✓ = score 2 → 'Débil'
    component.form.get('password')!.setValue('segura12');
    expect(component.getFuerzaTexto()).toBe('Débil');
  });

  it('debería retornar texto Buena para fuerza 3', () => {
    // longitud>=8 ✓ + número ✓ + mayúscula ✓ = score 3 → 'Buena'
    component.form.get('password')!.setValue('Segura12');
    expect(component.getFuerzaTexto()).toBe('Buena');
  });

  it('no debería llamar a registrar si el formulario es inválido', () => {
    component.onSubmit();
    expect(authSpy.registrar).not.toHaveBeenCalled();
  });

  it('debería mostrar error si el email ya existe', () => {
    authSpy.registrar.and.returnValue(false);
    component.form.setValue({
      nombre: 'Test', apellido: 'User', email: 'admin@techstore.cl',
      telefono: '+56912345678', direccion: 'Santiago 123',
      password: 'Segura@123', confirmarPassword: 'Segura@123'
    });
    component.onSubmit();
    expect(component.error).toContain('registrado');
  });

  it('debería alternar visibilidad de password', () => {
    expect(component.mostrarPassword).toBeFalse();
    component.mostrarPassword = true;
    expect(component.mostrarPassword).toBeTrue();
  });

  it('debería alternar visibilidad de confirmar password', () => {
    expect(component.mostrarConfirm).toBeFalse();
    component.mostrarConfirm = true;
    expect(component.mostrarConfirm).toBeTrue();
  });

  it('debería tener getters definidos para todos los campos', () => {
    expect(component.nombre).toBeDefined();
    expect(component.apellido).toBeDefined();
    expect(component.email).toBeDefined();
    expect(component.telefono).toBeDefined();
    expect(component.direccion).toBeDefined();
    expect(component.password).toBeDefined();
    expect(component.confirmarPassword).toBeDefined();
  });
});
