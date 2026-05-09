# ============================================================
# generar-zip-eft.ps1
# Genera el ZIP final para la EFT de DSY2205
#
# Incluye:
#   - src/           (ms-usuarios, puerto 8081)
#   - ms-gestion/    (puerto 8082)
#   - ms-pedidos/    (puerto 8083)
#   - tienda-frontend/ (sin node_modules ni dist)
#   - biblioteca-arquetipo/
#   - docker-compose.yml
#   - script-bd-oracle.sql
#   - INSTRUCCIONES.md
# ============================================================

$ErrorActionPreference = "Stop"
$raiz    = $PSScriptRoot
$fecha   = Get-Date -Format "yyyyMMdd_HHmm"
$zipName = "DSY2205_EFT_TechStore_CristóbalCamps_$fecha.zip"
$zipPath = Join-Path $raiz $zipName
$tmpDir  = Join-Path $raiz "_zip_tmp_eft"

Write-Host ""
Write-Host "=======================================" -ForegroundColor Cyan
Write-Host "   Generando ZIP EFT – TechStore       " -ForegroundColor Cyan
Write-Host "=======================================" -ForegroundColor Cyan

# Limpiar temporal previo
if (Test-Path $tmpDir) { Remove-Item $tmpDir -Recurse -Force }
New-Item -ItemType Directory -Path $tmpDir | Out-Null

# ── Copiar carpetas del proyecto ──────────────────────────
$carpetas = @("src", "ms-gestion", "ms-pedidos", "biblioteca-arquetipo", ".mvn")
foreach ($c in $carpetas) {
    $origen = Join-Path $raiz $c
    if (Test-Path $origen) {
        Write-Host "  Copiando $c ..." -ForegroundColor Yellow
        Copy-Item $origen (Join-Path $tmpDir $c) -Recurse -Force
    }
}

# ── Copiar tienda-frontend (sin node_modules ni dist) ─────
Write-Host "  Copiando tienda-frontend (sin node_modules/dist) ..." -ForegroundColor Yellow
$frontSrc  = Join-Path $raiz "tienda-frontend"
$frontDest = Join-Path $tmpDir "tienda-frontend"
New-Item -ItemType Directory -Path $frontDest | Out-Null
Get-ChildItem $frontSrc -Exclude "node_modules","dist",".angular","coverage",".scannerwork" | ForEach-Object {
    Copy-Item $_.FullName $frontDest -Recurse -Force
}

# ── Copiar archivos raíz ──────────────────────────────────
$archivos = @("docker-compose.yml","script-bd-oracle.sql","pom.xml","mvnw","mvnw.cmd","Dockerfile")
foreach ($f in $archivos) {
    $ruta = Join-Path $raiz $f
    if (Test-Path $ruta) {
        Copy-Item $ruta $tmpDir -Force
    }
}

# ── Generar INSTRUCCIONES.md ──────────────────────────────
$instrucciones = @"
# TechStore – Sistema de Gestión de Pedidos
## DSY2205 Desarrollo Full Stack III – EFT Semana 9
### Estudiante: Cristóbal Camps

---

## Arquitectura de Microservicios

| Servicio         | Puerto | Descripción                              |
|-----------------|--------|------------------------------------------|
| ms-usuarios      | 8081   | Control de usuarios y autenticación      |
| ms-gestion       | 8082   | Gestión de productos (solo ADMIN)        |
| ms-pedidos       | 8083   | Catálogo y compra de productos           |
| tienda-frontend  | 4200   | FrontEnd Angular 17 + Nginx              |

## Patrones de Diseño Implementados

- **Singleton**: Todos los servicios Spring (@Service) y Angular (providedIn: 'root')
- **Factory**: ProductoFactory (ms-gestion), PedidoFactory (ms-pedidos)
- **MVC**: Separación Controller / Service / Repository en BackEnd; componentes/servicios/guards en FrontEnd
- **Observer**: BehaviorSubject en AuthService y ProductoService (Angular)
- **Facade**: ProductoService abstrae catálogo, carrito y pedidos

## Arquetipo Maven

Ubicado en: `biblioteca-arquetipo/`
Instalado con: `cd biblioteca-arquetipo && mvn install`

## Credenciales de prueba

| Rol     | Email                   | Contraseña   |
|---------|-------------------------|--------------|
| ADMIN   | admin@techstore.cl      | Admin@123    |
| CLIENTE | juan@cliente.cl         | Cliente@123  |

## Instrucciones de ejecución local

### Paso 1 – Preparar wrappers Maven
\`\`\`powershell
.\preparar-microservicios.ps1
\`\`\`

### Paso 2 – Levantar con Docker Compose
\`\`\`powershell
docker-compose up --build
\`\`\`

### Paso 3 – Acceder
- FrontEnd:  http://localhost:4200
- MS-Usuarios: http://localhost:8081/api/usuarios
- MS-Gestión:  http://localhost:8082/api/gestion/productos
- MS-Pedidos:  http://localhost:8083/api/productos

## Base de Datos Oracle Cloud

- Instancia: BibliotecaDB (Oracle Autonomous)
- Región: sa-santiago-1
- Script inicial: `script-bd-oracle.sql`
- Tablas: USUARIOS, PRODUCTOS, PEDIDOS, DETALLE_PEDIDOS

## Pruebas Unitarias y Cobertura

\`\`\`powershell
cd tienda-frontend
npm run test:coverage
\`\`\`
Cobertura ≥ 80% verificada con SonarQube.

## Repositorio Git

https://github.com/cricamps/libros
"@
$instrucciones | Out-File (Join-Path $tmpDir "INSTRUCCIONES.md") -Encoding UTF8

# ── Comprimir ─────────────────────────────────────────────
Write-Host "  Comprimiendo en $zipName ..." -ForegroundColor Yellow
if (Test-Path $zipPath) { Remove-Item $zipPath -Force }
Add-Type -AssemblyName System.IO.Compression.FileSystem
[System.IO.Compression.ZipFile]::CreateFromDirectory($tmpDir, $zipPath)

# Limpiar temporal
Remove-Item $tmpDir -Recurse -Force

$size = [math]::Round((Get-Item $zipPath).Length / 1MB, 2)
Write-Host ""
Write-Host "=======================================" -ForegroundColor Green
Write-Host "  ZIP generado: $zipName" -ForegroundColor Green
Write-Host "  Tamaño: $size MB" -ForegroundColor Green
Write-Host "=======================================" -ForegroundColor Green
