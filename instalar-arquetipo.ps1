# ============================================================
# instalar-arquetipo.ps1
# Script PowerShell para instalar biblioteca-arquetipo en el
# repositorio local de Maven (~/.m2)
#
# DSY2205 - Desarrollo Full Stack III - Semana 4
# ============================================================
#
# INSTRUCCIONES:
#   1. Abrir PowerShell en C:\fullstack3
#   2. Ejecutar: .\instalar-arquetipo.ps1
#   3. Esperar el mensaje BUILD SUCCESS
# ============================================================

Write-Host ""
Write-Host "============================================================" -ForegroundColor Cyan
Write-Host "  INSTALANDO biblioteca-arquetipo en repositorio Maven local" -ForegroundColor Cyan
Write-Host "============================================================" -ForegroundColor Cyan
Write-Host ""

# Guardar directorio actual
$directorioOriginal = Get-Location

# Entrar al directorio del arquetipo
Set-Location "$PSScriptRoot\biblioteca-arquetipo"

Write-Host "Directorio: $(Get-Location)" -ForegroundColor Yellow
Write-Host ""
Write-Host "Ejecutando: mvn install..." -ForegroundColor Yellow
Write-Host ""

# Instalar el arquetipo en ~/.m2
mvn install

if ($LASTEXITCODE -eq 0) {
    Write-Host ""
    Write-Host "============================================================" -ForegroundColor Green
    Write-Host "  ARQUETIPO INSTALADO CORRECTAMENTE" -ForegroundColor Green
    Write-Host "  GroupId   : com.duoc.fullstack3" -ForegroundColor Green
    Write-Host "  ArtifactId: biblioteca-arquetipo" -ForegroundColor Green
    Write-Host "  Version   : 1.0.0" -ForegroundColor Green
    Write-Host "============================================================" -ForegroundColor Green
} else {
    Write-Host ""
    Write-Host "ERROR: La instalacion del arquetipo fallo." -ForegroundColor Red
    Write-Host "Revisa los mensajes de Maven anteriores." -ForegroundColor Red
}

# Volver al directorio original
Set-Location $directorioOriginal
