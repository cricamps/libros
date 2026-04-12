import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-recuperar-contrasena',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, RouterLink],
  templateUrl: './recuperar-contrasena.component.html'
})
export class RecuperarContrasenaComponent {
  form: FormGroup;
  paso = 1;        // 1=email, 2=código, 3=nueva password
  error = '';
  codigoGenerado = '';
  mostrarPassword = false;
  mostrarConfirm  = false;

  formCodigo: FormGroup;
  formNueva:  FormGroup;

  constructor(private fb: FormBuilder, private auth: AuthService) {
    this.form = this.fb.group({
      email: ['', [Validators.required, Validators.email]]
    });
    this.formCodigo = this.fb.group({
      codigo: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(6)]]
    });
    this.formNueva = this.fb.group({
      password:         ['', [Validators.required, Validators.minLength(8),
                              Validators.pattern(/^(?=.*[0-9])(?=.*[A-Z])(?=.*[!@#$%^&*]).*$/)]],
      confirmarPassword:['', Validators.required]
    });
  }

  get email()   { return this.form.get('email')!; }
  get codigo()  { return this.formCodigo.get('codigo')!; }
  get nuevaPass() { return this.formNueva.get('password')!; }
  get confirmPass() { return this.formNueva.get('confirmarPassword')!; }

  enviarEmail(): void {
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }
    if (!this.auth.emailExiste(this.email.value)) {
      this.error = 'No existe una cuenta con ese correo.'; return;
    }
    this.error = '';
    this.codigoGenerado = Math.floor(100000 + Math.random() * 900000).toString();
    console.log('Código de recuperación (demo):', this.codigoGenerado);
    this.paso = 2;
  }

  verificarCodigo(): void {
    if (this.formCodigo.invalid) { this.formCodigo.markAllAsTouched(); return; }
    if (this.codigo.value !== this.codigoGenerado) {
      this.error = 'Código incorrecto. Intenta nuevamente.'; return;
    }
    this.error = '';
    this.paso = 3;
  }

  cambiarPassword(): void {
    if (this.formNueva.invalid) { this.formNueva.markAllAsTouched(); return; }
    if (this.nuevaPass.value !== this.confirmPass.value) {
      this.error = 'Las contraseñas no coinciden.'; return;
    }
    this.error = '';
    this.paso = 4;
  }
}
