<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Producto extends Model
{
    protected $table = 'productos';
    protected $primaryKey = 'id_producto';
    public $timestamps = false;

    protected $fillable = [
        'id_categoria',
        'codigo_sku',
        'nombre',
        'marca',
        'descripcion',
        'precio_regular',
        'precio_oferta',
        'stock',
        'imagen_url',
        'imagenes',
        'caracteristicas',
        'activo',
    ];

    protected $casts = [
        'precio_regular'  => 'float',
        'precio_oferta'   => 'float',
        'activo'          => 'boolean',
        'imagenes'        => 'array',
        'caracteristicas' => 'array',
    ];

    public function categoria(): BelongsTo
    {
        return $this->belongsTo(Categoria::class, 'id_categoria', 'id_categoria');
    }
}