# ZENTRA HOME - Tienda virtual de electrodomésticos

Proyecto académico (IDAT, EFSRT). Tienda en línea con catálogo, registro de clientes, pedidos con código de rastreo y panel de administración.

## Arquitectura

React (front) -> API REST en Laravel (back) -> MySQL (base de datos)

| Carpeta | Contenido | Tecnología |
|---|---|---|
| `zentra-home` | Tienda y panel admin | React 19 + Vite |
| `zentra-api` | API REST y base de datos | Laravel 13 + Sanctum |
| Base de datos | `zentra_home` | MySQL (XAMPP) |

## Requisitos

- XAMPP (con MySQL) encendido
- PHP 8.3 o superior
- Composer
- Node.js

## Instalación rápida (Windows)

1. Encender **MySQL** en el panel de XAMPP.
2. Doble clic en `zentra-api\instalar-back.bat` (crea la base, las tablas, los 15 productos y el usuario admin). Dejar la ventana abierta.
3. Doble clic en `zentra-home\iniciar-front.bat`. Dejar la ventana abierta.
4. Abrir http://localhost:5173
5. 5. (Opcional) Para ver la base de datos, encender también Apache
   en XAMPP y abrir http://localhost/phpmyadmin        ← NUEVO

## Instalación manual

Back-end (en la carpeta `zentra-api`):

    copy .env.example .env
    composer install
    php artisan key:generate
    php artisan migrate --seed
    php artisan serve

Front-end (en la carpeta `zentra-home`):

    npm install
    npm run dev

Antes de `migrate`, crear la base vacía `zentra_home` en phpMyAdmin.

## Usuarios de prueba

| Rol | Usuario | Contraseña |
|---|---|---|
| Administrador | `admin` | `admin123` |
| Cliente | Se crea desde "Iniciar sesión" -> "Regístrate" | La que elija |

## Qué funciona con la base de datos real

- Catálogo de 15 productos por categorías (lee de MySQL; el stock se refleja en tiempo real).
- Registro, inicio y cierre de sesión con tokens (Laravel Sanctum). Contraseñas cifradas con bcrypt.
- Compra: crea el pedido, calcula precios desde la base, descuenta stock en una transacción y genera el código `ZH-2026-0001`.
- Rastreo de pedido por código.
- Panel admin: inicio de sesión con rol, lista de pedidos reales y cambio de estado (Registrado, En proceso, Despachado, Entregado).

## Prototipo con datos simulados (siguiente etapa)

- Panel admin: pantalla Resumen (gráficos y totales).
- Panel admin: crear, editar y desactivar productos (hoy solo en memoria).
- Panel admin: módulo Clientes.

## Endpoints principales

| Método | Ruta | Acceso |
|---|---|---|
| GET | `/api/productos`, `/api/productos/{id}`, `/api/categorias` | Público |
| POST | `/api/register`, `/api/login` | Público |
| POST | `/api/logout` | Cliente con token |
| POST | `/api/pedidos` | Cliente con token |
| GET | `/api/pedidos/{codigo}` | Público |
| GET | `/api/admin/pedidos` | Solo admin |
| PATCH | `/api/admin/pedidos/{codigo}` | Solo admin |

## Base de datos

Tablas del sistema: `categorias`, `productos`, `clientes` (con campo `rol`), `pedidos`, `detalle_pedidos` y `personal_access_tokens`. Se crean con migraciones de Laravel (`database/migrations`).

## Equipo

- Oscar Osorio (líder)
- Daniel Pernia Zambrano (analista)
- Leydi Vargas Torres (UI/UX, Figma)
- Jogeiber Cardona Useche (Front-End)
- Renzo Coaguila Palacios (Back-End y Base de Datos)
