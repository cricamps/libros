import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Subscription } from 'rxjs';
import { ProductoService } from '../../services/producto.service';
import { AuthService } from '../../services/auth.service';
import { Pedido } from '../../models/producto.model';

@Component({
  selector: 'app-mis-pedidos',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './mis-pedidos.component.html'
})
export class MisPedidosComponent implements OnInit, OnDestroy {
  pedidos: Pedido[] = [];
  private sub!: Subscription;

  constructor(
    private productoSvc: ProductoService,
    private auth: AuthService
  ) {}

  ngOnInit(): void {
    const usuario = this.auth.getUsuario()!;
    // Suscripción reactiva: se actualiza cuando se realiza un nuevo pedido
    this.sub = this.productoSvc.getPedidosPorUsuario$(usuario.id)
      .subscribe(pedidos => {
        // Mostrar más recientes primero
        this.pedidos = [...pedidos].sort((a, b) => b.id - a.id);
      });
  }

  ngOnDestroy(): void {
    if (this.sub) this.sub.unsubscribe();
  }

  formatearPrecio(precio: number): string {
    return precio.toLocaleString('es-CL', { style: 'currency', currency: 'CLP' });
  }

  getBadgeClass(estado: string): string {
    const mapa: Record<string, string> = {
      'PENDIENTE':  'bg-warning text-dark',
      'PROCESANDO': 'bg-info text-dark',
      'ENVIADO':    'bg-primary',
      'ENTREGADO':  'bg-success'
    };
    return mapa[estado] || 'bg-secondary';
  }
}
