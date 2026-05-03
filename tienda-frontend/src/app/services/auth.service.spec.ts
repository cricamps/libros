// ============================================================
// PRUEBAS UNITARIAS: AuthService
// Cobertura: login, logout, registro, perfil, roles
// ============================================================
import { TestBed } from '@angular/core/testing';
import { AuthService } from './auth.service';

describe('AuthService', () => {
  let service: AuthService;

  beforeEach(() => {
    sessionStorage.clear();
    TestBed.configureTestingModule({});
    service = TestBed.inject(AuthService);
  });

  afterEach(() => {
    sessionStorage.clear();
  });

  // ── Instancia ────────────────────────────────────────────────
  it('debería crearse correctamente', () => {
    expect(service).toBeTruthy();
  });

  // ── Estado inicial ───────────────────────────────────────────
  it('debería iniciar sin usuario logueado', () => {
    expect(service.estaLogueado()).toBeFalse();
    expect(service.getUsuario()).toBeNull();
  });

  it('debería recuperar sesión de sessionStorage si existe', () => {
    const usuario = { id: 1, nombre: 'Admin', apellido: 'Test', email: 'admin@test.cl', password: 'Admin@123', rol: 'ADMIN' as const };
    sessionStorage.setItem('usuario', JSON.stringify(usuario));
    // Recrear el servicio para que lea sessionStorage en el constructor
    TestBed.resetTestingModule();
    TestBed.configureTestingModule({});
    const svc2 = TestBed.inject(AuthService);
    expect(svc2.estaLogueado()).toBeTrue();
    expect(svc2.getUsuario()?.email).toBe('admin@test.cl');
  });

  // ── Login ────────────────────────────────────────────────────
  it('debería hacer login con credenciales correctas (admin)', () => {
    const ok = service.login('admin@techstore.cl', 'Admin@123');
    expect(ok).toBeTrue();
    expect(service.estaLogueado()).toBeTrue();
    expect(service.esAdmin()).toBeTrue();
  });

  it('debería hacer login con credenciales correctas (cliente)', () => {
    const ok = service.login('juan@cliente.cl', 'Cliente@123');
    expect(ok).toBeTrue();
    expect(service.estaLogueado()).toBeTrue();
    expect(service.esAdmin()).toBeFalse();
  });

  it('debería rechazar login con email incorrecto', () => {
    const ok = service.login('noexiste@test.cl', 'Admin@123');
    expect(ok).toBeFalse();
    expect(service.estaLogueado()).toBeFalse();
  });

  it('debería rechazar login con password incorrecta', () => {
    const ok = service.login('admin@techstore.cl', 'wrongpass');
    expect(ok).toBeFalse();
    expect(service.estaLogueado()).toBeFalse();
  });

  it('debería guardar usuario en sessionStorage al hacer login', () => {
    service.login('admin@techstore.cl', 'Admin@123');
    const guardado = sessionStorage.getItem('usuario');
    expect(guardado).not.toBeNull();
    const parsed = JSON.parse(guardado!);
    expect(parsed.email).toBe('admin@techstore.cl');
  });

  // ── Logout ───────────────────────────────────────────────────
  it('debería hacer logout correctamente', () => {
    service.login('admin@techstore.cl', 'Admin@123');
    expect(service.estaLogueado()).toBeTrue();
    service.logout();
    expect(service.estaLogueado()).toBeFalse();
    expect(service.getUsuario()).toBeNull();
  });

  it('debería limpiar sessionStorage al hacer logout', () => {
    service.login('admin@techstore.cl', 'Admin@123');
    service.logout();
    expect(sessionStorage.getItem('usuario')).toBeNull();
  });

  // ── Observable ───────────────────────────────────────────────
  it('debería emitir el usuario actual mediante observable', (done) => {
    service.login('juan@cliente.cl', 'Cliente@123');
    service.getUsuarioActual().subscribe(usuario => {
      expect(usuario?.email).toBe('juan@cliente.cl');
      done();
    });
  });

  it('debería emitir null después del logout mediante observable', (done) => {
    service.login('juan@cliente.cl', 'Cliente@123');
    service.logout();
    service.getUsuarioActual().subscribe(usuario => {
      expect(usuario).toBeNull();
      done();
    });
  });

  // ── Registro ─────────────────────────────────────────────────
  it('debería registrar un nuevo usuario correctamente', () => {
    const ok = service.registrar({
      nombre: 'Carlos',
      apellido: 'Soto',
      email: 'carlos@nuevo.cl',
      password: 'Carlos@789',
      telefono: '+56911111111',
      direccion: 'Santiago, Chile'
    });
    expect(ok).toBeTrue();
  });

  it('debería poder hacer login después de registrarse', () => {
    service.registrar({
      nombre: 'Carlos',
      apellido: 'Soto',
      email: 'carlos@nuevo.cl',
      password: 'Carlos@789',
      telefono: '+56911111111',
      direccion: 'Santiago, Chile'
    });
    const ok = service.login('carlos@nuevo.cl', 'Carlos@789');
    expect(ok).toBeTrue();
  });

  it('debería rechazar registro con email duplicado', () => {
    const ok = service.registrar({
      nombre: 'Otro',
      apellido: 'Admin',
      email: 'admin@techstore.cl', // ya existe
      password: 'Admin@999'
    });
    expect(ok).toBeFalse();
  });

  it('debería asignar rol CLIENTE al nuevo usuario', () => {
    service.registrar({
      nombre: 'Pedro',
      apellido: 'López',
      email: 'pedro@nuevo.cl',
      password: 'Pedro@111'
    });
    service.login('pedro@nuevo.cl', 'Pedro@111');
    expect(service.esAdmin()).toBeFalse();
    expect(service.getUsuario()?.rol).toBe('CLIENTE');
  });

  // ── Actualizar perfil ─────────────────────────────────────────
  it('debería actualizar el perfil del usuario logueado', () => {
    service.login('juan@cliente.cl', 'Cliente@123');
    service.actualizarPerfil({ nombre: 'Juanito', direccion: 'Viña del Mar, Chile' });
    expect(service.getUsuario()?.nombre).toBe('Juanito');
    expect(service.getUsuario()?.direccion).toBe('Viña del Mar, Chile');
  });

  it('no debería fallar al actualizar perfil sin usuario logueado', () => {
    expect(() => service.actualizarPerfil({ nombre: 'X' })).not.toThrow();
  });

  // ── Recuperar contraseña ──────────────────────────────────────
  it('debería confirmar que el email de admin existe', () => {
    expect(service.emailExiste('admin@techstore.cl')).toBeTrue();
  });

  it('debería retornar false para email inexistente', () => {
    expect(service.emailExiste('noexiste@fake.cl')).toBeFalse();
  });

  // ── Lista de usuarios ─────────────────────────────────────────
  it('debería retornar la lista de usuarios', () => {
    const usuarios = service.getUsuarios();
    expect(usuarios.length).toBeGreaterThan(0);
  });

  it('debería retornar una copia de la lista de usuarios', () => {
    const u1 = service.getUsuarios();
    const u2 = service.getUsuarios();
    expect(u1).not.toBe(u2); // diferente referencia (copia)
  });

  // ── esAdmin ───────────────────────────────────────────────────
  it('debería retornar false en esAdmin sin sesión activa', () => {
    expect(service.esAdmin()).toBeFalse();
  });
});
