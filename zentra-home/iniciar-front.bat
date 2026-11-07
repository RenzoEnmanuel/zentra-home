@echo off
echo ===== ZENTRA HOME - Front-end =====
echo.
echo Instalando librerias (solo la primera vez tarda)...
call npm install
echo.
echo Iniciando la tienda en http://localhost:5173
call npm run dev