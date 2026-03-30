// ============================================================
// COMPONENTE RAÍZ: AppComponent
// Es la entrada principal de la vista (capa Vista del MVC).
// Contiene la barra de navegación y el router-outlet.
// ============================================================

import { Component } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'Biblioteca - Gestión de Libros';
}
