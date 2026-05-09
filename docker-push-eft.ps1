# ============================================================
# docker-push-eft.ps1
# Build y push de las 4 imágenes TechStore a Docker Hub
# Usuario Docker Hub: ccamps
#
# USO:
#   1. .\preparar-microservicios.ps1
#   2. .\docker-push-eft.ps1
# ============================================================

$ErrorActionPreference = "Stop"
$usuario = "ccamps"

Write-Host ""
Write-Host "============================================" -ForegroundColor Cyan
Write-Host "  TechStore – Docker Build & Push (EFT)   " -ForegroundColor Cyan
Write-Host "============================================" -ForegroundColor Cyan
Write-Host ""

$imagenes = @(
    @{ tag = "$usuario/ms-usuarios:latest";    contexto = ".";               df = "Dockerfile" },
    @{ tag = "$usuario/ms-gestion:latest";     contexto = ".\ms-gestion";    df = "Dockerfile" },
    @{ tag = "$usuario/ms-pedidos:latest";     contexto = ".\ms-pedidos";    df = "Dockerfile" },
    @{ tag = "$usuario/tienda-frontend:latest";contexto = ".\tienda-frontend";df = "Dockerfile" }
)

foreach ($img in $imagenes) {
    Write-Host ">>> Build: $($img.tag)" -ForegroundColor Yellow
    docker build -t $img.tag -f "$($img.contexto)\$($img.df)" $img.contexto
    if ($LASTEXITCODE -ne 0) { Write-Host "ERROR en build de $($img.tag)" -ForegroundColor Red; exit 1 }

    Write-Host ">>> Push:  $($img.tag)" -ForegroundColor Yellow
    docker push $img.tag
    if ($LASTEXITCODE -ne 0) { Write-Host "ERROR en push de $($img.tag)" -ForegroundColor Red; exit 1 }

    Write-Host "    OK`n" -ForegroundColor Green
}

Write-Host "============================================" -ForegroundColor Cyan
Write-Host "  Todas las imagenes subidas a Docker Hub  " -ForegroundColor Cyan
Write-Host "============================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Imagenes disponibles:" -ForegroundColor White
foreach ($img in $imagenes) {
    Write-Host "  https://hub.docker.com/r/$($img.tag.Split(':')[0])" -ForegroundColor Gray
}
