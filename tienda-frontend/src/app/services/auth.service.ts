// ============================================================
// SERVICIO: AuthService
// Patrón Singleton (providedIn: 'root')
// Patrón Observer (BehaviorSubject)
// Conectado a BackEnd Spring Boot puerto 8081
// Fallback a datos estáticos si el BackEnd no está disponible
// ============================================================

import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { Usuario } from '../models/usuario.model';

@Injectable({ providedIn: 'root' })
export class AuthService {

  private readonly API = 'http://localhost:8081/api';

  // Fallback: datos estáticos cuando el BackEnd no está disponible
  private usuarios: Usuario[] = [
    { id: 1, nombre: 'Admin', apellido: 'TechStore', email: 'admin@techstore.cl',
      password: 'Admin@123', rol: 'ADMIN', telefono: '+56912345678',
      direccion: 'Santiago, Chile', fechaRegistro: '2026-01-15' },
    { id: 2, nombre: 'Juan', apellido: 'Pérez', email: 'juan@cliente.cl',
      password: 'Cliente@123', rol: 'CLIENTE', telefono: '+56987654321',
      direccion: 'Valparaíso, Chile', fechaRegistro: '2026-03-20' },
    { id: 3, nombre: 'María', apellido: 'González', email: 'maria@cliente.cl',
      password: 'Maria@456!', rol: 'CLIENTE', telefono: '+56955555555',
      direccion: 'Concepción, Chile', fechaRegistro: '2026-05-10' }
  ];

  private usuarioActual$ = new BehaviorSubject<Usuario | null>(null);

  constructor(private readonly http: HttpClient) {
    const guardado = sessionStorage.getItem('usuario');
    if (guardado) {
      this.usuarioActual$.next(JSON.parse(guardado));
    }
  }

  getUsuarioActual(): Observable<Usuario | null> {
    return this.usuarioActual$.asObservable();
  }

  getUsuario(): Usuario | null {
    return this.usuarioActual$.getValue();
  }

  estaLogueado(): boolean {
    return this.usuarioActual$.getValue() !== null;
  }

  esAdmin(): boolean {
    return this.usuarioActual$.getValue()?.rol === 'ADMIN';
  }

  // ── Login: intenta BackEnd, fallback a datos estáticos ──────
  login(email: string, password: string): boolean {
    // Intento en BackEnd (asíncrono, para registro en Oracle)
    this.http.post<Usuario>(`${this.API}/auth/login`, { email, password })
      .pipe(catchError(() => of(null)))
      .subscribe(u => {
        if (u) {
          this.usuarioActual$.next(u);
          sessionStorage.setItem('usuario', JSON.stringify(u));
        }
      });

    // Respuesta sincrónica con datos estáticos (UX inmediata)
    const usuario = this.usuarios.find(
      u => u.email === email && u.password === password
    );
    if (usuario) {
      this.usuarioActual$.next(usuario);
      sessionStorage.setItem('usuario', JSON.stringify(usuario));
      return true;
    }
    return false;
  }

  logout(): void {
    this.usuarioActual$.next(null);
    sessionStorage.removeItem('usuario');
  }

  // ── Registro: BackEnd + fallback estático ───────────────────
  registrar(datos: Omit<Usuario, 'id' | 'rol' | 'fechaRegistro'>): boolean {
    const existe = this.usuarios.find(u => u.email === datos.email);
    if (existe) return false;

    const nuevo: Usuario = {
      ...datos,
      id: this.usuarios.length + 1,
      rol: 'CLIENTE',
      fechaRegistro: new Date().toISOString().split('T')[0]
    };
    this.usuarios.push(nuevo);

    // Registrar también en BackEnd Oracle
    this.http.post<Usuario>(`${this.API}/usuarios`, nuevo)
      .pipe(catchError(() => of(null)))
      .subscribe();

    return true;
  }

  actualizarPerfil(datos: Partial<Usuario>): void {
    const actual = this.getUsuario();
    if (!actual) return;

    const idx = this.usuarios.findIndex(u => u.id === actual.id);
    if (idx !== -1) {
      this.usuarios[idx] = { ...this.usuarios[idx], ...datos };
      this.usuarioActual$.next(this.usuarios[idx]);
      sessionStorage.setItem('usuario', JSON.stringify(this.usuarios[idx]));

      // Actualizar en BackEnd Oracle
      this.http.put<Usuario>(`${this.API}/usuarios/${actual.id}`, this.usuarios[idx])
        .pipe(catchError(() => of(null)))
        .subscribe();
    }
  }

  emailExiste(email: string): boolean {
    return this.usuarios.some(u => u.email === email);
  }

  getUsuarios(): Usuario[] {
    return [...this.usuarios];
  }

  // ── Cargar usuarios desde BackEnd ────────────────────────────
  cargarUsuariosDesdeBackEnd(): Observable<Usuario[]> {
    return this.http.get<Usuario[]>(`${this.API}/usuarios`)
      .pipe(
        tap(usuarios => { if (usuarios?.length) this.usuarios = usuarios; }),
        catchError(() => of(this.usuarios))
      );
  }
}
