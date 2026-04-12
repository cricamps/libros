// ============================================================
// RUTAS - app.routes.ts
// Patrón MVC: capa Controlador de navegación
// ============================================================

import { Routes } from '@angular/router';
import { authGuard, adminGuard } from './guards/auth.guard';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },

  // Públicas
  { path: 'login',               loadComponent: () => import('./components/login/login.component').then(m => m.LoginComponent) },
  { path: 'registro',            loadComponent: () => import('./components/registro/registro.component').then(m => m.RegistroComponent) },
  { path: 'recuperar-contrasena',loadComponent: () => import('./components/recuperar-contrasena/recuperar-contrasena.component').then(m => m.RecuperarContrasenaComponent) },

  // Protegidas (cualquier usuario logueado)
  { path: 'catalogo',     canActivate: [authGuard], loadComponent: () => import('./components/catalogo/catalogo.component').then(m => m.CatalogoComponent) },
  { path: 'carrito',      canActivate: [authGuard], loadComponent: () => import('./components/carrito/carrito.component').then(m => m.CarritoComponent) },
  { path: 'mis-pedidos',  canActivate: [authGuard], loadComponent: () => import('./components/mis-pedidos/mis-pedidos.component').then(m => m.MisPedidosComponent) },
  { path: 'perfil',       canActivate: [authGuard], loadComponent: () => import('./components/perfil/perfil.component').then(m => m.PerfilComponent) },

  // Solo ADMIN
  { path: 'admin-productos', canActivate: [authGuard, adminGuard], loadComponent: () => import('./components/admin-productos/admin-productos.component').then(m => m.AdminProductosComponent) },

  { path: '**', redirectTo: 'login' }
];
