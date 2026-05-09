// ============================================================
// SERVICIO: ProductoService
// Patrón Singleton (providedIn: 'root')
// Patrón Observer (BehaviorSubject)
// Patrón Facade (abstrae productos, carrito y pedidos)
// ============================================================
// Microservicios:
//   MS-Usuarios (8081): autenticacion y usuarios
//   MS-Gestion  (8082): CRUD admin de productos → /api/gestion/productos
//   MS-Pedidos  (8083): busqueda/compra          → /api/productos | /api/pedidos
// ============================================================

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { Producto, ItemCarrito, Pedido } from '../models/producto.model';
import { ENDPOINTS } from './api-config';

@Injectable({ providedIn: 'root' })
export class ProductoService {

  // ── Datos estáticos: fallback cuando el BackEnd no responde ──
  private productos: Producto[] = [
    { id: 1, nombre: 'Laptop ProBook 15',
      descripcion: 'Laptop de alto rendimiento con procesador Intel Core i7, 16GB RAM, SSD 512GB.',
      precio: 899990, stock: 12, categoria: 'Computadores', icono: '💻', disponible: true },
    { id: 2, nombre: 'Smartphone Galaxy X20',
      descripcion: 'Smartphone 6.5" AMOLED, cámara 108MP, batería 5000mAh, 128GB almacenamiento.',
      precio: 499990, stock: 25, categoria: 'Celulares', icono: '📱', disponible: true },
    { id: 3, nombre: 'Auriculares BT Pro',
      descripcion: 'Auriculares inalámbricos Bluetooth 5.0, cancelación de ruido activa, 30h batería.',
      precio: 129990, stock: 30, categoria: 'Audio', icono: '🎧', disponible: true },
    { id: 4, nombre: 'Monitor 27" 4K UHD',
      descripcion: 'Monitor 4K UHD IPS 27 pulgadas, 144Hz, HDR400, ideal para diseño y gaming.',
      precio: 349990, stock: 8, categoria: 'Monitores', icono: '🖥️', disponible: true },
    { id: 5, nombre: 'Teclado Mecánico RGB',
      descripcion: 'Teclado mecánico gaming con switches Blue, iluminación RGB por tecla, USB-C.',
      precio: 79990, stock: 40, categoria: 'Periféricos', icono: '⌨️', disponible: true },
    { id: 6, nombre: 'Mouse Inalámbrico Ergo',
      descripcion: 'Mouse ergonómico inalámbrico 2.4GHz, 4000 DPI, batería recargable.',
      precio: 49990, stock: 50, categoria: 'Periféricos', icono: '🖱️', disponible: true },
    { id: 7, nombre: 'Tablet ProPad 10"',
      descripcion: 'Tablet 10.5" FHD, 64GB almacenamiento, batería 8000mAh, compatible con stylus.',
      precio: 299990, stock: 15, categoria: 'Tablets', icono: '📟', disponible: false }
  ];

  private carrito$ = new BehaviorSubject<ItemCarrito[]>([]);
  private pedidos$ = new BehaviorSubject<Pedido[]>([
    { id: 1, usuarioId: 2, items: [{ producto: this.productos[0], cantidad: 1 }],
      total: 899990, estado: 'ENTREGADO', fecha: '2026-01-15' },
    { id: 2, usuarioId: 2,
      items: [{ producto: this.productos[2], cantidad: 2 }, { producto: this.productos[4], cantidad: 1 }],
      total: 339970, estado: 'ENVIADO', fecha: '2026-03-20' }
  ]);

  constructor(private readonly http: HttpClient) {
    this.cargarCatalogoDesdeBackEnd();
  }

  // ── Cargar catálogo desde MS-Pedidos al arrancar ─────────────
  private cargarCatalogoDesdeBackEnd(): void {
    this.http.get<any[]>(ENDPOINTS.catalogo)
      .pipe(catchError(() => of([])))
      .subscribe(prods => {
        if (prods && prods.length > 0) {
          this.productos = prods.map(p => ({
            id: p.id, nombre: p.nombre, descripcion: p.descripcion,
            precio: p.precio, stock: p.stock, categoria: p.categoria,
            icono: this.iconoPorCategoria(p.categoria),
            disponible: p.disponible === 1 || p.disponible === true || (p.stock > 0)
          }));
        }
      });
  }

  private iconoPorCategoria(cat: string): string {
    const m: Record<string, string> = {
      'Computadores':'💻','Celulares':'📱','Audio':'🎧','Monitores':'🖥️',
      'Periféricos':'⌨️','Perifericos':'⌨️','Tablets':'📟','Accesorios':'🔌'
    };
    return m[cat] || '📦';
  }

  // ── Catálogo (MS-Pedidos 8083) ────────────────────────────────
  getProductos(): Observable<Producto[]> {
    return this.http.get<any[]>(ENDPOINTS.catalogo).pipe(
      tap(prods => {
        if (prods?.length) {
          this.productos = prods.map(p => ({
            ...p,
            icono: this.iconoPorCategoria(p.categoria),
            disponible: p.disponible === 1 || p.disponible === true || (p.stock > 0)
          }));
        }
      }),
      catchError(() => of([...this.productos]))
    );
  }

  getProductosArray(): Producto[] { return [...this.productos]; }

  getProductoPorId(id: number): Producto | undefined {
    return this.productos.find(p => p.id === id);
  }

  getCategorias(): string[] {
    return [...new Set(this.productos.map(p => p.categoria))];
  }

  // ── CRUD Admin → MS-Gestion (8082) → /api/gestion/productos ──
  agregarProducto(producto: Omit<Producto, 'id'>): void {
    const nuevo: Producto = {
      ...producto,
      id: Math.max(...this.productos.map(p => p.id), 0) + 1
    };
    this.productos.push(nuevo);
    this.http.post<Producto>(ENDPOINTS.gestionProductos, nuevo)
      .pipe(catchError(() => of(null)))
      .subscribe(p => { if (p?.id) nuevo.id = p.id; });
  }

  actualizarProducto(id: number, datos: Partial<Producto>): boolean {
    const idx = this.productos.findIndex(p => p.id === id);
    if (idx === -1) return false;
    this.productos[idx] = { ...this.productos[idx], ...datos };
    this.http.put<Producto>(`${ENDPOINTS.gestionProductos}/${id}`, this.productos[idx])
      .pipe(catchError(() => of(null))).subscribe();
    return true;
  }

  eliminarProducto(id: number): boolean {
    const idx = this.productos.findIndex(p => p.id === id);
    if (idx === -1) return false;
    this.productos.splice(idx, 1);
    this.http.delete(`${ENDPOINTS.gestionProductos}/${id}`)
      .pipe(catchError(() => of(null))).subscribe();
    return true;
  }

  // ── Carrito ───────────────────────────────────────────────────
  getCarrito(): Observable<ItemCarrito[]> { return this.carrito$.asObservable(); }
  getCarritoArray(): ItemCarrito[] { return this.carrito$.getValue(); }

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
    this.carrito$.next(this.carrito$.getValue().filter(i => i.producto.id !== productoId));
  }

  actualizarCantidad(productoId: number, cantidad: number): void {
    if (cantidad <= 0) { this.quitarDelCarrito(productoId); return; }
    this.carrito$.next(
      this.carrito$.getValue().map(i =>
        i.producto.id === productoId ? { ...i, cantidad } : i
      )
    );
  }

  vaciarCarrito(): void { this.carrito$.next([]); }

  getTotalCarrito(): number {
    return this.carrito$.getValue().reduce((s, i) => s + i.producto.precio * i.cantidad, 0);
  }

  getCantidadCarrito(): number {
    return this.carrito$.getValue().reduce((s, i) => s + i.cantidad, 0);
  }

  // ── Pedidos → MS-Pedidos (8083) → /api/pedidos ───────────────
  realizarPedido(usuarioId: number): Pedido | null {
    const items = this.getCarritoArray();
    if (items.length === 0) return null;
    const pedido: Pedido = {
      id: this.pedidos$.getValue().length + 1,
      usuarioId, items: [...items],
      total: this.getTotalCarrito(),
      estado: 'PENDIENTE',
      fecha: new Date().toISOString().split('T')[0]
    };
    this.pedidos$.next([...this.pedidos$.getValue(), pedido]);
    this.vaciarCarrito();

    // Body alineado exactamente con PedidoRequest.java del BackEnd
    this.http.post(ENDPOINTS.pedidos, {
      usuarioId,
      total: pedido.total,
      estado: pedido.estado,
      items: items.map(i => ({
        productoId: i.producto.id,
        cantidad: i.cantidad,
        precio: i.producto.precio
      }))
    }).pipe(catchError(() => of(null))).subscribe();

    return pedido;
  }

  getPedidosPorUsuario$(usuarioId: number): Observable<Pedido[]> {
    return new Observable(obs => {
      this.pedidos$.subscribe(pedidos =>
        obs.next(pedidos.filter(p => p.usuarioId === usuarioId))
      );
    });
  }

  getPedidosPorUsuario(usuarioId: number): Pedido[] {
    return this.pedidos$.getValue().filter(p => p.usuarioId === usuarioId);
  }

  getTodosPedidos(): Pedido[] { return [...this.pedidos$.getValue()]; }
}
