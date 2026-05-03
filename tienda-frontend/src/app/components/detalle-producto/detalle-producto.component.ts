// ============================================================
// COMPONENTE: DetalleProductoComponent
// Muestra el detalle completo de un producto
// Accesible desde catálogo (cliente) y admin
// ============================================================
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ProductoService } from '../../services/producto.service';
import { AuthService } from '../../services/auth.service';
import { Producto } from '../../models/producto.model';

@Component({
  selector: 'app-detalle-producto',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './detalle-producto.component.html'
})
export class DetalleProductoComponent implements OnInit {
  producto: Producto | undefined;
  cantidad = 1;
  agregado = false;
  esAdmin = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private productoSvc: ProductoService,
    private auth: AuthService
  ) {}

  ngOnInit(): void {
    this.esAdmin = this.auth.esAdmin();
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.producto = this.productoSvc.getProductoPorId(id);
    if (!this.producto) {
      // Producto no encontrado → volver
      this.router.navigate([this.esAdmin ? '/admin-productos' : '/catalogo']);
    }
  }

  aumentar(): void {
    if (this.producto && this.cantidad < this.producto.stock) {
      this.cantidad++;
    }
  }

  disminuir(): void {
    if (this.cantidad > 1) this.cantidad--;
  }

  agregarAlCarrito(): void {
    if (!this.producto || !this.producto.disponible) return;
    this.productoSvc.agregarAlCarrito(this.producto, this.cantidad);
    this.agregado = true;
    setTimeout(() => this.agregado = false, 2000);
  }

  irAlCarrito(): void {
    this.router.navigate(['/carrito']);
  }

  volver(): void {
    this.router.navigate([this.esAdmin ? '/admin-productos' : '/catalogo']);
  }

  editarProducto(): void {
    // Navega a admin con el producto pre-seleccionado para edición
    this.router.navigate(['/admin-productos'], { queryParams: { editar: this.producto?.id } });
  }

  formatearPrecio(precio: number): string {
    return precio.toLocaleString('es-CL', { style: 'currency', currency: 'CLP' });
  }
}
