// ============================================================
// CONFIGURACIÓN GLOBAL DE LA APLICACIÓN
// Registra los proveedores principales: router y HttpClient
// ============================================================

import { ApplicationConfig } from '@angular/core';
import { provideRouter }     from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { routes }            from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    // Habilita el sistema de rutas con la configuración definida
    provideRouter(routes),

    // Habilita HttpClient para realizar peticiones HTTP al microservicio
    provideHttpClient()
  ]
};
