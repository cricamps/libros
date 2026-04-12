// ============================================================
// SERVICIO: ProductoService
// Patrón Singleton (providedIn: 'root')
// Patrón Observer (BehaviorSubject para carrito y productos)
// Patrón Facade (abstrae la lógica de productos y carrito)
// Datos estáticos: arreglos en memoria
// ============================================================

import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Producto, ItemCarrito, Pedido } from '../models/producto.model';

@Injectable({ providedIn: 'root' })
export class ProductoService {

  // ── Catálogo estático de 5+ productos ───────────────────────
  private productos: Producto[] = [
    {
      id: 1,
      nombre: 'Laptop ProBook 15',
      descripcion: 'Laptop de alto rendimiento con procesador Intel Core i7, 16GB RAM, SSD 512GB.',
      precio: 899990,
      stock: 12,
      categoria: 'Computadores',
      icono: '💻',
      disponible: true
    },
    {
      id: 2,
      nombre: 'Smartphone Galaxy X20',
      descripcion: 'Smartphone 6.5" AMOLED, cámara 108MP, batería 5000mAh, 128GB almacenamiento.',
      precio: 499990,
      stock: 25,
      categoria: 'Celulares',
      icono: '📱',
      disponible: true
    },
    {
      id: 3,
      nombre: 'Auriculares BT Pro',
      descripcion: 'Auriculares inalámbricos Bluetooth 5.0, cancelación de ruido activa, 30h batería.',
      precio: 129990,
      stock: 30,
      categoria: 'Audio',
      icono: '🎧',
      disponible: true
    },
    {
      id: 4,
      nombre: 'Monitor 27" 4K UHD',
      descripcion: 'Monitor 4K UHD IPS 27 pulgadas, 144Hz, HDR400, ideal para diseño y gaming.',
      precio: 349990,
      stock: 8,
      categoria: 'Monitores',
      icono: '🖥️',
      disponible: true
    },
    {
      id: 5,
      nombre: 'Teclado Mecánico RGB',
      descripcion: 'Teclado mecánico gaming con switches Blue, iluminación RGB por tecla, USB-C.',
      precio: 79990,
      stock: 40,
      categoria: 'Periféricos',
      icono: '⌨️',
      disponible: true
    },
    {
      id: 6,
      nombre: 'Mouse Inalámbrico Ergo',
      descripcion: 'Mouse ergonómico inalámbrico 2.4GHz, 4000 DPI, batería recargable.',
      precio: 49990,
      stock: 50,
      categoria: 'Periféricos',
      icono: '🖱️',
      disponible: true
    },
    {
      id: 7,
      nombre: 'Tablet ProPad 10"',
      descripcion: 'Tablet 10.5" FHD, 64GB almacenamiento, batería 8000mAh, compatible con stylus.',
      precio: 299990,
      stock: 15,
      categoria: 'Tablets',
      icono: '📟',
      disponible: false
    }
  ];

  // ── Observer: carrito reactivo ───────────────────────────────
  private carrito$ = new BehaviorSubject<ItemCarrito[]>([]);

  // ── Observer: lista de pedidos ───────────────────────────────
  private pedidos: Pedido[] = [
    {
      id: 1,
      usuarioId: 2,
      items: [{ producto: this.productos[0], cantidad: 1 }],
      total: 899990,
      estado: 'ENTREGADO',
      fecha: '2024-11-10'
    },
    {
      id: 2,
      usuarioId: 2,
      items: [
        { producto: this.productos[2], cantidad: 2 },
        { producto: this.productos[4], cantidad: 1 }
      ],
      total: 339970,
      estado: 'ENVIADO',
      fecha: '2025-01-05'
    }
  ];

  // ── Obtener catálogo completo ────────────────────────────────
  getProductos(): Observable<Producto[]> {
    return new Observable(obs => {
      obs.next([...this.productos]);
      obs.complete();
    });
  }

  getProductosArray(): Producto[] {
    return [...this.productos];
  }

  getProductoPorId(id: number): Producto | undefined {
    return this.productos.find(p => p.id === id);
  }

  getCategorias(): string[] {
    return [...new Set(this.productos.map(p => p.categoria))];
  }

  // ── ADMIN: CRUD de productos ─────────────────────────────────
  agregarProducto(producto: Omit<Producto, 'id'>): void {
    const nuevo: Producto = {
      ...producto,
      id: Math.max(...this.productos.map(p => p.id)) + 1
    };
    this.productos.push(nuevo);
  }

  actualizarProducto(id: number, datos: Partial<Producto>): boolean {
    const idx = this.productos.findIndex(p => p.id === id);
    if (idx === -1) return false;
    this.productos[idx] = { ...this.productos[idx], ...datos };
    return true;
  }

  eliminarProducto(id: number): boolean {
    const idx = this.productos.findIndex(p => p.id === id);
    if (idx === -1) return false;
    this.productos.splice(idx, 1);
    return true;
  }

  // ── Carrito ──────────────────────────────────────────────────
  getCarrito(): Observable<ItemCarrito[]> {
    return this.carrito$.asObservable();
  }

  getCarritoArray(): ItemCarrito[] {
    return this.carrito$.getValue();
  }

  agregarAlCarrito(producto: Producto, cantidad: number = 1): void {
    const actual = [...this.carrito$.getValue()];
    const idx = actual.findIndex(i => i.producto.id === producto.id);
    if (idx !== -1) {
      actual[idx] = { ...actual[idx], cantidad: actual[idx].cantidad + cantidad };
    } else {
      actual.push({ producto, cantidad });
    }
    this.carrito$.next(actual);
  }

  quitarDelCarrito(productoId: number): void {
    const actual = this.carrito$.getValue().filter(i => i.producto.id !== productoId);
    this.carrito$.next(actual);
  }

  actualizarCantidad(productoId: number, cantidad: number): void {
    if (cantidad <= 0) { this.quitarDelCarrito(productoId); return; }
    const actual = this.carrito$.getValue().map(i =>
      i.producto.id === productoId ? { ...i, cantidad } : i
    );
    this.carrito$.next(actual);
  }

  vaciarCarrito(): void {
    this.carrito$.next([]);
  }

  getTotalCarrito(): number {
    return this.carrito$.getValue().reduce((s, i) => s + i.producto.precio * i.cantidad, 0);
  }

  getCantidadCarrito(): number {
    return this.carrito$.getValue().reduce((s, i) => s + i.cantidad, 0);
  }

  // ── Pedidos ──────────────────────────────────────────────────
  realizarPedido(usuarioId: number): Pedido | null {
    const items = this.getCarritoArray();
    if (items.length === 0) return null;
    const pedido: Pedido = {
      id: this.pedidos.length + 1,
      usuarioId,
      items: [...items],
      total: this.getTotalCarrito(),
      estado: 'PENDIENTE',
      fecha: new Date().toISOString().split('T')[0]
    };
    this.pedidos.push(pedido);
    this.vaciarCarrito();
    return pedido;
  }

  getPedidosPorUsuario(usuarioId: number): Pedido[] {
    return this.pedidos.filter(p => p.usuarioId === usuarioId);
  }

  getTodosPedidos(): Pedido[] {
    return [...this.pedidos];
  }
}
