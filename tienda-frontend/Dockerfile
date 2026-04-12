# ============================================================
# Dockerfile - FrontEnd Angular (tienda-frontend)
# Multi-stage: build con Node → serve con Nginx
# DSY2205 - Sumativa 2
# ============================================================

# ── Etapa 1: Build Angular ────────────────────────────────
FROM node:20-alpine AS build
WORKDIR /app

# Copiar dependencias primero (caché de capas)
COPY package*.json ./
RUN npm install

# Copiar código fuente y compilar
COPY . .
RUN npm run build -- --configuration production

# ── Etapa 2: Servidor Nginx ───────────────────────────────
FROM nginx:alpine
LABEL maintainer="TechStore DSY2205"

# Copiar build de Angular al directorio de Nginx
COPY --from=build /app/dist/tienda-frontend/browser /usr/share/nginx/html

# Configuración Nginx para Angular (manejo de rutas SPA)
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
