@echo off
echo ===== ZENTRA HOME - Instalacion del back-end =====
echo.
echo [1/5] Creando la base de datos zentra_home...
if exist "C:\xampp\mysql\bin\mysql.exe" (
  "C:\xampp\mysql\bin\mysql.exe" -u root -e "CREATE DATABASE IF NOT EXISTS zentra_home CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci"
) else (
  echo No se encontro XAMPP en C:\xampp. Crea la base zentra_home en phpMyAdmin y vuelve a ejecutar este archivo.
  pause
  exit /b 1
)
if not exist .env copy .env.example .env >nul
echo [2/5] Instalando librerias con Composer...
call composer install --no-interaction
echo [3/5] Generando la clave de la aplicacion...
call php artisan key:generate --force
echo [4/5] Creando tablas, productos y usuario admin...
call php artisan migrate --seed --force
echo [5/5] Iniciando el servidor en http://127.0.0.1:8000
call php artisan serve