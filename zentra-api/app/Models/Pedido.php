<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Pedido extends Model
{
    protected $table = 'pedidos';
    protected $primaryKey = 'id_pedido';
    public $timestamps = false;

    protected $fillable = [
        'id_cliente',
        'codigo_rastreo',
        'estado',
        'tipo_entrega',
        'direccion',
        'telefono_contacto',
        'metodo_pago',
        'correo_boleta',
        'costo_envio',
        'monto_total',
    ];

    protected $casts = [
        'costo_envio' => 'float',
        'monto_total' => 'float',
    ];

    public function cliente()
    {
        return $this->belongsTo(Cliente::class, 'id_cliente', 'id_cliente');
    }

    public function detalles()
    {
        return $this->hasMany(DetallePedido::class, 'id_pedido', 'id_pedido');
    }
}