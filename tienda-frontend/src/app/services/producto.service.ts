// ============================================================
// SERVICIO: ProductoService
// Patrón Singleton (providedIn: 'root')
// Patrón Observer (BehaviorSubject)
// Patrón Facade (abstrae productos, carrito y pedidos)
// Conectado a BackEnd Spring Boot puertos 8081 y 8083
// Fallback a datos estáticos si el BackEnd no está disponible
// ============================================================

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { Producto, ItemCarrito, Pedido } from '../models/producto.model';

@Injectable({ providedIn: 'root' })
export class ProductoService {

  private readonly API_PRODUCTOS  = 'http://localhost:8081/api/productos';
  private readonly API_PEDIDOS    = 'http://localhost:8083/api/pedidos';
  private readonly API_MS_PRODUCTOS = 'http://localhost:8083/api/productos';

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

  private carrito$  = new BehaviorSubject<ItemCarrito[]>([]);
  private pedidos$  = new BehaviorSubject<Pedido[]>([
    { id: 1, usuarioId: 2, items: [{ producto: this.productos[0], cantidad: 1 }],
      total: 899990, estado: 'ENTREGADO', fecha: '2026-01-15' },
    { id: 2, usuarioId: 2,
      items: [{ producto: this.productos[2], cantidad: 2 }, { producto: this.productos[4], cantidad: 1 }],
      total: 339970, estado: 'ENVIADO', fecha: '2026-03-20' }
  ]);
  private backendDisponible = false;

  constructor(private readonly http: HttpClient) {
    this.inicializarDesdeBackEnd();
  }

  // ── Inicializar: cargar productos desde BackEnd al arrancar ──
  private inicializarDesdeBackEnd(): void {
    // Intenta cargar desde ms-pedidos (8083) primero, luego ms-principal (8081)
    this.http.get<Producto[]>(this.API_MS_PRODUCTOS)
      .pipe(catchError(() =>
        this.http.get<Producto[]>(this.API_PRODUCTOS).pipe(catchError(() => of([])))
      ))
      .subscribe(prods => {
        if (prods && prods.length > 0) {
          // Mapear campos del BackEnd al modelo del FrontEnd
          this.productos = prods.map(p => ({
            ...p,
            icono: this.getIconoPorCategoria((p as any).categoria || 'General'),
            disponible: (p as any).disponible ?? ((p as any).stock > 0)
          }));
          this.backendDisponible = true;
        }
      });
  }

  private getIconoPorCategoria(categoria: string): string {
    const iconos: Record<string, string> = {
      'Computadores': '💻', 'Celulares': '📱', 'Audio': '🎧',
      'Monitores': '🖥️', 'Periféricos': '⌨️', 'Tablets': '📟',
      'Accesorios': '🔌', 'General': '📦'
    };
    return iconos[categoria] || '📦';
  }

  // ── Catálogo ─────────────────────────────────────────────────
  getProductos(): Observable<Producto[]> {
    return this.http.get<Producto[]>(this.API_MS_PRODUCTOS).pipe(
      tap(prods => { if (prods?.length) this.productos = prods; }),
      catchError(() => of([...this.productos]))
    );
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

  // ── ADMIN: CRUD conectado al BackEnd (8081) ──────────────────
  agregarProducto(producto: Omit<Producto, 'id'>): void {
    const nuevo: Producto = {
      ...producto,
      id: Math.max(...this.productos.map(p => p.id)) + 1
    };
    this.productos.push(nuevo);

    // Persistir en Oracle via BackEnd
    this.http.post<Producto>(this.API_PRODUCTOS, nuevo)
      .pipe(catchError(() => of(null)))
      .subscribe(p => { if (p?.id) nuevo.id = p.id; });
  }

  actualizarProducto(id: number, datos: Partial<Producto>): boolean {
    const idx = this.productos.findIndex(p => p.id === id);
    if (idx === -1) return false;
    this.productos[idx] = { ...this.productos[idx], ...datos };

    this.http.put<Producto>(`${this.API_PRODUCTOS}/${id}`, this.productos[idx])
      .pipe(catchError(() => of(null)))
      .subscribe();
    return true;
  }

  eliminarProducto(id: number): boolean {
    const idx = this.productos.findIndex(p => p.id === id);
    if (idx === -1) return false;
    this.productos.splice(idx, 1);

    this.http.delete(`${this.API_PRODUCTOS}/${id}`)
      .pipe(catchError(() => of(null)))
      .subscribe();
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

  vaciarCarrito(): void {
    this.carrito$.next([]);
  }

  getTotalCarrito(): number {
    return this.carrito$.getValue().reduce((s, i) => s + i.producto.precio * i.cantidad, 0);
  }

  getCantidadCarrito(): number {
    return this.carrito$.getValue().reduce((s, i) => s + i.cantidad, 0);
  }

  // ── Pedidos: conectado a ms-pedidos (8083) ───────────────────
  realizarPedido(usuarioId: number): Pedido | null {
    const items = this.getCarritoArray();
    if (items.length === 0) return null;

    const pedido: Pedido = {
      id: this.pedidos$.getValue().length + 1,
      usuarioId,
      items: [...items],
      total: this.getTotalCarrito(),
      estado: 'PENDIENTE',
      fecha: new Date().toISOString().split('T')[0]
    };

    this.pedidos$.next([...this.pedidos$.getValue(), pedido]);
    this.vaciarCarrito();

    // Persistir pedido en BackEnd
    this.http.post(`${this.API_PEDIDOS}`, {
      usuarioId,
      total: pedido.total,
      estado: pedido.estado,
      items: items.map(i => ({ productoId: i.producto.id, cantidad: i.cantidad, precio: i.producto.precio }))
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

  getTodosPedidos(): Pedido[] {
    return [...this.pedidos$.getValue()];
  }
}
