// ============================================================
// PRUEBAS UNITARIAS: PerfilComponent
// ============================================================
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule, DatePipe } from '@angular/common';
import { PerfilComponent } from './perfil.component';
import { AuthService } from '../../services/auth.service';
import { Usuario } from '../../models/usuario.model';

const USUARIO_MOCK: Usuario = {
  id: 2, nombre: 'Juan', apellido: 'Pérez',
  email: 'juan@cliente.cl', password: 'Cliente@123',
  rol: 'CLIENTE', telefono: '+56912345678',
  direccion: 'Valparaíso, Chile', fechaRegistro: '2024-01-01'
};

describe('PerfilComponent', () => {
  let component: PerfilComponent;
  let fixture: ComponentFixture<PerfilComponent>;
  let authSpy: jasmine.SpyObj<AuthService>;

  beforeEach(async () => {
    authSpy = jasmine.createSpyObj('AuthService', ['getUsuario', 'actualizarPerfil']);
    authSpy.getUsuario.and.returnValue({ ...USUARIO_MOCK });
    authSpy.actualizarPerfil.and.stub();

    await TestBed.configureTestingModule({
      imports: [PerfilComponent, ReactiveFormsModule, CommonModule, DatePipe]
    })
      .overrideComponent(PerfilComponent, {
        set: { providers: [{ provide: AuthService, useValue: authSpy }] }
      })
      .compileComponents();

    fixture = TestBed.createComponent(PerfilComponent);
    component = fixture.componentInstance;
    (component as any).auth = authSpy;
    fixture.detectChanges();
  });

  it('debería crearse correctamente', () => {
    expect(component).toBeTruthy();
  });

  it('debería cargar los datos del usuario en ngOnInit', () => {
    expect(component.usuario.nombre).toBe('Juan');
    expect(component.usuario.email).toBe('juan@cliente.cl');
  });

  it('debería inicializar el formulario con los datos del usuario', () => {
    expect(component.form.get('nombre')!.value).toBe('Juan');
    expect(component.form.get('apellido')!.value).toBe('Pérez');
    expect(component.form.get('telefono')!.value).toBe('+56912345678');
    expect(component.form.get('direccion')!.value).toBe('Valparaíso, Chile');
  });

  it('debería tener el campo email deshabilitado', () => {
    expect(component.form.get('email')!.disabled).toBeTrue();
  });

  it('debería requerir nombre de al menos 2 caracteres', () => {
    component.form.get('nombre')!.setValue('A');
    expect(component.form.get('nombre')!.hasError('minlength')).toBeTrue();
  });

  it('debería requerir apellido de al menos 2 caracteres', () => {
    component.form.get('apellido')!.setValue('B');
    expect(component.form.get('apellido')!.hasError('minlength')).toBeTrue();
  });

  it('debería requerir dirección de al menos 5 caracteres', () => {
    component.form.get('direccion')!.setValue('abc');
    expect(component.form.get('direccion')!.hasError('minlength')).toBeTrue();
  });

  it('debería validar formato de teléfono', () => {
    component.form.get('telefono')!.setValue('abc');
    expect(component.form.get('telefono')!.hasError('pattern')).toBeTrue();
  });

  it('debería aceptar teléfono válido', () => {
    component.form.get('telefono')!.setValue('+56912345678');
    expect(component.form.get('telefono')!.valid).toBeTrue();
  });

  it('no debería llamar a actualizarPerfil con formulario inválido', () => {
    component.form.get('nombre')!.setValue('');
    component.onSubmit();
    expect(authSpy.actualizarPerfil).not.toHaveBeenCalled();
  });

  it('debería llamar a actualizarPerfil con formulario válido', () => {
    authSpy.getUsuario.and.returnValue({ ...USUARIO_MOCK, nombre: 'Juanito' });
    component.onSubmit();
    expect(authSpy.actualizarPerfil).toHaveBeenCalled();
  });

  it('debería mostrar éxito al guardar perfil y ocultarlo después', (done) => {
    authSpy.getUsuario.and.returnValue({ ...USUARIO_MOCK });
    component.onSubmit();
    expect(component.exito).toBeTrue();
    setTimeout(() => {
      expect(component.exito).toBeFalse();
      done();
    }, 3100);
  });

  it('debería tener getters definidos', () => {
    expect(component.nombre).toBeDefined();
    expect(component.apellido).toBeDefined();
    expect(component.telefono).toBeDefined();
    expect(component.direccion).toBeDefined();
  });
});
