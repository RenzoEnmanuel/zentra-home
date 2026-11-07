<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

class CatalogoSeeder extends Seeder
{
    public function run(): void
    {
        Schema::disableForeignKeyConstraints();
        DB::table('productos')->truncate();
        DB::table('categorias')->truncate();
        Schema::enableForeignKeyConstraints();

        $categorias = ['Refrigeración', 'Lavado', 'Cocina', 'Entretenimiento', 'Pequeños electrodomésticos'];
        foreach ($categorias as $i => $nombre) {
            DB::table('categorias')->insert([
                'id_categoria' => $i + 1,
                'nombre'       => $nombre,
                'activo'       => true,
            ]);
        }

        // id, categoría, sku, nombre, marca, descripción, precio regular, precio oferta, stock, imagen, imágenes, características
        $productos = [
            [1, 3, 'ZH-001', 'Robot de cocina multifunción 38 cm x 32 cm x 35 cm', 'Por confirmar', 'Robot de cocina multifunción con pantalla táctil para preparar recetas paso a paso.', 2000, 1899, 12, '/productos/robot-cocina.jpg', null, [['etiqueta' => 'Dimensiones', 'valor' => '38 x 32 x 35 cm'], ['etiqueta' => 'Pantalla', 'valor' => 'Táctil']]],
            [2, 5, 'ZH-002', 'Licuadora de Dial Roja 550W', 'Oster', 'Licuadora de 550 W con vaso de vidrio y control de dial.', 450, 350, 4, '/productos/licuadora-oster.jpg', null, [['etiqueta' => 'Potencia', 'valor' => '550 W']]],
            [3, 2, 'ZH-003', 'LAVADORA Bespoke AI 25Kg Acero Oscuro Wf90f25adspe', 'Samsung', 'Lavadora de gran capacidad con tecnología AI y eficiencia energética.', 1900, 1850, 2, '/productos/lavadora-bespoke.jpg', ['/productos/lavadora-bespoke.jpg', '/productos/lavadora-bespoke-2.jpg'], [['etiqueta' => 'Capacidad', 'valor' => '25 Kg'], ['etiqueta' => 'Color', 'valor' => 'Acero oscuro']]],
            [4, 1, 'ZH-004', 'Refrigeradora MIDEA SIDE 511LTS', 'Midea', 'Refrigeradora side by side de 511 litros.', 3000, 2500, 15, '/productos/refrigeradora-midea.jpg', null, null],
            [5, 3, 'ZH-005', 'Cocina Eléctrica Infrarroja RAF R.8109 de 2 Hornillas 4400W Panel Táctil', 'RAF', 'Cocina eléctrica infrarroja de 2 hornillas con panel táctil.', 139, 84, 0, '/productos/cocina-raf.jpg', null, null],
            [6, 3, 'ZH-006', 'MICROONDAS Empotrable Emtp24g2gxb 32 lt Negro', 'Por confirmar', 'Microondas empotrable de 32 litros, color negro.', 259, 249, 20, '/productos/microondas.jpg', null, null],
            [7, 5, 'ZH-007', 'PICATODO 3.5 Tazas - Onyx black', 'Por confirmar', 'Procesador de alimentos de 3.5 tazas.', 219, 169, 0, '/productos/picatodo.jpg', null, null],
            [8, 5, 'ZH-008', 'Plancha vapor 1400W compacta Antiadherente', 'Por confirmar', 'Plancha a vapor compacta con base antiadherente.', 199, 149, 25, '/productos/plancha.jpg', null, null],
            [9, 4, 'ZH-009', 'LG Equipo de sonido 480W Bluetooth CJ44', 'LG', 'Equipo de sonido de 480 W con Bluetooth, radio FM y luces LED.', 899, 679, 10, '/productos/equipo-sonido-lg.jpg', null, null],
            [10, 4, 'ZH-010', 'Consola Playstation 5 Slim con lectora de discos', 'Sony', 'Consola PlayStation 5 Slim con lectora de discos.', 3599, 3099, 30, '/productos/ps5.jpg', null, null],
            [11, 3, 'ZH-011', 'Cafetera automática 15 Lt Supremakaffe Touch Th-1750exnl 1350W', 'Supremakaffe', 'Cafetera automática con pantalla táctil de 1350 W.', 2499, 1899, 12, '/productos/cafetera.jpg', null, null],
            [12, 2, 'ZH-012', 'Lava seca Ecobubble con Airwash 11kg/7kg', 'Samsung', 'Lavasecadora con tecnología Ecobubble y Airwash.', 4999, 3000, 18, '/productos/lava-seca.jpg', null, null],
            [13, 4, 'ZH-013', 'Televisor 32 PFD6910 mas Reproductor DVD Maxtron MX 1808', 'Philips', 'Televisor LED de 32 pulgadas con reproductor DVD.', 699, 569, 22, '/productos/televisor-philips.jpg', null, null],
            [14, 5, 'ZH-014', 'Batidora de mano tecnología HeatSoft FPSTHMAMR', 'Por confirmar', 'Batidora de mano con tecnología HeatSoft.', 1800, 1200, 14, '/productos/batidora.jpg', null, null],
            [15, 5, 'ZH-015', 'Licuadora Portátil Shake & Go Mini colores', 'Por confirmar', 'Licuadora portátil recargable en varios colores.', 35, 30, 40, '/productos/licuadora-portatil.jpg', null, null],
        ];

        foreach ($productos as $f) {
            DB::table('productos')->insert([
                'id_producto'     => $f[0],
                'id_categoria'    => $f[1],
                'codigo_sku'      => $f[2],
                'nombre'          => $f[3],
                'marca'           => $f[4],
                'descripcion'     => $f[5],
                'precio_regular'  => $f[6],
                'precio_oferta'   => $f[7],
                'stock'           => $f[8],
                'imagen_url'      => $f[9],
                'imagenes'        => $f[10] === null ? null : json_encode($f[10], JSON_UNESCAPED_UNICODE),
                'caracteristicas' => $f[11] === null ? null : json_encode($f[11], JSON_UNESCAPED_UNICODE),
                'activo'          => true,
            ]);
        }
    }
}