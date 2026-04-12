// ============================================================
// SERVICIO: AuthService
// Patrón Singleton (providedIn: 'root')
// Patrón Observer (BehaviorSubject)
// Gestiona autenticación con datos estáticos (listas/arreglos)
// ============================================================

import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Usuario } from '../models/usuario.model';

@Injectable({ providedIn: 'root' })
export class AuthService {

  // ── Datos estáticos: lista de usuarios registrados ──────────
  private usuarios: Usuario[] = [
    {
      id: 1,
      nombre: 'Admin',
      apellido: 'TechStore',
      email: 'admin@techstore.cl',
      password: 'Admin@123',
      rol: 'ADMIN',
      telefono: '+56912345678',
      direccion: 'Santiago, Chile',
      fechaRegistro: '2024-01-15'
    },
    {
      id: 2,
      nombre: 'Juan',
      apellido: 'Pérez',
      email: 'juan@cliente.cl',
      password: 'Cliente@123',
      rol: 'CLIENTE',
      telefono: '+56987654321',
      direccion: 'Valparaíso, Chile',
      fechaRegistro: '2024-03-20'
    },
    {
      id: 3,
      nombre: 'María',
      apellido: 'González',
      email: 'maria@cliente.cl',
      password: 'Maria@456!',
      rol: 'CLIENTE',
      telefono: '+56955555555',
      direccion: 'Concepción, Chile',
      fechaRegistro: '2024-05-10'
    }
  ];

  // ── Observer: estado actual del usuario logueado ─────────────
  private usuarioActual$ = new BehaviorSubject<Usuario | null>(null);

  // ── Singleton: instancia única gestionada por Angular ────────
  constructor() {
    // Recuperar sesión guardada (si existe)
    const guardado = sessionStorage.getItem('usuario');
    if (guardado) {
      this.usuarioActual$.next(JSON.parse(guardado));
    }
  }

  // Expone el observable del usuario actual
  getUsuarioActual(): Observable<Usuario | null> {
    return this.usuarioActual$.asObservable();
  }

  // Retorna el valor sincrónico actual
  getUsuario(): Usuario | null {
    return this.usuarioActual$.getValue();
  }

  // Verifica si hay sesión activa
  estaLogueado(): boolean {
    return this.usuarioActual$.getValue() !== null;
  }

  // Verifica rol ADMIN
  esAdmin(): boolean {
    return this.usuarioActual$.getValue()?.rol === 'ADMIN';
  }

  // ── Login: busca en la lista estática ───────────────────────
  login(email: string, password: string): boolean {
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

  // ── Logout ──────────────────────────────────────────────────
  logout(): void {
    this.usuarioActual$.next(null);
    sessionStorage.removeItem('usuario');
  }

  // ── Registro: agrega a la lista estática ────────────────────
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
    return true;
  }

  // ── Actualizar perfil ────────────────────────────────────────
  actualizarPerfil(datos: Partial<Usuario>): void {
    const actual = this.getUsuario();
    if (!actual) return;

    const idx = this.usuarios.findIndex(u => u.id === actual.id);
    if (idx !== -1) {
      this.usuarios[idx] = { ...this.usuarios[idx], ...datos };
      this.usuarioActual$.next(this.usuarios[idx]);
      sessionStorage.setItem('usuario', JSON.stringify(this.usuarios[idx]));
    }
  }

  // ── Recuperar contraseña: verifica si el email existe ───────
  emailExiste(email: string): boolean {
    return this.usuarios.some(u => u.email === email);
  }

  // ── Obtener todos los usuarios (solo ADMIN) ──────────────────
  getUsuarios(): Usuario[] {
    return [...this.usuarios];
  }
}
