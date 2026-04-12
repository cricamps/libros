import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ProductoService } from '../../services/producto.service';
import { Producto } from '../../models/producto.model';

@Component({
  selector: 'app-admin-productos',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './admin-productos.component.html'
})
export class AdminProductosComponent implements OnInit {
  productos: Producto[] = [];
  form!: FormGroup;
  modoEdicion = false;
  idEditando: number | null = null;
  mostrarFormulario = false;
  mensajeExito = '';

  categorias = ['Computadores','Celulares','Audio','Monitores','Periféricos','Tablets','Accesorios'];
  iconos     = ['💻','📱','🎧','🖥️','⌨️','🖱️','📟','🎮','📷','🖨️'];

  constructor(private fb: FormBuilder, private productoSvc: ProductoService) {}

  ngOnInit(): void {
    this.cargarProductos();
    this.iniciarForm();
  }

  cargarProductos(): void {
    this.productos = this.productoSvc.getProductosArray();
  }

  iniciarForm(producto?: Producto): void {
    this.form = this.fb.group({
      nombre:      [producto?.nombre      || '', [Validators.required, Validators.minLength(3)]],
      descripcion: [producto?.descripcion || '', [Validators.required, Validators.minLength(10)]],
      precio:      [producto?.precio      || '', [Validators.required, Validators.min(1)]],
      stock:       [producto?.stock       || '', [Validators.required, Validators.min(0)]],
      categoria:   [producto?.categoria   || this.categorias[0], Validators.required],
      icono:       [producto?.icono       || '💻', Validators.required],
      disponible:  [producto?.disponible  ?? true]
    });
  }

  get nombre()      { return this.form.get('nombre')!; }
  get descripcion() { return this.form.get('descripcion')!; }
  get precio()      { return this.form.get('precio')!; }
  get stock()       { return this.form.get('stock')!; }

  abrirNuevo(): void {
    this.modoEdicion = false;
    this.idEditando = null;
    this.iniciarForm();
    this.mostrarFormulario = true;
  }

  editarProducto(p: Producto): void {
    this.modoEdicion = true;
    this.idEditando = p.id;
    this.iniciarForm(p);
    this.mostrarFormulario = true;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  eliminarProducto(id: number): void {
    if (!confirm('¿Estás seguro de eliminar este producto?')) return;
    this.productoSvc.eliminarProducto(id);
    this.cargarProductos();
    this.mostrar('Producto eliminado correctamente.');
  }

  onSubmit(): void {
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }
    const datos = { ...this.form.getRawValue() };
    datos.precio = Number(datos.precio);
    datos.stock  = Number(datos.stock);

    if (this.modoEdicion && this.idEditando !== null) {
      this.productoSvc.actualizarProducto(this.idEditando, datos);
      this.mostrar('Producto actualizado correctamente.');
    } else {
      this.productoSvc.agregarProducto(datos);
      this.mostrar('Producto agregado correctamente.');
    }
    this.cargarProductos();
    this.cancelar();
  }

  cancelar(): void {
    this.mostrarFormulario = false;
    this.modoEdicion = false;
    this.idEditando = null;
  }

  mostrar(msg: string): void {
    this.mensajeExito = msg;
    setTimeout(() => this.mensajeExito = '', 3000);
  }

  formatearPrecio(precio: number): string {
    return precio.toLocaleString('es-CL', { style: 'currency', currency: 'CLP' });
  }
}
