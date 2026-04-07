# ============================================================
# empaquetar-s4.ps1
# Genera el ZIP de entrega para la actividad formativa S4
#
# DSY2205 - Desarrollo Full Stack III - Semana 4
# ============================================================
#
# INSTRUCCIONES:
#   1. Asegúrate de haber hecho git add + git commit antes.
#   2. Abrir PowerShell en C:\fullstack3
#   3. Ejecutar: .\empaquetar-s4.ps1
#   4. El ZIP quedará en C:\fullstack3\entrega-s4.zip
# ============================================================

Write-Host ""
Write-Host "============================================================" -ForegroundColor Cyan
Write-Host "  EMPAQUETANDO ENTREGA SEMANA 4 - DSY2205" -ForegroundColor Cyan
Write-Host "============================================================" -ForegroundColor Cyan
Write-Host ""

Add-Type -AssemblyName System.IO.Compression.FileSystem

$raiz    = "C:\fullstack3"
$zipPath = "$raiz\entrega-s4.zip"

# Eliminar ZIP anterior si existe
if (Test-Path $zipPath) {
    Remove-Item $zipPath -Force
    Write-Host "ZIP anterior eliminado." -ForegroundColor Yellow
}

# Carpetas a excluir
$excluir = @(
    "node_modules", ".angular", "dist", "target",
    ".git", "__pycache__", "entrega-s4.zip"
)

$zip = [System.IO.Compression.ZipFile]::Open($zipPath, 'Create')

# Función para agregar archivos al ZIP recursivamente
function AgregarAlZip($carpeta, $prefijo) {
    Get-ChildItem -Path $carpeta | ForEach-Object {
        $nombre = $_.Name

        # Saltar carpetas/archivos excluidos
        if ($excluir -contains $nombre) { return }

        $rutaEnZip = if ($prefijo) { "$prefijo/$nombre" } else { $nombre }

        if ($_.PSIsContainer) {
            AgregarAlZip $_.FullName $rutaEnZip
        } else {
            $entry = $zip.CreateEntry($rutaEnZip)
            $stream = $entry.Open()
            $bytes  = [System.IO.File]::ReadAllBytes($_.FullName)
            $stream.Write($bytes, 0, $bytes.Length)
            $stream.Close()
        }
    }
}

Write-Host "Empaquetando archivos..." -ForegroundColor Yellow
AgregarAlZip $raiz ""

$zip.Dispose()

$tamano = [math]::Round((Get-Item $zipPath).Length / 1MB, 2)
Write-Host ""
Write-Host "============================================================" -ForegroundColor Green
Write-Host "  ZIP GENERADO CORRECTAMENTE" -ForegroundColor Green
Write-Host "  Archivo : $zipPath" -ForegroundColor Green
Write-Host "  Tamano  : $tamano MB" -ForegroundColor Green
Write-Host "============================================================" -ForegroundColor Green
