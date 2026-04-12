// ============================================================
// MODELO: Usuario
// Patrón MVC - capa Modelo
// ============================================================

export interface Usuario {
  id: number;
  nombre: string;
  apellido: string;
  email: string;
  password: string;
  rol: 'ADMIN' | 'CLIENTE';
  telefono?: string;
  direccion?: string;
  fechaRegistro?: string;
}
