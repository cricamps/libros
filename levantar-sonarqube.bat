@echo off
echo ============================================================
echo  Levantando SonarQube en Docker...
echo ============================================================

REM Verificar si ya existe el contenedor
docker ps -a --format "{{.Names}}" | findstr /i "sonarqube" >nul 2>&1
if %errorlevel% == 0 (
    echo Contenedor sonarqube ya existe. Iniciando...
    docker start sonarqube
) else (
    echo Descargando e iniciando SonarQube Community...
    docker run -d --name sonarqube -p 9000:9000 sonarqube:community
)

echo.
echo SonarQube iniciando... espera 2-3 minutos.
echo Luego abre: http://localhost:9000
echo Login: admin / admin
echo.
echo Esperando 90 segundos para que inicie...
timeout /t 90 /nobreak

echo.
echo Abriendo SonarQube en el navegador...
start http://localhost:9000
echo.
pause
