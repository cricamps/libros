# ============================================================
# docker-push.ps1
# Script para construir y subir las imágenes a Docker Hub
# DSY2205 - Semana 6 - Actividad Formativa 4
# ============================================================

$DOCKER_USER = "ccamps"
$BACKEND_IMAGE  = "biblioteca-backend"
$FRONTEND_IMAGE = "biblioteca-frontend"
$TAG = "latest"

Write-Host ""
Write-Host "============================================" -ForegroundColor Cyan
Write-Host "  BIBLIOTECA FULLSTACK - Docker Hub Push" -ForegroundColor Cyan
Write-Host "============================================" -ForegroundColor Cyan
Write-Host ""

# ─── 1. TAG ───────────────────────────────────────────────────
Write-Host "[1/3] Etiquetando imagenes para Docker Hub..." -ForegroundColor Yellow

docker tag "${BACKEND_IMAGE}:${TAG}" "${DOCKER_USER}/${BACKEND_IMAGE}:${TAG}"
docker tag "${FRONTEND_IMAGE}:${TAG}" "${DOCKER_USER}/${FRONTEND_IMAGE}:${TAG}"

Write-Host "  -> ${DOCKER_USER}/${BACKEND_IMAGE}:${TAG}" -ForegroundColor Green
Write-Host "  -> ${DOCKER_USER}/${FRONTEND_IMAGE}:${TAG}" -ForegroundColor Green

# ─── 2. LOGIN ─────────────────────────────────────────────────
Write-Host ""
Write-Host "[2/3] Iniciando sesion en Docker Hub como ccamps..." -ForegroundColor Yellow
docker login
if ($LASTEXITCODE -ne 0) { Write-Host "ERROR en login." -ForegroundColor Red; exit 1 }

# ─── 3. PUSH ──────────────────────────────────────────────────
Write-Host ""
Write-Host "[3/3] Subiendo imagenes a Docker Hub..." -ForegroundColor Yellow

docker push "${DOCKER_USER}/${BACKEND_IMAGE}:${TAG}"
docker push "${DOCKER_USER}/${FRONTEND_IMAGE}:${TAG}"

Write-Host ""
Write-Host "============================================" -ForegroundColor Green
Write-Host "  Imagenes publicadas exitosamente!" -ForegroundColor Green
Write-Host "============================================" -ForegroundColor Green
Write-Host ""
Write-Host "  BackEnd  : https://hub.docker.com/r/${DOCKER_USER}/${BACKEND_IMAGE}" -ForegroundColor Cyan
Write-Host "  FrontEnd : https://hub.docker.com/r/${DOCKER_USER}/${FRONTEND_IMAGE}" -ForegroundColor Cyan
Write-Host ""
