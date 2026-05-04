# ============================================================
# Ejecutar analisis SonarQube - Version PowerShell pura
# DSY2205 - Semana 7
# PREREQUISITO: SonarQube corriendo + token configurado
# ============================================================

Write-Host ""
Write-Host "=== ANALISIS SONARQUBE ===" -ForegroundColor Cyan

Set-Location "C:\fullstack3\tienda-frontend"

# --- Verificar token configurado ---
$propsContent = Get-Content "sonar-project.properties" -Raw
if ($propsContent -like "*REEMPLAZAR*") {
    Write-Host ""
    Write-Host "ERROR: Token no configurado." -ForegroundColor Red
    Write-Host ""
    Write-Host "Edita el archivo:" -ForegroundColor Yellow
    Write-Host "  C:\fullstack3\tienda-frontend\sonar-project.properties" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "Cambia esta linea:" -ForegroundColor Yellow
    Write-Host "  sonar.token=sqp_REEMPLAZAR_CON_TU_TOKEN" -ForegroundColor Red
    Write-Host "Por tu token real, por ejemplo:" -ForegroundColor Yellow
    Write-Host "  sonar.token=sqp_abc123xyz456..." -ForegroundColor Green
    Write-Host ""
    Write-Host "Genera el token en: http://localhost:9000" -ForegroundColor Cyan
    Write-Host "  My Account -> Security -> Generate Tokens" -ForegroundColor Cyan
    Read-Host "Presiona Enter para salir"
    exit 1
}

# --- Verificar SonarQube ---
Write-Host "Verificando SonarQube en http://localhost:9000 ..." -ForegroundColor Yellow
try {
    $r = Invoke-WebRequest -Uri "http://localhost:9000" -TimeoutSec 5 -UseBasicParsing -ErrorAction Stop
    Write-Host "SonarQube OK (status $($r.StatusCode))" -ForegroundColor Green
} catch {
    Write-Host "ERROR: SonarQube no responde." -ForegroundColor Red
    Write-Host "Ejecuta primero: powershell -ExecutionPolicy Bypass -File .\iniciar-sonarqube.ps1" -ForegroundColor Yellow
    Read-Host "Presiona Enter para salir"
    exit 1
}

# --- Generar cobertura con Karma ---
Write-Host ""
Write-Host "[1/3] Ejecutando pruebas con cobertura (Karma)..." -ForegroundColor Yellow
& npx ng test --watch=false --browsers=ChromeHeadless --code-coverage

# --- Verificar lcov.info ---
Write-Host ""
Write-Host "[2/3] Verificando reporte de cobertura..." -ForegroundColor Yellow
if (-not (Test-Path "coverage\tienda-frontend\lcov.info")) {
    Write-Host "ERROR: No existe coverage\tienda-frontend\lcov.info" -ForegroundColor Red
    Write-Host "Revisa que las pruebas pasaron correctamente." -ForegroundColor Yellow
    Read-Host "Presiona Enter para salir"
    exit 1
}
$lcovSize = (Get-Item "coverage\tienda-frontend\lcov.info").Length
Write-Host "lcov.info encontrado ($lcovSize bytes) OK" -ForegroundColor Green

# --- Ejecutar sonar-scanner ---
Write-Host ""
Write-Host "[3/3] Ejecutando sonar-scanner..." -ForegroundColor Yellow

# Agregar sonar-scanner al PATH si esta en C:\sonar-scanner
if (Test-Path "C:\sonar-scanner\bin\sonar-scanner.bat") {
    $env:PATH = "C:\sonar-scanner\bin;" + $env:PATH
    Write-Host "sonar-scanner encontrado en C:\sonar-scanner\bin" -ForegroundColor Green
}

# Verificar que sonar-scanner existe
$ssCmd = Get-Command "sonar-scanner" -ErrorAction SilentlyContinue
if (-not $ssCmd) {
    # Buscar en rutas comunes
    $ssPaths = @("C:\sonar-scanner\bin\sonar-scanner.bat", "C:\tools\sonar-scanner\bin\sonar-scanner.bat")
    $ssFound = $ssPaths | Where-Object { Test-Path $_ } | Select-Object -First 1
    
    if ($ssFound) {
        Write-Host "Ejecutando: $ssFound" -ForegroundColor Green
        & $ssFound
    } else {
        Write-Host "sonar-scanner no encontrado. Instalalo desde:" -ForegroundColor Red
        Write-Host "  https://docs.sonarsource.com/sonarqube/latest/analyzing-source-code/scanners/sonarscanner/" -ForegroundColor Cyan
        Write-Host "Descomprime en C:\sonar-scanner y agrega C:\sonar-scanner\bin al PATH" -ForegroundColor Yellow
        Read-Host "Presiona Enter para salir"
        exit 1
    }
} else {
    & sonar-scanner
}

Write-Host ""
Write-Host "======================================================" -ForegroundColor Green
Write-Host " Analisis completado!" -ForegroundColor Green
Write-Host " Ver resultados en: http://localhost:9000" -ForegroundColor Cyan
Write-Host "======================================================" -ForegroundColor Green
Write-Host ""
Start-Process "http://localhost:9000/dashboard?id=tienda-online-frontend"
Read-Host "Presiona Enter para salir"
