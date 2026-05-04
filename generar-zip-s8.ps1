$ErrorActionPreference = "Stop"
$origen  = "C:\fullstack3"
$destino = "C:\fullstack3\entrega-sumativa3.zip"

if (Test-Path $destino) { Remove-Item $destino -Force }

Add-Type -AssemblyName System.IO.Compression.FileSystem
$zip = [System.IO.Compression.ZipFile]::Open($destino, 'Create')

function Add-ToZip($ruta) {
    if (Test-Path $ruta -PathType Container) {
        Get-ChildItem -Path $ruta -Recurse -File |
        Where-Object {
            $_.FullName -notmatch "\\node_modules\\" -and
            $_.FullName -notmatch "\\.angular\\" -and
            $_.FullName -notmatch "\\target\\" -and
            $_.FullName -notmatch "\\dist\\" -and
            $_.FullName -notmatch "\\coverage\\" -and
            $_.FullName -notmatch "\\.git\\"
        } | ForEach-Object {
            $entrada = $_.FullName.Substring($origen.Length + 1)
            [System.IO.Compression.ZipFileExtensions]::CreateEntryFromFile($zip, $_.FullName, $entrada) | Out-Null
            Write-Host "  + $entrada"
        }
    } elseif (Test-Path $ruta -PathType Leaf) {
        $entrada = $ruta.Substring($origen.Length + 1)
        [System.IO.Compression.ZipFileExtensions]::CreateEntryFromFile($zip, $ruta, $entrada) | Out-Null
        Write-Host "  + $entrada"
    }
}

Write-Host "Generando entrega-sumativa3.zip..." -ForegroundColor Cyan

Write-Host "[1/6] BackEnd principal (MS Usuarios + MS Gestion Productos)..." -ForegroundColor Yellow
Add-ToZip "$origen\src"
Add-ToZip "$origen\pom.xml"

Write-Host "[2/6] MS Pedidos (MS Busqueda/Compra)..." -ForegroundColor Yellow
Add-ToZip "$origen\ms-pedidos\src"
Add-ToZip "$origen\ms-pedidos\pom.xml"

Write-Host "[3/6] Arquetipo Maven..." -ForegroundColor Yellow
Add-ToZip "$origen\biblioteca-arquetipo"

Write-Host "[4/6] FrontEnd Angular..." -ForegroundColor Yellow
Add-ToZip "$origen\tienda-frontend\src"
Add-ToZip "$origen\tienda-frontend\angular.json"
Add-ToZip "$origen\tienda-frontend\karma.conf.js"
Add-ToZip "$origen\tienda-frontend\tsconfig.json"
Add-ToZip "$origen\tienda-frontend\tsconfig.app.json"
Add-ToZip "$origen\tienda-frontend\tsconfig.spec.json"
Add-ToZip "$origen\tienda-frontend\package.json"
Add-ToZip "$origen\tienda-frontend\sonar-project.properties"

Write-Host "[5/6] Script BD Oracle..." -ForegroundColor Yellow
Add-ToZip "$origen\script-bd-oracle.sql"

Write-Host "[6/6] Documentacion y scripts..." -ForegroundColor Yellow
Add-ToZip "$origen\INSTRUCCIONES.md"
Add-ToZip "$origen\SEMANA7_ACTIVIDAD.md"
Add-ToZip "$origen\.gitignore"

$zip.Dispose()

$mb = [math]::Round((Get-Item $destino).Length / 1MB, 2)
Write-Host ""
Write-Host "================================================" -ForegroundColor Green
Write-Host " ZIP generado: entrega-sumativa3.zip ($mb MB)" -ForegroundColor Green
Write-Host "================================================" -ForegroundColor Green
Write-Host ""
Write-Host " ENTREGABLES para subir al AVA:" -ForegroundColor Yellow
Write-Host " 1. entrega-sumativa3.zip" -ForegroundColor White
Write-Host " 2. Link GitHub: https://github.com/cricamps/libros" -ForegroundColor White
Write-Host " 3. Link video Kaltura" -ForegroundColor White
