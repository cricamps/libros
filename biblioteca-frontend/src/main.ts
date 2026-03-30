// Punto de entrada principal de la aplicación Angular
// Patrón Singleton: bootstrapApplication garantiza una sola instancia del módulo raíz
import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { appConfig } from './app/app.config';

// Inicializa la aplicación con la configuración definida en app.config.ts
bootstrapApplication(AppComponent, appConfig)
  .catch((err) => console.error(err));
