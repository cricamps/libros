@echo off
echo ============================================================
echo  SEMANA 7 - Tests + SonarQube
echo ============================================================
echo.

cd C:\fullstack3\biblioteca-frontend

echo [1/2] Ejecutando pruebas unitarias con cobertura...
call npx ng test --no-watch --no-progress --code-coverage --browsers=ChromeHeadless

if %errorlevel% neq 0 (
    echo ERROR en los tests. Revisa los errores arriba.
    pause
    exit /b 1
)

echo.
echo [2/2] Enviando analisis a SonarQube...
call npx sonar-scanner -Dsonar.token=squ_55132805f4a15b5e725843e46be910cb1a1629b5

if %errorlevel% neq 0 (
    echo ERROR en SonarQube scanner.
    pause
    exit /b 1
)

echo.
echo ============================================================
echo  LISTO! Revisa el reporte en: http://localhost:9000
echo ============================================================
pause
