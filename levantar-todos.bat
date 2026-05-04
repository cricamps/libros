@echo off
REM ============================================================
REM SCRIPT: Levantar los 3 microservicios + FrontEnd
REM DSY2205 - Sumativa 3
REM ============================================================
echo.
echo ============================================================
echo  TIENDA ONLINE - Levantando 3 microservicios + FrontEnd
echo ============================================================
echo.

echo [MS-1] Microservicio Usuarios (puerto 8081)...
start "MS-Usuarios-8081" cmd /k "cd /d C:\fullstack3 && mvn spring-boot:run"
timeout /t 8 /nobreak

echo [MS-2] Microservicio Gestion Productos (puerto 8082)...
start "MS-Gestion-8082" cmd /k "cd /d C:\fullstack3\ms-gestion && mvn spring-boot:run"
timeout /t 8 /nobreak

echo [MS-3] Microservicio Pedidos/Busqueda (puerto 8083)...
start "MS-Pedidos-8083" cmd /k "cd /d C:\fullstack3\ms-pedidos && mvn spring-boot:run"
timeout /t 5 /nobreak

echo [FE]   FrontEnd Angular (puerto 4200)...
start "Angular-4200" cmd /k "cd /d C:\fullstack3\tienda-frontend && npm start"

echo.
echo ============================================================
echo  Servicios iniciados:
echo  MS-1 Usuarios:          http://localhost:8081/api/usuarios
echo  MS-2 Gestion Productos: http://localhost:8082/api/gestion/productos
echo  MS-3 Pedidos/Busqueda:  http://localhost:8083/api/productos
echo  FrontEnd Angular:       http://localhost:4200
echo ============================================================
echo.
timeout /t 20 /nobreak
start http://localhost:4200
