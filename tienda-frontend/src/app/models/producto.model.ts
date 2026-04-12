// ============================================================
// MODELO: Producto
// Patrón MVC - capa Modelo
// ============================================================

export interface Producto {
  id: number;
  nombre: string;
  descripcion: string;
  precio: number;
  stock: number;
  categoria: string;
  icono: string;
  disponible: boolean;
}

export interface ItemCarrito {
  producto: Producto;
  cantidad: number;
}

export interface Pedido {
  id: number;
  usuarioId: number;
  items: ItemCarrito[];
  total: number;
  estado: 'PENDIENTE' | 'PROCESANDO' | 'ENVIADO' | 'ENTREGADO';
  fecha: string;
}
