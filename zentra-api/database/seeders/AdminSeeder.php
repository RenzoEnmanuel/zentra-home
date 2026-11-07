<?php

namespace Database\Seeders;

use App\Models\Cliente;
use Illuminate\Database\Seeder;

class AdminSeeder extends Seeder
{
    public function run(): void
    {
        // El usuario "admin" entra con documento ADMIN (o con el correo).
        // La contraseña se cifra sola (cast "hashed" del modelo Cliente).
        Cliente::updateOrCreate(
            ['documento' => 'ADMIN'],
            [
                'nombres'   => 'Administrador',
                'apellidos' => 'Zentra Home',
                'correo'    => 'admin@zentra.com',
                'rol'       => 'admin',
                'password'  => 'admin123',
            ]
        );
    }
}