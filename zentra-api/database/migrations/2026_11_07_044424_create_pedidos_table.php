<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('pedidos', function (Blueprint $table) {
            $table->increments('id_pedido');
            $table->unsignedInteger('id_cliente');
            $table->string('codigo_rastreo', 20)->unique();
            $table->string('estado', 20)->default('Registrado');
            $table->timestamp('fecha_registro')->useCurrent();
            $table->string('tipo_entrega', 20);
            $table->string('direccion', 255)->nullable();
            $table->string('telefono_contacto', 20)->nullable();
            $table->string('metodo_pago', 30);
            $table->string('correo_boleta', 150)->nullable();
            $table->decimal('costo_envio', 10, 2)->default(0);
            $table->decimal('monto_total', 10, 2);

            $table->foreign('id_cliente')
                  ->references('id_cliente')
                  ->on('clientes');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('pedidos');
    }
};