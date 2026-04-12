import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ProductoService } from '../../services/producto.service';
import { AuthService } from '../../services/auth.service';
import { Pedido } from '../../models/producto.model';

@Component({
  selector: 'app-mis-pedidos',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './mis-pedidos.component.html'
})
export class MisPedidosComponent implements OnInit {
  pedidos: Pedido[] = [];

  constructor(
    private productoSvc: ProductoService,
    private auth: AuthService
  ) {}

  ngOnInit(): void {
    const usuario = this.auth.getUsuario()!;
    this.pedidos = this.productoSvc.getPedidosPorUsuario(usuario.id);
  }

  formatearPrecio(precio: number): string {
    return precio.toLocaleString('es-CL', { style: 'currency', currency: 'CLP' });
  }

  getBadgeClass(estado: string): string {
    const mapa: any = {
      'PENDIENTE':  'bg-warning text-dark',
      'PROCESANDO': 'bg-info text-dark',
      'ENVIADO':    'bg-primary',
      'ENTREGADO':  'bg-success'
    };
    return mapa[estado] || 'bg-secondary';
  }
}
