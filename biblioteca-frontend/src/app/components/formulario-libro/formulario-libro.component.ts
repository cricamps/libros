// ============================================================
// COMPONENTE: FormularioLibroComponent
//
// Maneja dos casos de uso: CREAR (POST) y EDITAR (PUT).
// Determina el modo según si la URL contiene un :id o no.
//
// Patrón Observer: se suscribe a los Observables del servicio.
// Patrón MVC (Vista): recibe inputs del usuario y delega la
//   persistencia al servicio Facade.
// ============================================================

import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';

import { LibroService } from '../../services/libro.service';
import { Libro }        from '../../models/libro.model';

@Component({
  selector: 'app-formulario-libro',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './formulario-libro.component.html',
  styleUrls: ['./formulario-libro.component.css']
})
export class FormularioLibroComponent implements OnInit {

  // Modo del formulario: 'crear' o 'editar'
  modo: 'crear' | 'editar' = 'crear';

  // ID del libro a editar (solo en modo editar)
  libroId: number | null = null;

  // Objeto enlazado bidirecionalmente con el formulario (two-way binding)
  libro: Libro = {
    titulo: '',
    autor: '',
    anioPublicacion: new Date().getFullYear(),
    genero: ''
  };

  cargando    = false;
  guardando   = false;
  mensaje: string | null = null;
  tipoMensaje: 'success' | 'danger' | null = null;

  // Géneros disponibles para el selector
  readonly generos = [
    'Ciencia Ficción', 'Fantasía', 'Terror', 'Romance',
    'Misterio', 'Thriller', 'Historia', 'Biografía',
    'Ciencia', 'Filosofía', 'Poesía', 'Drama',
    'Aventura', 'Humor', 'Infantil', 'Otro'
  ];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private libroService: LibroService
  ) {}

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');

    if (idParam) {
      // Modo EDITAR: carga los datos actuales del libro
      this.modo    = 'editar';
      this.libroId = Number(idParam);
      this.cargarLibro(this.libroId);
    }
    // Sin :id → modo CREAR, formulario vacío
  }

  // Patrón Observer: .subscribe() rellena el formulario con los datos actuales
  cargarLibro(id: number): void {
    this.cargando = true;

    this.libroService.obtenerPorId(id).subscribe({
      next: (libro) => {
        this.libro    = { ...libro };
        this.cargando = false;
      },
      error: (error: Error) => {
        this.mensaje     = error.message;
        this.tipoMensaje = 'danger';
        this.cargando    = false;
      }
    });
  }

  // ============================================================
  // Maneja el envío del formulario: POST (crear) o PUT (actualizar)
  // ============================================================
  guardar(form: NgForm): void {
    form.form.markAllAsTouched();

    if (form.invalid) {
      this.mensaje     = 'Por favor, completa todos los campos requeridos.';
      this.tipoMensaje = 'danger';
      return;
    }

    this.guardando = true;
    this.mensaje   = null;

    if (this.modo === 'crear') {
      this.libroService.crear(this.libro).subscribe({
        next: (creado) => {
          this.guardando = false;
          this.router.navigate(['/libros', creado.id]);
        },
        error: (error: Error) => {
          this.mensaje     = error.message;
          this.tipoMensaje = 'danger';
          this.guardando   = false;
        }
      });
    } else {
      this.libroService.actualizar(this.libroId!, this.libro).subscribe({
        next: (actualizado) => {
          this.guardando = false;
          this.router.navigate(['/libros', actualizado.id]);
        },
        error: (error: Error) => {
          this.mensaje     = error.message;
          this.tipoMensaje = 'danger';
          this.guardando   = false;
        }
      });
    }
  }

  cancelar(): void {
    if (this.modo === 'editar') {
      this.router.navigate(['/libros', this.libroId]);
    } else {
      this.router.navigate(['/libros']);
    }
  }
}
