// ============================================================
// COMPONENTE: DetalleLibroComponent
// Muestra la información completa de un libro específico.
// Ruta: /detalle/:id
// ============================================================

import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';

import { LibroService } from '../../services/libro.service';
import { Libro }        from '../../models/libro.model';

@Component({
  selector: 'app-detalle-libro',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './detalle-libro.component.html',
  styleUrls: ['./detalle-libro.component.css']
})
export class DetalleLibroComponent implements OnInit {

  libro: Libro | null = null;
  cargando = false;
  error: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private libroService: LibroService
  ) {}

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    if (isNaN(id) || id <= 0) {
      this.error = 'ID de libro inválido.';
      return;
    }
    this.cargarLibro(id);
  }

  cargarLibro(id: number): void {
    this.cargando = true;
    this.libroService.obtenerPorId(id).subscribe({
      next: (libro) => {
        this.libro    = libro;
        this.cargando = false;
      },
      error: (error: Error) => {
        this.error    = error.message;
        this.cargando = false;
      }
    });
  }

  // Navega a /editar/:id
  editar(): void {
    this.router.navigate(['/editar', this.libro!.id]);
  }

  eliminar(): void {
    if (!confirm(`¿Eliminar "${this.libro!.titulo}"? Esta acción no se puede deshacer.`)) {
      return;
    }
    this.libroService.eliminar(this.libro!.id!).subscribe({
      next: () => this.router.navigate(['/libros']),
      error: (error: Error) => { this.error = error.message; }
    });
  }

  volver(): void {
    this.router.navigate(['/libros']);
  }
}
