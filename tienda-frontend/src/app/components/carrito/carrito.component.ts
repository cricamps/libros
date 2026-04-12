import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Subscription } from 'rxjs';
import { ProductoService } from '../../services/producto.service';
import { AuthService } from '../../services/auth.service';
import { ItemCarrito } from '../../models/producto.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-carrito',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './carrito.component.html'
})
export class CarritoComponent implements OnInit, OnDestroy {
  items: ItemCarrito[] = [];
  pedidoRealizado = false;
  numeroPedido = 0;
  private sub!: Subscription;

  constructor(
    private productoSvc: ProductoService,
    private auth: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.sub = this.productoSvc.getCarrito().subscribe(i => this.items = i);
  }

  ngOnDestroy(): void { this.sub.unsubscribe(); }

  getTotal(): number   { return this.productoSvc.getTotalCarrito(); }

  cambiarCantidad(id: number, cantidad: number): void {
    this.productoSvc.actualizarCantidad(id, cantidad);
  }

  quitar(id: number): void { this.productoSvc.quitarDelCarrito(id); }

  confirmarPedido(): void {
    const usuario = this.auth.getUsuario()!;
    const pedido = this.productoSvc.realizarPedido(usuario.id);
    if (pedido) {
      this.numeroPedido = pedido.id;
      this.pedidoRealizado = true;
    }
  }

  seguirComprando(): void { this.router.navigate(['/catalogo']); }

  formatearPrecio(precio: number): string {
    return precio.toLocaleString('es-CL', { style: 'currency', currency: 'CLP' });
  }
}
