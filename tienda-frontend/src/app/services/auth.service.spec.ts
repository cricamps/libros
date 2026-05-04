// ============================================================
// PRUEBAS UNITARIAS: AuthService
// Usa HttpClientTestingModule para interceptar llamadas HTTP
// ============================================================
import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { AuthService } from './auth.service';

describe('AuthService', () => {
  let service: AuthService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    sessionStorage.clear();
    TestBed.configureTestingModule({ imports: [HttpClientTestingModule] });
    service = TestBed.inject(AuthService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    sessionStorage.clear();
    httpMock.match(() => true).forEach(r => r.flush({}));
  });

  // ── Instancia ─────────────────────────────────────────────
  it('debería crearse correctamente', () => {
    expect(service).toBeTruthy();
  });

  it('debería iniciar sin usuario logueado', () => {
    expect(service.estaLogueado()).toBeFalse();
    expect(service.getUsuario()).toBeNull();
  });

  it('debería recuperar sesión de sessionStorage si existe', () => {
    const u = { id: 1, nombre: 'Admin', apellido: 'T',
      email: 'admin@test.cl', password: 'x', rol: 'ADMIN' as const };
    sessionStorage.setItem('usuario', JSON.stringify(u));
    TestBed.resetTestingModule();
    TestBed.configureTestingModule({ imports: [HttpClientTestingModule] });
    const svc2 = TestBed.inject(AuthService);
    expect(svc2.estaLogueado()).toBeTrue();
    expect(svc2.getUsuario()?.email).toBe('admin@test.cl');
    TestBed.inject(HttpTestingController).match(() => true).forEach(r => r.flush({}));
  });

  // ── Login ────────────────────────────────────────────────
  it('debería hacer login con credenciales correctas (admin)', () => {
    const ok = service.login('admin@techstore.cl', 'Admin@123');
    expect(ok).toBeTrue();
    expect(service.estaLogueado()).toBeTrue();
    expect(service.esAdmin()).toBeTrue();
  });

  it('debería hacer login con credenciales correctas (cliente)', () => {
    const ok = service.login('juan@cliente.cl', 'Cliente@123');
    expect(ok).toBeTrue();
    expect(service.esAdmin()).toBeFalse();
  });

  it('debería rechazar login con email incorrecto', () => {
    expect(service.login('noexiste@test.cl', 'Admin@123')).toBeFalse();
    expect(service.estaLogueado()).toBeFalse();
  });

  it('debería rechazar login con password incorrecta', () => {
    expect(service.login('admin@techstore.cl', 'wrongpass')).toBeFalse();
  });

  it('debería guardar usuario en sessionStorage al hacer login', () => {
    service.login('admin@techstore.cl', 'Admin@123');
    const guardado = sessionStorage.getItem('usuario');
    expect(guardado).not.toBeNull();
    expect(JSON.parse(guardado!).email).toBe('admin@techstore.cl');
  });

  // ── Logout ───────────────────────────────────────────────
  it('debería hacer logout correctamente', () => {
    service.login('admin@techstore.cl', 'Admin@123');
    service.logout();
    expect(service.estaLogueado()).toBeFalse();
    expect(service.getUsuario()).toBeNull();
  });

  it('debería limpiar sessionStorage al hacer logout', () => {
    service.login('admin@techstore.cl', 'Admin@123');
    service.logout();
    expect(sessionStorage.getItem('usuario')).toBeNull();
  });

  // ── Observable (BehaviorSubject emite síncronamente) ─────
  it('debería emitir el usuario actual mediante observable', () => {
    service.login('juan@cliente.cl', 'Cliente@123');
    // BehaviorSubject emite el valor actual síncronamente al suscribirse
    let usuarioRecibido: any = undefined;
    service.getUsuarioActual().subscribe(u => { usuarioRecibido = u; });
    expect(usuarioRecibido?.email).toBe('juan@cliente.cl');
  });

  it('debería emitir null después del logout', () => {
    service.login('juan@cliente.cl', 'Cliente@123');
    service.logout();
    let usuarioRecibido: any = 'no-inicializado';
    service.getUsuarioActual().subscribe(u => { usuarioRecibido = u; });
    expect(usuarioRecibido).toBeNull();
  });

  // ── Registro ─────────────────────────────────────────────
  it('debería registrar un nuevo usuario correctamente', () => {
    const ok = service.registrar({
      nombre: 'Carlos', apellido: 'Soto',
      email: 'carlos@nuevo.cl', password: 'Carlos@789',
      telefono: '+56911111111', direccion: 'Santiago'
    });
    expect(ok).toBeTrue();
  });

  it('debería poder hacer login después de registrarse', () => {
    service.registrar({ nombre: 'Carlos', apellido: 'Soto',
      email: 'carlos@nuevo.cl', password: 'Carlos@789' });
    expect(service.login('carlos@nuevo.cl', 'Carlos@789')).toBeTrue();
  });

  it('debería rechazar registro con email duplicado', () => {
    expect(service.registrar({ nombre: 'Otro', apellido: 'Admin',
      email: 'admin@techstore.cl', password: 'Admin@999' })).toBeFalse();
  });

  it('debería asignar rol CLIENTE al nuevo usuario', () => {
    service.registrar({ nombre: 'Pedro', apellido: 'López',
      email: 'pedro@nuevo.cl', password: 'Pedro@111' });
    service.login('pedro@nuevo.cl', 'Pedro@111');
    expect(service.esAdmin()).toBeFalse();
    expect(service.getUsuario()?.rol).toBe('CLIENTE');
  });

  // ── Actualizar perfil ─────────────────────────────────────
  it('debería actualizar el perfil del usuario logueado', () => {
    service.login('juan@cliente.cl', 'Cliente@123');
    service.actualizarPerfil({ nombre: 'Juanito', direccion: 'Viña' });
    expect(service.getUsuario()?.nombre).toBe('Juanito');
  });

  it('no debería fallar al actualizar perfil sin usuario logueado', () => {
    expect(() => service.actualizarPerfil({ nombre: 'X' })).not.toThrow();
  });

  // ── Email existe ─────────────────────────────────────────
  it('debería confirmar que el email de admin existe', () => {
    expect(service.emailExiste('admin@techstore.cl')).toBeTrue();
  });

  it('debería retornar false para email inexistente', () => {
    expect(service.emailExiste('noexiste@fake.cl')).toBeFalse();
  });

  // ── Getters ──────────────────────────────────────────────
  it('debería retornar la lista de usuarios', () => {
    expect(service.getUsuarios().length).toBeGreaterThan(0);
  });

  it('debería retornar una copia de la lista', () => {
    expect(service.getUsuarios()).not.toBe(service.getUsuarios());
  });

  it('debería retornar false en esAdmin sin sesión', () => {
    expect(service.esAdmin()).toBeFalse();
  });

  // ── BackEnd HTTP ─────────────────────────────────────────
  it('debería cargar usuarios desde el BackEnd', (done) => {
    service.cargarUsuariosDesdeBackEnd().subscribe(usuarios => {
      expect(usuarios.length).toBeGreaterThan(0);
      done();
    });
    httpMock.expectOne(r => r.url.includes('usuarios'))
      .flush([{ id: 1, nombre: 'Admin', email: 'a@b.cl', rol: 'ADMIN' }]);
  });

  it('debería usar fallback si el BackEnd falla', (done) => {
    service.cargarUsuariosDesdeBackEnd().subscribe(usuarios => {
      expect(usuarios.length).toBeGreaterThan(0);
      done();
    });
    httpMock.expectOne(r => r.url.includes('usuarios'))
      .flush(null, { status: 500, statusText: 'Error' });
  });

  it('debería llamar al BackEnd al hacer login', () => {
    service.login('admin@techstore.cl', 'Admin@123');
    const reqs = httpMock.match(r => r.url.includes('auth/login'));
    expect(reqs.length).toBe(1);
    reqs[0].flush({});
  });

  it('debería llamar al BackEnd al registrar usuario', () => {
    service.registrar({ nombre: 'Test', apellido: 'User',
      email: 'test@nuevo.cl', password: 'Test@123' });
    const reqs = httpMock.match(r => r.url.includes('usuarios'));
    expect(reqs.length).toBe(1);
    reqs[0].flush({});
  });

  it('debería llamar al BackEnd al actualizar perfil', () => {
    service.login('juan@cliente.cl', 'Cliente@123');
    service.actualizarPerfil({ nombre: 'Nuevo' });
    const reqs = httpMock.match(r => r.url.includes('usuarios'));
    expect(reqs.length).toBe(1);
    reqs[0].flush({});
  });
});
