@echo off
REM ============================================================
REM PASO 3: Ejecutar analisis SonarQube
REM PREREQUISITO: SonarQube corriendo + token configurado
REM DSY2205 - Semana 7
REM ============================================================

echo.
echo ============================================================
echo  ANALISIS SONARQUBE - DSY2205 Semana 7
echo ============================================================
echo.

cd /d C:\fullstack3\tienda-frontend

REM --- Verificar que el token fue configurado ---
findstr "REEMPLAZAR" sonar-project.properties >nul 2>&1
if %errorlevel%==0 (
    echo ERROR: El token de SonarQube no ha sido configurado.
    echo.
    echo Edita el archivo:
    echo   C:\fullstack3\tienda-frontend\sonar-project.properties
    echo.
    echo Y reemplaza la linea:
    echo   sonar.token=sqp_REEMPLAZAR_CON_TU_TOKEN
    echo Con tu token real generado en http://localhost:9000
    echo.
    pause
    exit /b 1
)

REM --- Verificar SonarQube corriendo ---
curl -s -o nul -w "%%{http_code}" http://localhost:9000 > %TEMP%\sq_check.txt 2>&1
set /p SQ_CODE=<%TEMP%\sq_check.txt
if not "%SQ_CODE%"=="200" (
    echo ERROR: SonarQube no esta corriendo en http://localhost:9000
    echo Ejecuta primero: .\paso2-iniciar-sonarqube.bat
    pause
    exit /b 1
)

echo [1/3] Generando cobertura con Karma (ChromeHeadless)...
call npx ng test --watch=false --browsers=ChromeHeadless --code-coverage
echo.

echo [2/3] Verificando que existe lcov.info...
if not exist "coverage\tienda-frontend\lcov.info" (
    echo ERROR: No se genero coverage\tienda-frontend\lcov.info
    echo Revisa que las pruebas hayan pasado correctamente.
    pause
    exit /b 1
)
echo lcov.info encontrado OK.
echo.

echo [3/3] Ejecutando sonar-scanner...
REM Intentar sonar-scanner global primero, luego npx
where sonar-scanner >nul 2>&1
if %errorlevel%==0 (
    sonar-scanner
) else (
    echo sonar-scanner no encontrado en PATH, intentando con npx...
    call npx sonar-scanner
)

echo.
echo ============================================================
echo  Analisis completado!
echo  Ver resultados en: http://localhost:9000
echo  Proyecto: tienda-online-frontend
echo ============================================================
echo.
start http://localhost:9000/dashboard?id=tienda-online-frontend
pause
