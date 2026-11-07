<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('productos', function (Blueprint $table) {
            $table->increments('id_producto');
            $table->unsignedInteger('id_categoria');
            $table->string('codigo_sku', 50)->unique();
            $table->string('nombre', 150);
            $table->string('marca', 80);
            $table->text('descripcion')->nullable();
            $table->decimal('precio_regular', 10, 2);
            $table->decimal('precio_oferta', 10, 2)->nullable();
            $table->unsignedInteger('stock')->default(0);
            $table->string('imagen_url', 255)->nullable();
            $table->boolean('activo')->default(true);

            $table->foreign('id_categoria')
                  ->references('id_categoria')
                  ->on('categorias');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('productos');
    }
};