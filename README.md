
# ZENTRA HOME - Tienda virtual de electrodomésticos

Proyecto académico (IDAT, EFSRT). Tienda en línea con catálogo, registro de clientes, pedidos con código de rastreo y panel de administración.

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
- **Extensión `zip` de PHP activada** (ver el aviso de abajo).
- **Composer**: https://getcomposer.org/download/
- **Node.js 20.19 o superior**: https://nodejs.org
- `php`, `composer` y `node` deben reconocerse en CMD.

## Revisar ANTES de instalar

Abrir CMD y ejecutar estos comandos. Cada uno debe responder sin error:

    php -v
    composer -V
    node -v
    php -m | findstr /i zip

El último debe mostrar la palabra **zip**. **Si no muestra nada, leer el aviso siguiente.**

> [!CAUTION]
> ## ERROR MÁS COMÚN: LA EXTENSIÓN ZIP DE PHP ESTÁ DESACTIVADA
>
> En algunas versiones de XAMPP la extensión `zip` de PHP viene **desactivada**. Composer la necesita para instalar las librerías del back-end. Si está desactivada:
>
> - `composer install` **falla** (suele decir *"The zip extension and unzip/7z commands are both missing"*).
> - **No se crea la carpeta `vendor`** dentro de `zentra-api`.
> - La base de datos `zentra_home` **queda vacía, sin tablas**.
> - **No se puede entrar al panel de administrador.**
>
> ### Cómo corregirlo (una sola vez por computadora)
>
> 1. Abrir el archivo `php.ini` de XAMPP, normalmente `C:\xampp\php\php.ini`, con el Bloc de notas.
> 2. Buscar con Ctrl + F la línea `;extension=zip`.
> 3. **Quitarle el punto y coma (`;`) del inicio**, para que quede `extension=zip`, y guardar el archivo.
> 4. Cerrar la ventana negra del `.bat` y volver a ejecutar `instalar-back.bat`.
>
> Para confirmar que quedó activa, en CMD: `php -m | findstr /i zip` debe mostrar la palabra `zip`.

> [!WARNING]
> ## ERROR AL EXTRAER EL ZIP: "RUTA DE ACCESO DEMASIADO LARGA" (0x80010135)
>
> **EXTRAER EL ZIP EN UNA CARPETA CORTA,
