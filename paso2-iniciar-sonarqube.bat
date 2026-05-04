@echo off
REM ============================================================
REM PASO 2: Configurar y lanzar SonarQube
REM PREREQUISITO: SonarQube descargado y descomprimido
REM DSY2205 - Semana 7
REM ============================================================

echo.
echo ============================================================
echo  CONFIGURACION SONARQUBE - DSY2205 Semana 7
echo ============================================================
echo.

REM --- Verificar si SonarQube esta corriendo ---
curl -s -o nul -w "%%{http_code}" http://localhost:9000 > %TEMP%\sq_status.txt 2>&1
set /p SQ_STATUS=<%TEMP%\sq_status.txt

if "%SQ_STATUS%"=="200" (
    echo SonarQube YA esta corriendo en http://localhost:9000
    goto :sonar_ok
)

echo SonarQube NO esta corriendo. Intentando iniciar...
echo.

REM --- Cambiar temporalmente a JDK 17 si existe ---
if exist "C:\Program Files\Java\jdk-17" (
    echo Cambiando a JDK 17 para SonarQube...
    set JAVA_HOME=C:\Program Files\Java\jdk-17
    set PATH=%JAVA_HOME%\bin;%PATH%
) else (
    echo AVISO: JDK 17 no encontrado en C:\Program Files\Java\jdk-17
    echo SonarQube puede funcionar con JDK 21 en versiones recientes.
    echo Si falla, instala JDK 17 desde:
    echo https://www.oracle.com/java/technologies/javase/jdk17-archive-downloads.html
    echo.
)

REM --- Buscar SonarQube en rutas comunes ---
set SQ_PATH=
if exist "C:\sonarqube\bin\windows-x86-64\StartSonar.bat" set SQ_PATH=C:\sonarqube
if exist "C:\sonar\bin\windows-x86-64\StartSonar.bat"     set SQ_PATH=C:\sonar
if exist "C:\tools\sonarqube\bin\windows-x86-64\StartSonar.bat" set SQ_PATH=C:\tools\sonarqube

if "%SQ_PATH%"=="" (
    echo.
    echo ERROR: No se encontro SonarQube instalado.
    echo.
    echo Descargalo desde:
    echo   https://www.sonarsource.com/products/sonarqube/downloads/
    echo.
    echo Luego descomprimelo en C:\sonarqube y vuelve a ejecutar este script.
    pause
    exit /b 1
)

echo Iniciando SonarQube desde %SQ_PATH%...
start "SonarQube" cmd /k "%SQ_PATH%\bin\windows-x86-64\StartSonar.bat"

echo.
echo Esperando que SonarQube inicie (puede tomar 1-2 minutos)...
timeout /t 30 /nobreak

:sonar_ok
echo.
echo Abriendo SonarQube en el navegador...
start http://localhost:9000
echo.
echo ============================================================
echo  PROXIMOS PASOS:
echo  1. Login: admin / admin (cambiar password si es 1era vez)
echo  2. Crear proyecto local -> nombre: tienda-online-frontend
echo  3. Generar token: My Account -> Security -> Generate Token
echo  4. Copiar el token
echo  5. Editar: C:\fullstack3\tienda-frontend\sonar-project.properties
echo     Reemplazar: sonar.token=sqp_REEMPLAZAR_CON_TU_TOKEN
echo     Con:        sonar.token=sqp_TU_TOKEN_REAL
echo  6. Ejecutar: .\paso3-ejecutar-sonar.bat
echo ============================================================
echo.
pause
