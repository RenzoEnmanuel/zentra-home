<?php

namespace App\Models;

use Illuminate\Foundation\Auth\User as Authenticatable;
use Laravel\Sanctum\HasApiTokens;

class Cliente extends Authenticatable
{
    use HasApiTokens;

    protected $table = 'clientes';
    protected $primaryKey = 'id_cliente';
    public $timestamps = false;

    protected $fillable = [
        'nombres',
        'apellidos',
        'correo',
        'documento',
        'rol',
        'password',
    ];

    protected $hidden = [
        'password',
    ];

    protected $casts = [
        'password' => 'hashed',
    ];
}