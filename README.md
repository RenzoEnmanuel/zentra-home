# ZENTRA HOME - Tienda virtual de electrodomésticos

Proyecto académico (IDAT, EFSRT). Tienda en línea con catálogo, registro de clientes, pedidos con código de rastreo y panel de administración.
1. TENER INSTALADOS **XAMPP VER 8.3 O SUPERIOR, COMPOSER Y NODE.JS** (VER REQUISITOS).

> [!CAUTION]
> ## LEER ANTES DE EJECUTAR: ERRORES MÁS COMUNES
>
> ### 1. LA EXTENSIÓN ZIP DE PHP ESTÁ DESACTIVADA
>
> En algunas versiones de XAMPP la extensión `zip` de PHP viene **desactivada**. Composer la necesita para instalar las librerías del back-end. Si está desactivada:
>
> - `composer install` **falla** (suele decir *"The zip extension and unzip/7z commands are both missing"*).
> - **No se crea la carpeta `vendor`** dentro de `zentra-api`.
> - La base de datos `zentra_home` **queda vacía, sin tablas**.
> - **No se puede entrar al panel de administrador.**
>
> **Cómo corregirlo (una sola vez por computadora):**
>
> 1. Abrir el archivo `php.ini` de XAMPP, normalmente `C:\xampp\php\php.ini`, con el Bloc de notas.
> 2. Buscar con Ctrl + F la línea `;extension=zip`.
> 3. **Quitarle el punto y coma (`;`) del inicio**, para que quede `extension=zip`, y guardar el archivo.
> 4. Cerrar la ventana negra del `.bat` y volver a ejecutar `instalar-back.bat`.
>
> Para confirmar que quedó activa, en CMD: `php -m | findstr /i zip` debe mostrar la palabra `zip`.
>
> ### 2. ERROR AL EXTRAER EL ZIP: "RUTA DE ACCESO DEMASIADO LARGA" (0x80010135)
>
> **EXTRAER EL ZIP EN UNA CARPETA CORTA, POR EJEMPLO `C:\ZentraHome`.** Si se extrae en una carpeta larga, Windows muestra este error. Si aparece, **cancelar y extraer en `C:\ZentraHome`. NO PRESIONAR "OMITIR"**, porque faltarían archivos.
>
> ### 3. EJECUTAR EL `.BAT` DESDE DENTRO DEL ZIP
>
> **NO EJECUTAR LOS `.bat` DESDE DENTRO DEL ZIP. PRIMERO EXTRAER TODO.**

## Arranque rápido (resumen)

1. Tener instalados **XAMPP, Composer y Node.js** (ver Requisitos).
2. Descargar el proyecto y **extraerlo en una carpeta corta**, por ejemplo `C:\ZentraHome`.
3. En XAMPP, **Start en MySQL y APACHE**. Luego doble clic en **`zentra-api\instalar-back.bat`** (arranca el back-end).
4. Doble clic en **`zentra-home\iniciar-front.bat`** (arranca el front-end) y abrir http://localhost:5173.

## Arquitectura

React (front) -> API REST en Laravel (back) -> MySQL (base de datos)

| Carpeta | Contenido | Tecnología |
|---|---|---|
| `zentra-home` | Tienda y panel admin | React 19 + Vite |
| `zentra-api` | API REST y base de datos | Laravel 13 + Sanctum |
| Base de datos `zentra_home` | Datos del sistema | MySQL / MariaDB (XAMPP) |

## Requisitos previos

- **Windows** con conexión a internet (para instalar las librerías).
- **XAMPP** instalado en `C:\xampp` (ruta por defecto), con **PHP 8.3 o superior**. Incluye MySQL y phpMyAdmin. Probado con PHP 8.3.36; también debería funcionar con 8.4 y 8.5.
- **Extensión `zip` de PHP activada** (ver el recuadro rojo del inicio).
- **Composer**: https://getcomposer.org/download/
- **Node.js 20.19 o superior**: https://nodejs.org
- `php`, `composer` y `node` deben reconocerse en CMD.

Para comprobarlo, abrir CMD y ejecutar estos comandos. Cada uno debe responder sin error:

    php -v
    composer -V
    node -v
    php -m | findstr /i zip

El último debe mostrar la palabra **zip**. Si no muestra nada, seguir los pasos del recuadro rojo del inicio.

## Descargar el proyecto

**Opción A: ZIP.** Entrar a https://github.com/RenzoEnmanuel/zentra-home, botón verde **Code**, **Download ZIP**, y extraer en una carpeta corta.

**Opción B: git clone** (necesita Git instalado). En CMD:

    cd /d C:\
    git clone https://github.com/RenzoEnmanuel/zentra-home.git ZentraHome

Con esta opción las carpetas quedan en `C:\ZentraHome`, sin la carpeta `zentra-home-main`, y no aparece el error de ruta larga.

## Cómo arrancar el proyecto con los `.bat` (paso a paso)

1. Abrir **XAMPP** y presionar **Start** en **MySQL**. Dejarlo encendido mientras se use el proyecto.
2. Entrar a la carpeta **`zentra-api`** y hacer **doble clic** en **`instalar-back.bat`**. Crea la base de datos, las tablas, los 15 productos y el usuario admin, y arranca el back-end. **No cerrar esa ventana**: es el servidor del back-end.
3. **Comprobar que salió bien:** la ventana debe terminar con `Server running on [http://127.0.0.1:8000]` y debe existir la carpeta `vendor` dentro de `zentra-api`. Si aparecen errores antes de eso, volver al **recuadro rojo del inicio**.
4. Entrar a la carpeta **`zentra-home`** y hacer **doble clic** en **`iniciar-front.bat`**. Instala las librerías del front-end y lo arranca. **No cerrar esa ventana**: es el servidor del front-end.
5. Abrir http://localhost:5173 en el navegador.
6. *(Opcional)* Para ver la base de datos, encender también **Apache** en XAMPP y abrir http://localhost/phpmyadmin.

Siempre se necesitan **las dos ventanas negras abiertas** (back y front) mientras se usa la tienda.

## Instalación manual

Primero crear la base vacía `zentra_home` en phpMyAdmin (pestaña **Bases de datos**).

Back-end (en la carpeta `zentra-api`):

    copy .env.example .env
    composer install
    php artisan key:generate
    php artisan migrate --seed
    php artisan serve

Front-end (en la carpeta `zentra-home`):

    npm install
    npm run dev

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

## Otros problemas comunes

### Activé `zip` pero la base sigue vacía

Volver a ejecutar `instalar-back.bat`. Si no funciona, en `zentra-api` ejecutar:

    composer install
    php artisan key:generate
    php artisan migrate --seed --force

### "php" / "composer" / "npm" no se reconoce como un comando

El programa no está instalado o Windows no lo encuentra. Instalarlo (ver Requisitos), **cerrar la ventana negra y abrir una nueva**.

Si es `php` y XAMPP ya está instalado, agregarlo al PATH de Windows:
1. Buscar en Inicio "Editar las variables de entorno del sistema".
2. **Variables de entorno**, seleccionar **Path** (usuario), **Editar**, **Nuevo**.
3. Escribir `C:\xampp\php` y aceptar todo.
4. Abrir una ventana negra nueva y comprobar con `php -v`.

### Composer dice que la versión de PHP no es compatible

El proyecto necesita **PHP 8.3 o superior**. Revisar con `php -v` y actualizar XAMPP si es menor.

### Windows muestra un aviso al abrir el `.bat` ("Windows protegió su equipo")

El archivo viene de internet. Hacer clic en **Más información** y luego **Ejecutar de todas formas**. También se puede evitar con clic derecho al ZIP, **Propiedades**, marcar **Desbloquear** y extraer después. Si un antivirus lo bloquea, usar la **Instalación manual**.

### No se encontró XAMPP en `C:\xampp`

El `.bat` busca MySQL en `C:\xampp`. Si XAMPP está en otra carpeta, crear la base `zentra_home` en phpMyAdmin y usar la **Instalación manual**.

### El puerto 8000 o 5173 está ocupado

Hay una ventana vieja del back o del front abierta. Cerrar todas las ventanas negras anteriores y volver a ejecutar.

### La tienda abre pero no se ven productos

El back-end tiene que estar encendido: la ventana de `instalar-back.bat` debe seguir abierta. Probar http://127.0.0.1:8000/api/productos en el navegador.

### No puedo entrar como administrador

Si las tablas existen pero falta el admin, en `zentra-api` ejecutar:

    php artisan db:seed --class=AdminSeeder

## Equipo

- Oscar Osorio (líder)
- Daniel Pernia Zambrano (analista)
- Leydi Vargas Torres
