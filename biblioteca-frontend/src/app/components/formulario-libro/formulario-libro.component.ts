// ============================================================
// COMPONENTE: FormularioLibroComponent
// Maneja CREAR (/agregar) y EDITAR (/editar/:id)
// Validaciones según slide 46 del curso:
//   titulo:          required, minlength="2", maxlength="100"
//   autor:           required, minlength="2", maxlength="100"
//   anioPublicacion: required, min="1000",    max="2100"
//   genero:          required, minlength="2", maxlength="50"
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

  modo: 'crear' | 'editar' = 'crear';
  libroId: number | null = null;

  // Valor inicial del año dentro del rango permitido (min 1000, max 2100)
  libro: Libro = {
    titulo: '',
    autor: '',
    anioPublicacion: 2024,
    genero: ''
  };

  cargando    = false;
  guardando   = false;
  mensaje: string | null = null;
  tipoMensaje: 'success' | 'danger' | null = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private libroService: LibroService
  ) {}

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      this.modo    = 'editar';
      this.libroId = Number(idParam);
      this.cargarLibro(this.libroId);
    }
  }

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

  guardar(form: NgForm): void {
    form.form.markAllAsTouched();
    if (form.invalid) {
      this.mensaje     = 'Por favor, completa todos los campos requeridos correctamente.';
      this.tipoMensaje = 'danger';
      return;
    }

    this.guardando = true;
    this.mensaje   = null;

    if (this.modo === 'crear') {
      this.libroService.crear(this.libro).subscribe({
        next: (creado) => {
          this.guardando = false;
          this.router.navigate(['/detalle', creado.id]);
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
          this.router.navigate(['/detalle', actualizado.id]);
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
      this.router.navigate(['/detalle', this.libroId]);
    } else {
      this.router.navigate(['/libros']);
    }
  }
}
