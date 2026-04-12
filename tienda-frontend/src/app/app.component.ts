import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from './components/navbar/navbar.component';
import { AuthService } from './services/auth.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, NavbarComponent, CommonModule],
  template: `
    <app-navbar *ngIf="mostrarNav"></app-navbar>
    <router-outlet></router-outlet>
    <footer class="footer-techstore" *ngIf="mostrarNav">
      <p class="mb-0">© 2025 <span>TechStore</span> — Desarrollo Full Stack III · Duoc UC</p>
    </footer>
  `
})
export class AppComponent implements OnInit {
  mostrarNav = false;

  constructor(private auth: AuthService) {}

  ngOnInit(): void {
    this.auth.getUsuarioActual().subscribe(u => {
      this.mostrarNav = u !== null;
    });
  }
}
