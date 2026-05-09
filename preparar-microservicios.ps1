# ============================================================
# preparar-microservicios.ps1
# Copia mvnw y .mvn desde el raíz a ms-gestion y ms-pedidos
# antes de ejecutar docker-compose up --build
#
# USO: .\preparar-microservicios.ps1
# ============================================================

Write-Host "=== Preparando microservicios para Docker ===" -ForegroundColor Cyan

$raiz = $PSScriptRoot

foreach ($ms in @("ms-gestion", "ms-pedidos")) {
    $destino = Join-Path $raiz $ms
    Write-Host "  Copiando mvnw -> $ms ..." -ForegroundColor Yellow

    # Copiar wrapper Maven
    Copy-Item "$raiz\mvnw"    "$destino\mvnw"    -Force
    Copy-Item "$raiz\mvnw.cmd" "$destino\mvnw.cmd" -Force

    # Copiar carpeta .mvn
    if (Test-Path "$destino\.mvn") {
        Remove-Item "$destino\.mvn" -Recurse -Force
    }
    Copy-Item "$raiz\.mvn" "$destino\.mvn" -Recurse -Force

    Write-Host "  $ms listo." -ForegroundColor Green
}

Write-Host ""
Write-Host "=== Listo. Ahora ejecuta: docker-compose up --build ===" -ForegroundColor Cyan
