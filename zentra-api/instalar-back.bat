@echo off
cd /d "%~dp0"
echo ===== ZENTRA HOME - Instalacion del back-end =====
echo.

if not exist artisan (
  echo ERROR: no se encuentra el archivo artisan.
  echo Extrae el ZIP completo y ejecuta este archivo desde la carpeta zentra-api.
  pause
  exit /b 1
)

echo Comprobando requisitos...
if exist "C:\xampp\php\php.exe" set "PATH=C:\xampp\php;%PATH%"

where php >nul 2>nul
if errorlevel 1 (
  echo ERROR: PHP no se reconoce.
  echo Instala XAMPP con PHP 8.3 o superior, abre una ventana nueva y vuelve a ejecutar este archivo.
  pause
  exit /b 1
)

where composer >nul 2>nul
if errorlevel 1 (
  echo ERROR: Composer no se reconoce.
  echo Instalalo desde https://getcomposer.org/download/ , abre una ventana nueva y vuelve a ejecutar este archivo.
  pause
  exit /b 1
)

php -m | findstr /i /x zip >nul
if errorlevel 1 (
  echo ERROR: la extension zip de PHP esta desactivada y Composer la necesita.
  echo 1. Abre el archivo C:\xampp\php\php.ini con el Bloc de notas.
  echo 2. Busca la linea  ;extension=zip
  echo 3. Quitale el punto y coma del inicio y guarda el archivo.
  echo 4. Cierra esta ventana y vuelve a ejecutar instalar-back.bat
  pause
  exit /b 1
)

echo [1/5] Creando la base de datos zentra_home...
if exist "C:\xampp\mysql\bin\mysql.exe" (
  "C:\xampp\mysql\bin\mysql.exe" -u root -e "CREATE DATABASE IF NOT EXISTS zentra_home CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci"
) else (
  echo No se encontro XAMPP en C:\xampp. Crea la base zentra_home en phpMyAdmin y vuelve a ejecutar este archivo.
  pause
  exit /b 1
)
if errorlevel 1 (
  echo ERROR: no se pudo conectar a MySQL.
  echo Abre el panel de XAMPP, pulsa Start en MySQL y vuelve a ejecutar este archivo.
  pause
  exit /b 1
)

if not exist .env copy .env.example .env >nul

echo [2/5] Instalando librerias con Composer...
call composer install --no-interaction
if errorlevel 1 (
  echo ERROR: Composer no pudo instalar las librerias. Revisa los mensajes de arriba.
  pause
  exit /b 1
)

echo [3/5] Generando la clave de la aplicacion...
call php artisan key:generate --force
if errorlevel 1 (
  echo ERROR: no se pudo generar la clave. Revisa los mensajes de arriba.
  pause
  exit /b 1
)

echo [4/5] Creando tablas, productos y usuario admin...
call php artisan migrate --seed --force
if errorlevel 1 (
  echo ERROR: no se pudieron crear las tablas. Revisa que MySQL este en verde en XAMPP.
  pause
  exit /b 1
)

echo [5/5] Iniciando el servidor en http://127.0.0.1:8000
call php artisan serve

echo.
echo El servidor se detuvo. Si fue por un error, lee el mensaje de arriba.
pause