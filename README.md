IMPORTANTE LEER EL README PRIMERO SOBRETODO LA SECCION DE PROBLEMAS COMUNES Y COMO SOLUCIONARLOS
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
- **XAMPP** con **PHP 8.3 o superior** (incluye MySQL y phpMyAdmin). Probado con PHP 8.3.36; también debería funcionar con 8.4 y 8.5.
- **Composer**: https://getcomposer.org/download/
- **Node.js 20.19 o superior**: https://nodejs.org

La extensión `zip` de PHP debe estar activada. `instalar-back.bat` la activa automáticamente si está apagada (ver "Problemas comunes").

Para comprobar las versiones, abrir CMD y ejecutar `php -v`, `composer -V` y `node -v`.

## Descargar el proyecto

**Opción A: ZIP.** Entrar a https://github.com/RenzoEnmanuel/zentra-home, botón verde **Code**, **Download ZIP**.

**Opción B: git clone** (necesita Git instalado). En CMD:

    cd /d C:\
    git clone https://github.com/RenzoEnmanuel/zentra-home.git ZentraHome

Con esta opción las carpetas quedan en `C:\ZentraHome`, sin la carpeta `zentra-home-main`, y no aparece el error de ruta larga.

> **IMPORTANTE: EXTRAER EL ZIP EN UNA CARPETA CORTA, POR EJEMPLO `C:\ZentraHome`. SI LO EXTRAES EN UNA CARPETA LARGA, WINDOWS DA EL ERROR "RUTA DE ACCESO DEMASIADO LARGA" (0x80010135). SI TE SALE, CANCELA Y EXTRAE EN `C:\ZentraHome`. NO PRESIONES "OMITIR".**
>
> **NO EJECUTES LOS `.bat` DESDE DENTRO DEL ZIP. PRIMERO EXTRAE TODO.**

## Instalación rápida (Windows)

1. Abrir **XAMPP** y presionar **Start** en **MySQL**. Dejarlo encendido mientras se use el proyecto.
2. Descargar y extraer el proyecto (ver arriba). Dentro hay `zentra-api`, `zentra-home` y este README.
3. Entrar a la carpeta `zentra-api` y hacer **doble clic** en `instalar-back.bat`. Crea la base, las tablas, los 15 productos y el usuario admin. **No cerrar esa ventana**: es el servidor del back-end.
4. Entrar a la carpeta `zentra-home` y hacer **doble clic** en `iniciar-front.bat`. **No cerrar esa ventana**: es el servidor del front-end.
5. Abrir http://localhost:5173 en el navegador.
6. *(Opcional)* Para ver la base de datos, encender también **Apache** en XAMPP y abrir http://localhost/phpmyadmin.

El `.bat` busca XAMPP automáticamente (en los discos C, D, E y F). Si algo falta, se detiene y muestra un mensaje que empieza con **ERROR** explicando qué hacer. Ver también "Problemas comunes".

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

## Problemas comunes

### `composer install` falla, no aparece la carpeta `vendor` o la base `zentra_home` queda vacía (sin tablas ni admin)

**Causa:** la extensión `zip` de PHP viene desactivada por defecto en algunas versiones de XAMPP y Composer la necesita.

**Solución automática:** `instalar-back.bat` detecta que está apagada y la activa solo (guarda una copia de seguridad en `php.ini.bak`). No hay que hacer nada.

**Solución manual** (si el `.bat` no pudo activarla, por ejemplo por falta de permisos o por usar otra ruta de XAMPP):
1. Abrir `C:\xampp\php\php.ini` con el Bloc de notas.
2. Buscar (Ctrl + F) la línea `;extension=zip`.
3. Quitarle el `;` del inicio para que quede `extension=zip`, y guardar.
4. Cerrar la ventana del `.bat`, abrir una nueva y volver a ejecutar `instalar-back.bat`.

Para comprobar si está activa, en CMD: `php -m | findstr /i zip`. Si aparece la palabra `zip`, está activada.

### "php" / "composer" / "npm" no se reconoce como un comando

El programa no está instalado o Windows no lo encuentra. Instalarlo (ver Requisitos), **cerrar la ventana negra y abrir una nueva**. Para los comandos manuales con PHP de XAMPP, agregar la carpeta `php` de XAMPP (por ejemplo `C:\xampp\php`) al PATH de Windows. `instalar-back.bat` ya lo hace por su cuenta.

### Composer dice que la versión de PHP no es compatible

El proyecto necesita **PHP 8.3 o superior**. Revisar con `php -v` y actualizar XAMPP si es menor.

### El `.bat` dice que no se pudo conectar a MySQL

Abrir el panel de XAMPP, presionar **Start** en MySQL (debe ponerse en verde) y volver a ejecutar el `.bat`.

### Windows muestra un aviso al abrir el `.bat` ("Windows protegió su equipo")

El archivo viene de internet. Hacer clic en **Más información** y luego **Ejecutar de todas formas**. También se puede evitar con clic derecho al ZIP, **Propiedades**, marcar **Desbloquear** y extraer después. Si un antivirus lo bloquea, usar la **Instalación manual**.

### Error "ruta de acceso demasiado larga" al extraer el ZIP

Ver el aviso en "Descargar el proyecto": extraer en `C:\ZentraHome` o usar `git clone`.

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
- Leydi Vargas Torres (UI/UX, Figma)
- Jogeiber Cardona Useche (Front-End)
- Renzo Coaguila Palacios (Back-End y Base de Datos)
