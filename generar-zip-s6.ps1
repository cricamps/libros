# ============================================================
# generar-zip-s6.ps1
# Genera el ZIP de entrega para Semana 6
# DSY2205 - Actividad Formativa 4
# ============================================================

Add-Type -AssemblyName System.IO.Compression.FileSystem

$origen    = "C:\fullstack3"
$destino   = "C:\fullstack3\entrega_S6_DSY2205.zip"

# Carpetas y archivos a incluir
$incluir = @(
    "biblioteca-s4",
    "biblioteca-frontend",
    "biblioteca-arquetipo",
    "docker-compose.yml",
    "docker-push.ps1",
    "INSTRUCCIONES.md"
)

# Carpetas a excluir dentro de los proyectos
$excluir = @(
    "node_modules", ".angular", "dist", "target",
    ".git", ".idea", ".vscode", "__pycache__"
)

# Eliminar ZIP anterior si existe
if (Test-Path $destino) { Remove-Item $destino -Force }

$zip = [System.IO.Compression.ZipFile]::Open($destino, 'Create')

foreach ($item in $incluir) {
    $ruta = Join-Path $origen $item

    if (Test-Path $ruta -PathType Leaf) {
        # Es un archivo
        $entrada = $zip.CreateEntry($item)
        $stream  = $entrada.Open()
        $bytes   = [System.IO.File]::ReadAllBytes($ruta)
        $stream.Write($bytes, 0, $bytes.Length)
        $stream.Close()
        Write-Host "  + $item" -ForegroundColor Green

    } elseif (Test-Path $ruta -PathType Container) {
        # Es una carpeta — recorrer recursivamente
        $archivos = Get-ChildItem -Path $ruta -Recurse -File

        foreach ($archivo in $archivos) {
            # Verificar si está en una carpeta excluida
            $excluido = $false
            foreach ($ex in $excluir) {
                if ($archivo.FullName -like "*\$ex\*") {
                    $excluido = $true
                    break
                }
            }
            if ($excluido) { continue }

            $rutaRelativa = $archivo.FullName.Substring($origen.Length + 1).Replace("\", "/")
            $entrada = $zip.CreateEntry($rutaRelativa)
            $stream  = $entrada.Open()
            $bytes   = [System.IO.File]::ReadAllBytes($archivo.FullName)
            $stream.Write($bytes, 0, $bytes.Length)
            $stream.Close()
        }
        Write-Host "  + $item\" -ForegroundColor Green
    }
}

$zip.Dispose()

$size = [math]::Round((Get-Item $destino).Length / 1MB, 2)
Write-Host ""
Write-Host "============================================" -ForegroundColor Cyan
Write-Host "  ZIP generado exitosamente!" -ForegroundColor Cyan
Write-Host "============================================" -ForegroundColor Cyan
Write-Host "  Archivo : $destino" -ForegroundColor White
Write-Host "  Tamanio : $size MB" -ForegroundColor White
Write-Host ""
Write-Host "  GitHub  : https://github.com/cricamps/libros" -ForegroundColor Yellow
Write-Host ""
