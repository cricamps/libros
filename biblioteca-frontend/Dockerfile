# ============================================================
# Dockerfile - biblioteca-frontend (Angular + Nginx)
# DSY2205 - Semana 6 - Actividad Formativa 4
#
# Multi-stage build:
#   Stage 1 (builder): compila la app Angular con Node.js
#   Stage 2 (runtime): sirve los archivos con Nginx liviano
# ============================================================

# ── Stage 1: Compilar Angular ─────────────────────────────────
FROM node:20-alpine AS builder

WORKDIR /app

# Copiar package.json primero para aprovechar caché de capas
COPY package*.json ./
RUN npm install

# Copiar el resto del código y compilar para producción
COPY . .
RUN npm run build -- --configuration production

# ── Stage 2: Servir con Nginx ─────────────────────────────────
FROM nginx:alpine

# Copiar los archivos compilados de Angular al directorio de Nginx
COPY --from=builder /app/dist/biblioteca-frontend/browser /usr/share/nginx/html

# Copiar la configuración personalizada de Nginx (SPA routing)
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Puerto expuesto
EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
