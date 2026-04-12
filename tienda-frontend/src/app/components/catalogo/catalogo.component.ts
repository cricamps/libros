import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { ProductoService } from '../../services/producto.service';
import { Producto } from '../../models/producto.model';

@Component({
  selector: 'app-catalogo',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './catalogo.component.html'
})
export class CatalogoComponent implements OnInit {
  productos: Producto[] = [];
  productosFiltrados: Producto[] = [];
  categorias: string[] = [];
  categoriaSeleccionada = 'Todas';
  busqueda = '';
  ordenPrecio = '';
  agregarExito: number | null = null;

  constructor(private productoSvc: ProductoService) {}

  ngOnInit(): void {
    this.productos = this.productoSvc.getProductosArray();
    this.categorias = ['Todas', ...this.productoSvc.getCategorias()];
    this.filtrar();
  }

  filtrar(): void {
    let resultado = [...this.productos];

    if (this.categoriaSeleccionada !== 'Todas') {
      resultado = resultado.filter(p => p.categoria === this.categoriaSeleccionada);
    }

    if (this.busqueda.trim()) {
      const b = this.busqueda.toLowerCase();
      resultado = resultado.filter(p =>
        p.nombre.toLowerCase().includes(b) ||
        p.descripcion.toLowerCase().includes(b)
      );
    }

    if (this.ordenPrecio === 'asc') {
      resultado.sort((a, b) => a.precio - b.precio);
    } else if (this.ordenPrecio === 'desc') {
      resultado.sort((a, b) => b.precio - a.precio);
    }

    this.productosFiltrados = resultado;
  }

  agregarAlCarrito(producto: Producto): void {
    if (!producto.disponible) return;
    this.productoSvc.agregarAlCarrito(producto, 1);
    this.agregarExito = producto.id;
    setTimeout(() => this.agregarExito = null, 1500);
  }

  formatearPrecio(precio: number): string {
    return precio.toLocaleString('es-CL', { style: 'currency', currency: 'CLP' });
  }
}
