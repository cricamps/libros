// ============================================================
// api-config.ts – URLs centralizadas de los microservicios
// DSY2205 – EFT TechStore
//
// DESARROLLO LOCAL:
//   ms-usuarios  → http://localhost:8081/api
//   ms-gestion   → http://localhost:8082/api
//   ms-pedidos   → http://localhost:8083/api
//
// DOCKER (cambiar si se usa URL pública de Docker Lab):
//   Reemplazar localhost por la IP/hostname del servidor
// ============================================================

export const API_USUARIOS = 'http://localhost:8081/api';
export const API_GESTION  = 'http://localhost:8082/api';
export const API_PEDIDOS  = 'http://localhost:8083/api';

// Rutas específicas de cada microservicio
export const ENDPOINTS = {
  // MS-Usuarios (8081)
  login:    `${API_USUARIOS}/auth/login`,
  usuarios: `${API_USUARIOS}/usuarios`,

  // MS-Gestion (8082) – solo ADMIN
  gestionProductos: `${API_GESTION}/gestion/productos`,

  // MS-Pedidos (8083) – clientes y admin
  catalogo: `${API_PEDIDOS}/productos`,
  pedidos:  `${API_PEDIDOS}/pedidos`,
};
