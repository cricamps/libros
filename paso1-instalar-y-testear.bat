@echo off
REM ============================================================
REM PASO 1: Instalar dependencias de Karma en tienda-frontend
REM DSY2205 - Semana 7
REM ============================================================
echo.
echo ============================================================
echo  [PASO 1/2] Instalando Karma + Jasmine + Coverage
echo ============================================================
echo.

cd /d C:\fullstack3\tienda-frontend

echo Instalando dependencias de testing...
call npm install --save-dev ^
  karma@~6.4.0 ^
  karma-chrome-launcher@~3.2.0 ^
  karma-coverage@~2.2.0 ^
  karma-jasmine@~5.1.0 ^
  karma-jasmine-html-reporter@~2.1.0 ^
  jasmine-core@~5.1.0 ^
  @types/jasmine@~5.1.0

if %errorlevel% neq 0 (
    echo ERROR: Fallo la instalacion de Karma.
    pause
    exit /b 1
)

echo.
echo ============================================================
echo  [PASO 2/2] Ejecutando pruebas con cobertura
echo ============================================================
echo.

call npx ng test --watch=false --browsers=ChromeHeadless --code-coverage

echo.
echo ============================================================
echo  Pruebas completadas!
echo  Reporte en: coverage\tienda-frontend\index.html
echo  lcov.info  : coverage\tienda-frontend\lcov.info
echo ============================================================
echo.
echo Abriendo reporte HTML...
start coverage\tienda-frontend\index.html
pause
