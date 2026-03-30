// ============================================================
// COMPONENTE: ListaLibrosComponent
// Vista principal que muestra todos los libros de la biblioteca.
// Patrón Observer: se suscribe al Observable del servicio.
// Patrón MVC (Vista): delega la lógica al servicio (Facade).
// ============================================================

import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';

import { LibroService } from '../../services/libro.service';
import { Libro }        from '../../models/libro.model';

@Component({
  selector: 'app-lista-libros',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './lista-libros.component.html',
  styleUrls: ['./lista-libros.component.css']
})
export class ListaLibrosComponent implements OnInit, OnDestroy {

  libros: Libro[] = [];
  cargando = false;
  mensaje: string | null = null;
  tipoMensaje: 'success' | 'danger' | null = null;

  private suscripcion?: Subscription;

  constructor(
    private libroService: LibroService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.cargarLibros();
  }

  ngOnDestroy(): void {
    this.suscripcion?.unsubscribe();
  }

  // Patrón Observer: .subscribe() reacciona cuando llegan los datos
  cargarLibros(): void {
    this.cargando = true;
    this.mensaje  = null;

    this.suscripcion = this.libroService.obtenerTodos().subscribe({
      next: (libros) => {
        this.libros   = libros;
        this.cargando = false;
      },
      error: (error: Error) => {
        this.mensaje     = error.message;
        this.tipoMensaje = 'danger';
        this.cargando    = false;
      }
    });
  }

  // Navega a /editar/:id
  editarLibro(id: number): void {
    this.router.navigate(['/editar', id]);
  }

  // Navega a /detalle/:id
  verDetalle(id: number): void {
    this.router.navigate(['/detalle', id]);
  }

  // Elimina un libro previa confirmación
  eliminarLibro(id: number, titulo: string): void {
    if (!confirm(`¿Estás seguro de que deseas eliminar "${titulo}"?`)) {
      return;
    }

    this.libroService.eliminar(id).subscribe({
      next: () => {
        this.libros      = this.libros.filter(l => l.id !== id);
        this.mensaje     = `El libro "${titulo}" fue eliminado correctamente.`;
        this.tipoMensaje = 'success';
        setTimeout(() => { this.mensaje = null; }, 3000);
      },
      error: (error: Error) => {
        this.mensaje     = error.message;
        this.tipoMensaje = 'danger';
      }
    });
  }
}
