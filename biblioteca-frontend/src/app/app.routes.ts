// ============================================================
// RUTAS DE LA APLICACIÓN
// Define la navegación entre los componentes (capa Controlador del MVC)
// ============================================================

import { Routes } from '@angular/router';
import { ListaLibrosComponent }     from './components/lista-libros/lista-libros.component';
import { DetalleLibroComponent }    from './components/detalle-libro/detalle-libro.component';
import { FormularioLibroComponent } from './components/formulario-libro/formulario-libro.component';

export const routes: Routes = [
  // Ruta raíz → redirige al listado de libros
  { path: '', redirectTo: 'libros', pathMatch: 'full' },

  // Listado de todos los libros (Vista principal)
  { path: 'libros', component: ListaLibrosComponent },

  // Formulario para crear un nuevo libro (debe ir ANTES de :id)
  { path: 'libros/nuevo', component: FormularioLibroComponent },

  // Detalle de un libro específico por ID
  { path: 'libros/:id', component: DetalleLibroComponent },

  // Formulario para editar un libro existente
  { path: 'libros/:id/editar', component: FormularioLibroComponent },

  // Cualquier ruta desconocida redirige al inicio
  { path: '**', redirectTo: 'libros' }
];
