import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule, DatePipe } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { Usuario } from '../../models/usuario.model';

@Component({
  selector: 'app-perfil',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, DatePipe],
  templateUrl: './perfil.component.html'
})
export class PerfilComponent implements OnInit {
  form!: FormGroup;
  usuario!: Usuario;
  exito = false;
  error = '';

  constructor(private fb: FormBuilder, private auth: AuthService) {}

  ngOnInit(): void {
    this.usuario = this.auth.getUsuario()!;
    this.form = this.fb.group({
      nombre:    [this.usuario.nombre,   [Validators.required, Validators.minLength(2)]],
      apellido:  [this.usuario.apellido, [Validators.required, Validators.minLength(2)]],
      email:     [{ value: this.usuario.email, disabled: true }],
      telefono:  [this.usuario.telefono || '', [Validators.pattern(/^\+?[0-9]{8,12}$/)]],
      direccion: [this.usuario.direccion || '', [Validators.required, Validators.minLength(5)]]
    });
  }

  get nombre()    { return this.form.get('nombre')!; }
  get apellido()  { return this.form.get('apellido')!; }
  get telefono()  { return this.form.get('telefono')!; }
  get direccion() { return this.form.get('direccion')!; }

  onSubmit(): void {
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }
    this.auth.actualizarPerfil({
      nombre:    this.nombre.value,
      apellido:  this.apellido.value,
      telefono:  this.telefono.value,
      direccion: this.direccion.value
    });
    this.usuario = this.auth.getUsuario()!;
    this.exito = true;
    setTimeout(() => this.exito = false, 3000);
  }
}
