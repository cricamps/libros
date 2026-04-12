// ============================================================
// COMPONENTE: RegistroComponent
// Validaciones: nombre, email, password (4 reglas de seguridad),
// confirmar password, teléfono, dirección
// ============================================================

import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl, ValidationErrors, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';

// Validador personalizado: coincidencia de passwords
function passwordsIguales(control: AbstractControl): ValidationErrors | null {
  const pass = control.get('password')?.value;
  const confirm = control.get('confirmarPassword')?.value;
  return pass === confirm ? null : { noCoinciden: true };
}

// Validador: fortaleza de contraseña
function passwordSegura(control: AbstractControl): ValidationErrors | null {
  const v = control.value || '';
  const errores: any = {};
  if (v.length < 8)                    errores['minLength'] = true;
  if (v.length > 20)                   errores['maxLength'] = true;
  if (!/[0-9]/.test(v))               errores['sinNumero'] = true;
  if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(v)) errores['sinEspecial'] = true;
  if (!/[A-Z]/.test(v))               errores['sinMayuscula'] = true;
  return Object.keys(errores).length ? errores : null;
}

@Component({
  selector: 'app-registro',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, RouterLink],
  templateUrl: './registro.component.html'
})
export class RegistroComponent {
  form: FormGroup;
  error = '';
  exito = false;
  mostrarPassword = false;
  mostrarConfirm = false;

  constructor(
    private fb: FormBuilder,
    private auth: AuthService,
    private router: Router
  ) {
    this.form = this.fb.group({
      nombre:    ['', [Validators.required, Validators.minLength(2)]],
      apellido:  ['', [Validators.required, Validators.minLength(2)]],
      email:     ['', [Validators.required, Validators.email]],
      telefono:  ['', [Validators.pattern(/^\+?[0-9]{8,12}$/)]],
      direccion: ['', [Validators.required, Validators.minLength(5)]],
      password:  ['', [Validators.required, passwordSegura]],
      confirmarPassword: ['', Validators.required]
    }, { validators: passwordsIguales });
  }

  get nombre()    { return this.form.get('nombre')!; }
  get apellido()  { return this.form.get('apellido')!; }
  get email()     { return this.form.get('email')!; }
  get telefono()  { return this.form.get('telefono')!; }
  get direccion() { return this.form.get('direccion')!; }
  get password()  { return this.form.get('password')!; }
  get confirmarPassword() { return this.form.get('confirmarPassword')!; }

  getFuerzaPassword(): number {
    const v = this.password.value || '';
    let score = 0;
    if (v.length >= 8)   score++;
    if (/[0-9]/.test(v)) score++;
    if (/[A-Z]/.test(v)) score++;
    if (/[!@#$%^&*]/.test(v)) score++;
    return score;
  }

  getFuerzaColor(): string {
    const s = this.getFuerzaPassword();
    if (s <= 1) return '#e74c3c';
    if (s === 2) return '#f39c12';
    if (s === 3) return '#f1c40f';
    return '#2ecc71';
  }

  getFuerzaTexto(): string {
    const s = this.getFuerzaPassword();
    if (s <= 1) return 'Muy débil';
    if (s === 2) return 'Débil';
    if (s === 3) return 'Buena';
    return 'Fuerte';
  }

  onSubmit(): void {
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }
    this.error = '';

    const ok = this.auth.registrar({
      nombre:    this.nombre.value,
      apellido:  this.apellido.value,
      email:     this.email.value,
      password:  this.password.value,
      telefono:  this.telefono.value,
      direccion: this.direccion.value
    });

    if (ok) {
      this.exito = true;
      setTimeout(() => this.router.navigate(['/login']), 2000);
    } else {
      this.error = 'El correo ingresado ya está registrado.';
    }
  }
}
