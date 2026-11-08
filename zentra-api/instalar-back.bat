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

set "XAMPP="
for %%D in (C D E F) do if not defined XAMPP if exist "%%D:\xampp\php\php.exe" set "XAMPP=%%D:\xampp"
if not defined XAMPP (
  for /f "delims=" %%i in ('where php 2^>nul') do if not defined XAMPP if exist "%%~dpi..\mysql\bin\mysql.exe" set "XAMPP=%%~dpi.."
)
if defined XAMPP set "PATH=%XAMPP%\php;%PATH%"

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
  echo La extension zip de PHP esta desactivada. Intentando activarla automaticamente...
  if defined XAMPP if exist "%XAMPP%\php\php.ini" (
    copy /y "%XAMPP%\php\php.ini" "%XAMPP%\php\php.ini.bak" >nul
    powershell -NoProfile -Command "(Get-Content '%XAMPP%\php\php.ini') -replace '^\s*;\s*extension\s*=\s*zip\s*$','extension=zip' | Set-Content '%XAMPP%\php\php.ini'"
  )
  php -m | findstr /i /x zip >nul
  if errorlevel 1 (
    echo ERROR: no se pudo activar la extension zip automaticamente.
    echo 1. Abre el archivo php.ini de tu carpeta de XAMPP, normalmente C:\xampp\php\php.ini
    echo 2. Busca la linea  ;extension=zip
    echo 3. Quitale el punto y coma del inicio y guarda el archivo.
    echo 4. Cierra esta ventana y vuelve a ejecutar instalar-back.bat
    pause
    exit /b 1
  )
  echo La extension zip se activo correctamente.
)

echo [1/5] Creando la base de datos zentra_home...
set "MYSQLEXE="
if defined XAMPP if exist "%XAMPP%\mysql\bin\mysql.exe" set "MYSQLEXE=%XAMPP%\mysql\bin\mysql.exe"
if defined MYSQLEXE (
  "%MYSQLEXE%" -u root -e "CREATE DATABASE IF NOT EXISTS zentra_home CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci"
  if errorlevel 1 (
    echo ERROR: no se pudo conectar a MySQL.
    echo Abre el panel de XAMPP, pulsa Start en MySQL y vuelve a ejecutar este archivo.
    pause
    exit /b 1
  )
) else (
  echo AVISO: no se encontro mysql.exe de XAMPP. Se asume que la base zentra_home ya fue creada en phpMyAdmin.
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