@echo off
echo.
echo ============================================================
echo   SEMANA 4 - DSY2205 - Pasos a ejecutar en orden
echo ============================================================
echo.

echo PASO 1: Instalar el arquetipo Maven en repositorio local
echo ----------------------------------------------------------
echo cd C:\fullstack3\biblioteca-arquetipo
echo mvn install
echo.

echo PASO 2: Ejecutar el microservicio biblioteca-s4
echo ----------------------------------------------------------
echo cd C:\fullstack3\biblioteca-s4
echo mvn spring-boot:run
echo.
echo (El servidor levanta en http://localhost:8082/api/libros)
echo.

echo PASO 3: Probar con Postman (mientras el servidor esta corriendo)
echo ----------------------------------------------------------
echo GET    http://localhost:8082/api/libros
echo GET    http://localhost:8082/api/libros/1
echo POST   http://localhost:8082/api/libros
echo PUT    http://localhost:8082/api/libros/1
echo DELETE http://localhost:8082/api/libros/1
echo.

echo PASO 4: Git commit (desde C:\fullstack3)
echo ----------------------------------------------------------
echo cd C:\fullstack3
echo git add .
echo git commit -m "Semana 4: arquetipo Maven + patrones Singleton y Factory"
echo git push
echo.

echo PASO 5: Generar ZIP de entrega
echo ----------------------------------------------------------
echo cd C:\fullstack3
echo powershell -ExecutionPolicy Bypass -File .\empaquetar-s4.ps1
echo.

pause
