# ===========================================================
# generar_zip_entrega.ps1
# Script para generar el ZIP limpio para entrega en el AVA
# Asignatura: Desarrollo Full Stack III (DSY2205)
# Alumno    : Cristobal Camps
# ===========================================================
# Uso: Abrir PowerShell en la carpeta C:\fullstack3 y ejecutar:
#      .\generar_zip_entrega.ps1
# ===========================================================

$nombreZip = "Camps_Cristobal_Sumativa1_DSY2205.zip"
$carpetaProyecto = "."
$destino = "..\$nombreZip"

# Carpetas y archivos a EXCLUIR del ZIP
$excluir = @(
    "target",
    ".git",
    ".vscode",
    "*.zip",
    ".env",
    "wallet",
    "Wallet_*"
)

Write-Host "Generando ZIP de entrega limpio..." -ForegroundColor Cyan

# Recopila todos los archivos del proyecto excluyendo las carpetas innecesarias
$archivos = Get-ChildItem -Path $carpetaProyecto -Recurse -File | Where-Object {
    $ruta = $_.FullName
    $excluir | ForEach-Object { $excluir } | Where-Object { $ruta -like "*\$_\*" -or $ruta -like "*\$_" } | Measure-Object | Select-Object -ExpandProperty Count
    -not ($excluir | Where-Object { $ruta -match [regex]::Escape($_) })
}

# Elimina el ZIP anterior si existe
if (Test-Path $destino) {
    Remove-Item $destino -Force
    Write-Host "ZIP anterior eliminado." -ForegroundColor Yellow
}

# Crea el ZIP con solo el código fuente
Compress-Archive -Path @(
    ".\src",
    ".\pom.xml",
    ".\mvnw",
    ".\mvnw.cmd",
    ".\script_bd_oracle.sql",
    ".\postman_coleccion_sumativa1.json",
    ".\.env.example",
    ".\README.md"
) -DestinationPath $destino -Force

Write-Host ""
Write-Host "✅ ZIP generado exitosamente: $destino" -ForegroundColor Green
Write-Host "   Incluye: src/, pom.xml, scripts SQL, colección Postman"
Write-Host "   Excluye: target/, .git/, .env, credenciales"
