// ============================================================
// PRUEBAS UNITARIAS: CatalogoComponent
// ============================================================
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { CatalogoComponent } from './catalogo.component';
import { ProductoService } from '../../services/producto.service';
import { Producto } from '../../models/producto.model';

const PRODUCTOS_MOCK: Producto[] = [
  { id: 1, nombre: 'Laptop ProBook', descripcion: 'Laptop i7', precio: 899990, stock: 10, categoria: 'Computadores', icono: '💻', disponible: true },
  { id: 2, nombre: 'Smartphone', descripcion: 'Galaxy X20', precio: 499990, stock: 5, categoria: 'Celulares', icono: '📱', disponible: true },
  { id: 3, nombre: 'Auriculares', descripcion: 'BT Pro', precio: 129990, stock: 0, categoria: 'Audio', icono: '🎧', disponible: false },
];

describe('CatalogoComponent', () => {
  let component: CatalogoComponent;
  let fixture: ComponentFixture<CatalogoComponent>;
  let productoSpy: jasmine.SpyObj<ProductoService>;
  let routerSpy: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    productoSpy = jasmine.createSpyObj('ProductoService', [
      'getProductosArray', 'getCategorias', 'agregarAlCarrito'
    ]);
    productoSpy.getProductosArray.and.returnValue([...PRODUCTOS_MOCK]);
    productoSpy.getCategorias.and.returnValue(['Computadores', 'Celulares', 'Audio']);
    productoSpy.agregarAlCarrito.and.stub();

    routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      imports: [CatalogoComponent, RouterTestingModule, FormsModule, CommonModule]
    })
      .overrideComponent(CatalogoComponent, {
        set: {
          providers: [
            { provide: ProductoService, useValue: productoSpy },
            { provide: Router, useValue: routerSpy }
          ]
        }
      })
      .compileComponents();

    fixture = TestBed.createComponent(CatalogoComponent);
    component = fixture.componentInstance;
    (component as any).productoSvc = productoSpy;
    (component as any).router = routerSpy;
    fixture.detectChanges();
  });

  it('debería crearse correctamente', () => {
    expect(component).toBeTruthy();
  });

  it('debería cargar productos en ngOnInit', () => {
    component.ngOnInit();
    expect(component.productos.length).toBe(3);
  });

  it('debería cargar categorías incluyendo "Todas"', () => {
    component.ngOnInit();
    expect(component.categorias).toContain('Todas');
    expect(component.categorias.length).toBe(4);
  });

  it('debería iniciar con categoría "Todas"', () => {
    expect(component.categoriaSeleccionada).toBe('Todas');
  });

  it('debería mostrar todos los productos por defecto', () => {
    component.ngOnInit();
    expect(component.productosFiltrados.length).toBe(3);
  });

  it('debería filtrar por categoría', () => {
    component.ngOnInit();
    component.categoriaSeleccionada = 'Computadores';
    component.filtrar();
    expect(component.productosFiltrados.length).toBe(1);
    expect(component.productosFiltrados[0].nombre).toBe('Laptop ProBook');
  });

  it('debería filtrar por texto de búsqueda', () => {
    component.ngOnInit();
    component.busqueda = 'smartphone';
    component.filtrar();
    expect(component.productosFiltrados.length).toBe(1);
  });

  it('debería ordenar por precio ascendente', () => {
    component.ngOnInit();
    component.ordenPrecio = 'asc';
    component.filtrar();
    const precios = component.productosFiltrados.map(p => p.precio);
    expect(precios[0]).toBeLessThanOrEqual(precios[1]);
  });

  it('debería ordenar por precio descendente', () => {
    component.ngOnInit();
    component.ordenPrecio = 'desc';
    component.filtrar();
    const precios = component.productosFiltrados.map(p => p.precio);
    expect(precios[0]).toBeGreaterThanOrEqual(precios[1]);
  });

  it('debería navegar al detalle al llamar verDetalle', () => {
    component.verDetalle(1);
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/catalogo', 1]);
  });

  it('debería agregar producto disponible al carrito', () => {
    component.ngOnInit();
    component.agregarAlCarrito(PRODUCTOS_MOCK[0]);
    expect(productoSpy.agregarAlCarrito).toHaveBeenCalledWith(PRODUCTOS_MOCK[0], 1);
  });

  it('no debería agregar producto no disponible', () => {
    component.ngOnInit();
    component.agregarAlCarrito(PRODUCTOS_MOCK[2]);
    expect(productoSpy.agregarAlCarrito).not.toHaveBeenCalled();
  });

  it('debería mostrar éxito al agregar y limpiarlo', (done) => {
    component.agregarAlCarrito(PRODUCTOS_MOCK[0]);
    expect(component.agregarExito).toBe(1);
    setTimeout(() => {
      expect(component.agregarExito).toBeNull();
      done();
    }, 1600);
  });

  it('debería retornar vacío si no hay coincidencias', () => {
    component.ngOnInit();
    component.busqueda = 'xyzinexistente';
    component.filtrar();
    expect(component.productosFiltrados.length).toBe(0);
  });

  it('debería formatear precio en CLP', () => {
    expect(component.formatearPrecio(899990)).toContain('899');
  });
});
