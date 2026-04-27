# ============================================================
# ejecutar-tests-sonar.ps1
# Semana 7 - DSY2205 Desarrollo Full Stack III
#
# Ejecuta pruebas unitarias con cobertura y luego lanza
# el análisis de SonarQube sobre el proyecto Angular.
#
# REQUISITOS:
#   - Node.js / npm instalado
#   - SonarQube corriendo en Docker (puerto 9000)
#   - sonar-scanner instalado (npm install -g sonarqube-scanner)
#   - Token generado en SonarQube (http://localhost:9000)
#
# USO:
#   cd C:\fullstack3\biblioteca-frontend
#   .\ejecutar-tests-sonar.ps1 -Token "squ_TU_TOKEN_AQUI"
# ============================================================

param(
    [Parameter(Mandatory=$true)]
    [string]$Token
)

$ErrorActionPreference = "Stop"

Write-Host ""
Write-Host "============================================================" -ForegroundColor Cyan
Write-Host "  SEMANA 7 - Pruebas Unitarias + SonarQube" -ForegroundColor Cyan
Write-Host "============================================================" -ForegroundColor Cyan
Write-Host ""

# Paso 1: Ejecutar pruebas con cobertura (modo headless, una sola vez)
Write-Host "[1/2] Ejecutando pruebas unitarias con cobertura..." -ForegroundColor Yellow
npx ng test --no-watch --no-progress --code-coverage --browsers=ChromeHeadless

if ($LASTEXITCODE -ne 0) {
    Write-Host ""
    Write-Host "ERROR: Las pruebas fallaron. Revisa los errores arriba." -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "Pruebas completadas. Reporte en: coverage/biblioteca-frontend/lcov.info" -ForegroundColor Green
Write-Host ""

# Paso 2: Ejecutar SonarQube Scanner
Write-Host "[2/2] Enviando análisis a SonarQube..." -ForegroundColor Yellow
npx sonar-scanner -Dsonar.token=$Token

if ($LASTEXITCODE -ne 0) {
    Write-Host ""
    Write-Host "ERROR: El análisis de SonarQube falló." -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "============================================================" -ForegroundColor Green
Write-Host "  Analisis completado." -ForegroundColor Green
Write-Host "  Revisa el reporte en: http://localhost:9000" -ForegroundColor Green
Write-Host "============================================================" -ForegroundColor Green
Write-Host ""
