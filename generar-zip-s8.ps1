$ErrorActionPreference = "Stop"

$origen = "C:\fullstack3"
$destino = "C:\fullstack3\entrega-sumativa3.zip"

if (Test-Path $destino) { Remove-Item $destino -Force }

Add-Type -AssemblyName System.IO.Compression.FileSystem
$zip = [System.IO.Compression.ZipFile]::Open($destino, 'Create')

function Add-ToZip($rutaBase, $ruta) {
    if (Test-Path $ruta -PathType Container) {
        $archivos = Get-ChildItem -Path $ruta -Recurse -File |
            Where-Object {
                $_.FullName -notmatch "\\node_modules\\" -and
                $_.FullName -notmatch "\\.angular\\" -and
                $_.FullName -notmatch "\\target\\" -and
                $_.FullName -notmatch "\\dist\\" -and
                $_.FullName -notmatch "\\coverage\\" -and
                $_.FullName -notmatch "\\.git\\"
            }
        foreach ($archivo in $archivos) {
            $nombreEnZip = $archivo.FullName.Substring($rutaBase.Length + 1)
            [System.IO.Compression.ZipFileExtensions]::CreateEntryFromFile($zip, $archivo.FullName, $nombreEnZip) | Out-Null
            Write-Host "  + $nombreEnZip"
        }
    } elseif (Test-Path $ruta -PathType Leaf) {
        $nombreEnZip = $ruta.Substring($rutaBase.Length + 1)
        [System.IO.Compression.ZipFileExtensions]::CreateEntryFromFile($zip, $ruta, $nombreEnZip) | Out-Null
        Write-Host "  + $nombreEnZip"
    }
}

Write-Host "Generando entrega-sumativa3.zip..." -ForegroundColor Cyan
Write-Host ""

# BackEnd principal
Write-Host "[1/6] BackEnd principal (microservicio usuarios+productos)..." -ForegroundColor Yellow
Add-ToZip $origen "$origen\src"
Add-ToZip $origen "$origen\pom.xml"

# MS Pedidos
Write-Host "[2/6] Microservicio ms-pedidos..." -ForegroundColor Yellow
Add-ToZip $origen "$origen\ms-pedidos\src"
Add-ToZip $origen "$origen\ms-pedidos\pom.xml"

# Arquetipo
Write-Host "[3/6] Arquetipo Maven..." -ForegroundColor Yellow
Add-ToZip $origen "$origen\biblioteca-arquetipo"

# FrontEnd Angular (sin node_modules, sin dist)
Write-Host "[4/6] Frontend Angular (src + configs)..." -ForegroundColor Yellow
Add-ToZip $origen "$origen\tienda-frontend\src"
Add-ToZip $origen "$origen\tienda-frontend\angular.json"
Add-ToZip $origen "$origen\tienda-frontend\karma.conf.js"
Add-ToZip $origen "$origen\tienda-frontend\tsconfig.json"
Add-ToZip $origen "$origen\tienda-frontend\tsconfig.app.json"
Add-ToZip $origen "$origen\tienda-frontend\tsconfig.spec.json"
Add-ToZip $origen "$origen\tienda-frontend\package.json"
Add-ToZip $origen "$origen\tienda-frontend\sonar-project.properties"

# Scripts y docs
Write-Host "[5/6] Scripts y documentacion..." -ForegroundColor Yellow
Add-ToZip $origen "$origen\instalar-deps-tests.bat"
Add-ToZip $origen "$origen\ejecutar-tests.bat"
Add-ToZip $origen "$origen\ejecutar-sonarqube.bat"
Add-ToZip $origen "$origen\levantar-todos.bat"
Add-ToZip $origen "$origen\.gitignore"
Add-ToZip $origen "$origen\INSTRUCCIONES.md"

$zip.Dispose()

Write-Host ""
$tamano = [math]::Round((Get-Item $destino).Length / 1MB, 2)
Write-Host "============================================" -ForegroundColor Green
Write-Host " ZIP generado: entrega-sumativa3.zip" -ForegroundColor Green
Write-Host " Tamano: $tamano MB" -ForegroundColor Green
Write-Host "============================================" -ForegroundColor Green
