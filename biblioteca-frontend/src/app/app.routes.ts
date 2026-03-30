// ============================================================
// RUTAS DE LA APLICACIÓN - Semana 3
// Define la navegación entre los componentes (capa Controlador del MVC)
// Rutas alineadas con el estándar del curso DSY2205
// ============================================================

import { Routes } from '@angular/router';
import { ListaLibrosComponent }     from './components/lista-libros/lista-libros.component';
import { DetalleLibroComponent }    from './components/detalle-libro/detalle-libro.component';
import { FormularioLibroComponent } from './components/formulario-libro/formulario-libro.component';

export const routes: Routes = [
  // Ruta raíz → redirige al listado de libros
  { path: '', redirectTo: 'libros', pathMatch: 'full' },

  // GET ALL → Lista completa de libros
  { path: 'libros', component: ListaLibrosComponent },

  // POST → Formulario para crear un nuevo libro
  { path: 'agregar', component: FormularioLibroComponent },

  // PUT → Formulario para editar un libro existente
  { path: 'editar/:id', component: FormularioLibroComponent },

  // GET BY ID → Detalle de un libro específico
  { path: 'detalle/:id', component: DetalleLibroComponent },

  // Cualquier ruta desconocida redirige al inicio
  { path: '**', redirectTo: 'libros' }
];
