// ============================================================
// COMPONENTE: LoginComponent
// Patrón MVC - capa Vista + Controlador
// Validaciones: email requerido, password con 4 reglas
// ============================================================

import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, RouterLink],
  templateUrl: './login.component.html'
})
export class LoginComponent {
  form: FormGroup;
  error = '';
  mostrarPassword = false;
  cargando = false;

  constructor(
    private fb: FormBuilder,
    private auth: AuthService,
    private router: Router
  ) {
    // Si ya está logueado, redirigir
    if (this.auth.estaLogueado()) {
      this.router.navigate(['/catalogo']);
    }

    this.form = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  get email() { return this.form.get('email')!; }
  get password() { return this.form.get('password')!; }

  onSubmit(): void {
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }
    this.cargando = true;
    this.error = '';

    setTimeout(() => {
      const ok = this.auth.login(this.email.value, this.password.value);
      this.cargando = false;
      if (ok) {
        this.router.navigate(['/catalogo']);
      } else {
        this.error = 'Email o contraseña incorrectos. Intenta de nuevo.';
      }
    }, 600);
  }

  togglePassword(): void {
    this.mostrarPassword = !this.mostrarPassword;
  }
}
