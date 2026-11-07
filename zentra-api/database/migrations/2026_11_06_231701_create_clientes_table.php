<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('clientes', function (Blueprint $table) {
            $table->increments('id_cliente');
            $table->string('nombres', 100);
            $table->string('apellidos', 100);
            $table->string('correo', 150)->unique();
            $table->string('documento', 20)->unique();
            $table->string('password');
            $table->timestamp('fecha_registro')->useCurrent();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('clientes');
    }
};