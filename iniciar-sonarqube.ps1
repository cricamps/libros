# ============================================================
# Iniciar SonarQube - Version simplificada sin errores de PATH
# DSY2205 - Semana 7
# Ejecutar: powershell -ExecutionPolicy Bypass -File .\iniciar-sonarqube.ps1
# ============================================================

Write-Host ""
Write-Host "=== INICIANDO SONARQUBE ===" -ForegroundColor Cyan

# --- Buscar SonarQube en rutas comunes ---
$posiblesCarpetas = @(
    "C:\sonarqube",
    "C:\sonar",
    "C:\tools\sonarqube",
    "C:\Program Files\sonarqube",
    "$env:USERPROFILE\sonarqube"
)

$sqBat = $null
foreach ($carpeta in $posiblesCarpetas) {
    $bat = Join-Path $carpeta "bin\windows-x86-64\StartSonar.bat"
    if (Test-Path $bat) {
        $sqBat = $bat
        Write-Host "SonarQube encontrado en: $carpeta" -ForegroundColor Green
        break
    }
}

# Buscar tambien en el disco completo si no lo encontro
if (-not $sqBat) {
    Write-Host "Buscando SonarQube en el disco C:\ ..." -ForegroundColor Yellow
    $encontrado = Get-ChildItem "C:\" -Directory -ErrorAction SilentlyContinue |
        Where-Object { $_.Name -like "sonar*" } |
        ForEach-Object {
            $b = Join-Path $_.FullName "bin\windows-x86-64\StartSonar.bat"
            if (Test-Path $b) { $b }
        } | Select-Object -First 1

    if ($encontrado) {
        $sqBat = $encontrado
        Write-Host "SonarQube encontrado: $sqBat" -ForegroundColor Green
    }
}

if (-not $sqBat) {
    Write-Host ""
    Write-Host "ERROR: SonarQube no esta instalado." -ForegroundColor Red
    Write-Host ""
    Write-Host "Opciones:" -ForegroundColor Yellow
    Write-Host "  A) Descargar e instalar manualmente:" -ForegroundColor Yellow
    Write-Host "     https://www.sonarsource.com/products/sonarqube/downloads/" -ForegroundColor Cyan
    Write-Host "     Descomprimir en C:\sonarqube" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "  B) Descargar automaticamente (requiere internet):" -ForegroundColor Yellow
    Write-Host "     powershell -ExecutionPolicy Bypass -File .\instalar-sonarqube.ps1" -ForegroundColor Cyan
    Write-Host ""
    Read-Host "Presiona Enter para salir"
    exit 1
}

# --- Configurar JDK 17 si existe ---
$jdk17 = "C:\Program Files\Java\jdk-17"
$jdk17Alt = "C:\Program Files\Java\jdk-17.0.0"

# Buscar cualquier jdk-17 instalado
$jdkDir = Get-ChildItem "C:\Program Files\Java" -ErrorAction SilentlyContinue |
    Where-Object { $_.Name -like "jdk-17*" } |
    Select-Object -First 1

if ($jdkDir) {
    $env:JAVA_HOME = $jdkDir.FullName
    $env:PATH = "$($jdkDir.FullName)\bin;" + $env:PATH
    Write-Host "Usando JDK 17: $($jdkDir.FullName)" -ForegroundColor Green
} else {
    Write-Host "JDK 17 no encontrado, usando JAVA_HOME actual: $env:JAVA_HOME" -ForegroundColor Yellow
    Write-Host "(SonarQube reciente acepta JDK 21 tambien)" -ForegroundColor Yellow
}

# --- Verificar si ya esta corriendo ---
try {
    $resp = Invoke-WebRequest -Uri "http://localhost:9000" -TimeoutSec 3 -UseBasicParsing -ErrorAction Stop
    if ($resp.StatusCode -eq 200) {
        Write-Host ""
        Write-Host "SonarQube YA esta corriendo en http://localhost:9000" -ForegroundColor Green
        Start-Process "http://localhost:9000"
        Read-Host "Presiona Enter para salir"
        exit 0
    }
} catch {}

# --- Iniciar SonarQube en nueva ventana ---
Write-Host ""
Write-Host "Iniciando SonarQube (abrira nueva ventana)..." -ForegroundColor Yellow
Write-Host "Espera 1-2 minutos hasta que veas 'SonarQube is up'" -ForegroundColor Yellow

$carpetaSQ = Split-Path (Split-Path $sqBat)
$carpetaSQ = Split-Path $carpetaSQ  # subir 2 niveles desde bin\windows-x86-64

# Iniciar en nueva ventana cmd
Start-Process "cmd.exe" -ArgumentList "/k `"set JAVA_HOME=$env:JAVA_HOME && `"$sqBat`"`"" -WindowStyle Normal

Write-Host ""
Write-Host "Esperando 60 segundos para que SonarQube levante..." -ForegroundColor Yellow
$intentos = 0
do {
    Start-Sleep -Seconds 10
    $intentos++
    Write-Host "  Intento $intentos/8 - verificando http://localhost:9000..."
    try {
        $r = Invoke-WebRequest -Uri "http://localhost:9000" -TimeoutSec 5 -UseBasicParsing -ErrorAction Stop
        if ($r.StatusCode -eq 200) {
            Write-Host ""
            Write-Host "SonarQube esta listo!" -ForegroundColor Green
            break
        }
    } catch {}
} while ($intentos -lt 8)

Write-Host ""
Write-Host "Abriendo http://localhost:9000 ..." -ForegroundColor Cyan
Start-Process "http://localhost:9000"

Write-Host ""
Write-Host "==================================================" -ForegroundColor Green
Write-Host " SonarQube iniciado!" -ForegroundColor Green
Write-Host ""
Write-Host " PROXIMOS PASOS:" -ForegroundColor Yellow
Write-Host " 1. Login: admin / admin (cambiar password)" -ForegroundColor White
Write-Host " 2. Create Project -> Manually" -ForegroundColor White
Write-Host " 3. Project key: tienda-online-frontend" -ForegroundColor White
Write-Host " 4. My Account -> Security -> Generate Token" -ForegroundColor White
Write-Host " 5. Copiar token y pegarlo en:" -ForegroundColor White
Write-Host "    C:\fullstack3\tienda-frontend\sonar-project.properties" -ForegroundColor Cyan
Write-Host "    Linea: sonar.token=TU_TOKEN_AQUI" -ForegroundColor Cyan
Write-Host " 6. Ejecutar: powershell -ExecutionPolicy Bypass -File .\ejecutar-sonar-analisis.ps1" -ForegroundColor White
Write-Host "==================================================" -ForegroundColor Green
Write-Host ""
Read-Host "Presiona Enter para salir"
