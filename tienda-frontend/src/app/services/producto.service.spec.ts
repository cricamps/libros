// ============================================================
// PRUEBAS UNITARIAS: ProductoService
// Cobertura: catálogo, carrito, pedidos reactivos, CRUD admin
// HttpClient mockeado con HttpClientTestingModule
// ============================================================
import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ProductoService } from './producto.service';
import { Producto } from '../models/producto.model';

describe('ProductoService', () => {
  let service: ProductoService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule]
    });
    service = TestBed.inject(ProductoService);
    httpMock = TestBed.inject(HttpTestingController);
    // Absorber la petición inicial al catálogo
    const req = httpMock.match(() => true);
    req.forEach(r => r.flush([]));
  });

  afterEach(() => {
    httpMock.verify();
  });

  // ── Instancia ────────────────────────────────────────────────
  it('debería crearse correctamente', () => {
    expect(service).toBeTruthy();
  });

  // ── Catálogo ─────────────────────────────────────────────────
  it('debería retornar al menos 5 productos estáticos', () => {
    expect(service.getProductosArray().length).toBeGreaterThanOrEqual(5);
  });

  it('debería retornar productos mediante observable (fallback)', (done) => {
    service.getProductos().subscribe(productos => {
      expect(productos).toBeDefined();
      done();
    });
    const req = httpMock.expectOne(r => r.url.includes('8083'));
    req.flush([]);
  });

  it('debería retornar una copia del arreglo', () => {
    expect(service.getProductosArray()).not.toBe(service.getProductosArray());
  });

  it('debería encontrar un producto por id', () => {
    const p = service.getProductoPorId(1);
    expect(p).toBeDefined();
    expect(p!.id).toBe(1);
  });

  it('debería retornar undefined para id inexistente', () => {
    expect(service.getProductoPorId(9999)).toBeUndefined();
  });

  it('debería retornar categorías únicas', () => {
    const cats = service.getCategorias();
    expect(cats.length).toBe(new Set(cats).size);
  });

  it('debería retornar al menos 2 categorías', () => {
    expect(service.getCategorias().length).toBeGreaterThanOrEqual(2);
  });

  // ── CRUD Admin (MS-Gestion 8082) ─────────────────────────────
  it('debería agregar un nuevo producto', () => {
    const n = service.getProductosArray().length;
    service.agregarProducto({
      nombre: 'Webcam HD', descripcion: 'Webcam 1080p con microfono',
      precio: 39990, stock: 20, categoria: 'Periféricos', icono: '📷', disponible: true
    });
    const req = httpMock.expectOne(r => r.url.includes('8082'));
    req.flush({ id: 99 });
    expect(service.getProductosArray().length).toBe(n + 1);
  });

  it('debería actualizar un producto existente', () => {
    const ok = service.actualizarProducto(1, { precio: 999999 });
    expect(ok).toBeTrue();
    expect(service.getProductoPorId(1)!.precio).toBe(999999);
    const req = httpMock.expectOne(r => r.url.includes('8082'));
    req.flush({});
  });

  it('debería retornar false al actualizar producto inexistente', () => {
    expect(service.actualizarProducto(9999, { precio: 1 })).toBeFalse();
  });

  it('debería eliminar un producto existente', () => {
    const n = service.getProductosArray().length;
    expect(service.eliminarProducto(1)).toBeTrue();
    expect(service.getProductosArray().length).toBe(n - 1);
    const req = httpMock.expectOne(r => r.url.includes('8082'));
    req.flush({});
  });

  it('debería retornar false al eliminar producto inexistente', () => {
    expect(service.eliminarProducto(9999)).toBeFalse();
  });

  // ── Carrito ───────────────────────────────────────────────────
  it('debería iniciar con carrito vacío', () => {
    expect(service.getCarritoArray().length).toBe(0);
    expect(service.getCantidadCarrito()).toBe(0);
    expect(service.getTotalCarrito()).toBe(0);
  });

  it('debería agregar un producto al carrito', (done) => {
    const p = service.getProductoPorId(1)!;
    service.agregarAlCarrito(p, 1);
    service.getCarrito().subscribe(items => {
      expect(items.length).toBe(1);
      expect(items[0].cantidad).toBe(1);
      done();
    });
  });

  it('debería acumular cantidad al agregar mismo producto', () => {
    const p = service.getProductoPorId(1)!;
    service.agregarAlCarrito(p, 1);
    service.agregarAlCarrito(p, 2);
    expect(service.getCarritoArray()[0].cantidad).toBe(3);
  });

  it('debería calcular el total del carrito', () => {
    const p1 = service.getProductoPorId(1)!;
    const p5 = service.getProductoPorId(5)!;
    service.agregarAlCarrito(p1, 1);
    service.agregarAlCarrito(p5, 2);
    expect(service.getTotalCarrito()).toBe(p1.precio + p5.precio * 2);
  });

  it('debería calcular cantidad total de ítems', () => {
    service.agregarAlCarrito(service.getProductoPorId(1)!, 2);
    service.agregarAlCarrito(service.getProductoPorId(2)!, 3);
    expect(service.getCantidadCarrito()).toBe(5);
  });

  it('debería actualizar cantidad de un ítem', () => {
    service.agregarAlCarrito(service.getProductoPorId(1)!, 1);
    service.actualizarCantidad(1, 5);
    expect(service.getCarritoArray()[0].cantidad).toBe(5);
  });

  it('debería quitar ítem si cantidad llega a 0', () => {
    service.agregarAlCarrito(service.getProductoPorId(1)!, 3);
    service.actualizarCantidad(1, 0);
    expect(service.getCarritoArray().length).toBe(0);
  });

  it('debería quitar un producto del carrito', () => {
    service.agregarAlCarrito(service.getProductoPorId(1)!, 1);
    service.agregarAlCarrito(service.getProductoPorId(2)!, 1);
    service.quitarDelCarrito(1);
    expect(service.getCarritoArray().length).toBe(1);
    expect(service.getCarritoArray()[0].producto.id).toBe(2);
  });

  it('debería vaciar el carrito', () => {
    service.agregarAlCarrito(service.getProductoPorId(1)!, 2);
    service.vaciarCarrito();
    expect(service.getCarritoArray().length).toBe(0);
  });

  // ── Pedidos reactivos ─────────────────────────────────────────
  it('debería crear un pedido y vaciar el carrito', () => {
    service.agregarAlCarrito(service.getProductoPorId(1)!, 1);
    const pedido = service.realizarPedido(2);
    expect(pedido).not.toBeNull();
    expect(pedido!.estado).toBe('PENDIENTE');
    expect(pedido!.usuarioId).toBe(2);
    expect(service.getCarritoArray().length).toBe(0);
    const req = httpMock.expectOne(r => r.url.includes('pedidos'));
    req.flush({});
  });

  it('debería usar fecha 2026 en el pedido nuevo', () => {
    service.agregarAlCarrito(service.getProductoPorId(1)!, 1);
    const pedido = service.realizarPedido(2);
    expect(pedido!.fecha.startsWith('2026')).toBeTrue();
    const req = httpMock.expectOne(r => r.url.includes('pedidos'));
    req.flush({});
  });

  it('debería retornar null si el carrito está vacío', () => {
    expect(service.realizarPedido(2)).toBeNull();
  });

  it('debería obtener pedidos por usuario (sincrónico)', () => {
    const pedidos = service.getPedidosPorUsuario(2);
    expect(pedidos.length).toBeGreaterThan(0);
    pedidos.forEach(p => expect(p.usuarioId).toBe(2));
  });

  it('debería obtener pedidos por usuario (observable)', (done) => {
    service.getPedidosPorUsuario$(2).subscribe(pedidos => {
      expect(pedidos.length).toBeGreaterThan(0);
      done();
    });
  });

  it('debería reflejar nuevo pedido en el observable', (done) => {
    service.agregarAlCarrito(service.getProductoPorId(5)!, 1);
    const antes = service.getPedidosPorUsuario(2).length;
    service.realizarPedido(2);
    const req = httpMock.expectOne(r => r.url.includes('pedidos'));
    req.flush({});
    service.getPedidosPorUsuario$(2).subscribe(pedidos => {
      expect(pedidos.length).toBe(antes + 1);
      done();
    });
  });

  it('debería retornar 0 pedidos para usuario sin historial', () => {
    expect(service.getPedidosPorUsuario(9999).length).toBe(0);
  });

  it('debería retornar todos los pedidos', () => {
    expect(service.getTodosPedidos().length).toBeGreaterThan(0);
  });

  it('debería tener fechas 2026 en pedidos de ejemplo', () => {
    service.getPedidosPorUsuario(2).forEach(p =>
      expect(p.fecha.startsWith('2026')).toBeTrue()
    );
  });
});
