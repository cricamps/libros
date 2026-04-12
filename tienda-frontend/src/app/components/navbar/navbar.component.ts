// ============================================================
// COMPONENTE: NavbarComponent
// Patrón Observer: suscribe al usuario actual reactivamente
// ============================================================

import { Component, OnInit, OnDestroy } from '@angular/core';
import { RouterLink, RouterLinkActive, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';
import { AuthService } from '../../services/auth.service';
import { ProductoService } from '../../services/producto.service';
import { Usuario } from '../../models/usuario.model';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, CommonModule],
  templateUrl: './navbar.component.html'
})
export class NavbarComponent implements OnInit, OnDestroy {
  usuario: Usuario | null = null;
  cantidadCarrito = 0;
  private subs = new Subscription();

  constructor(
    private auth: AuthService,
    private productoSvc: ProductoService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.subs.add(
      this.auth.getUsuarioActual().subscribe(u => this.usuario = u)
    );
    this.subs.add(
      this.productoSvc.getCarrito().subscribe(items => {
        this.cantidadCarrito = items.reduce((s, i) => s + i.cantidad, 0);
      })
    );
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }

  logout(): void {
    this.auth.logout();
    this.router.navigate(['/login']);
  }

  esAdmin(): boolean {
    return this.auth.esAdmin();
  }
}
