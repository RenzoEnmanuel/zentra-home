<?php

use App\Models\Categoria;
use App\Models\Cliente;
use App\Models\Producto;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Route;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

Route::get('/ping', function () {
    return response()->json(['mensaje' => 'API de ZENTRA HOME funcionando']);
});

/* ---------------------------------------------------------------
 |  CATÁLOGO
 * ------------------------------------------------------------- */

// Formato de un producto para el JSON (mismos nombres que usa el front-end)
$formatear = fn (Producto $p) => [
    'id_producto'     => $p->id_producto,
    'codigo_sku'      => $p->codigo_sku,
    'nombre'          => $p->nombre,
    'marca'           => $p->marca,
    'categoria'       => $p->categoria->nombre,
    'descripcion'     => $p->descripcion,
    'precio_regular'  => $p->precio_regular,
    'precio_oferta'   => $p->precio_oferta ?? $p->precio_regular,
    'stock'           => $p->stock,
    'imagen_url'      => $p->imagen_url,
    'imagenes'        => $p->imagenes ?: ($p->imagen_url ? [$p->imagen_url] : []),
    'caracteristicas' => $p->caracteristicas ?? [],
];

// GET /api/categorias
Route::get('/categorias', function () {
    $categorias = Categoria::where('activo', true)
        ->orderBy('id_categoria')
        ->get(['id_categoria', 'nombre']);

    return response()->json($categorias, 200, [], JSON_UNESCAPED_UNICODE);
});

// GET /api/productos  (opcional: ?categoria=Lavado  y  ?search=samsung)
Route::get('/productos', function (Request $request) use ($formatear) {
    $consulta = Producto::with('categoria')->where('activo', true);

    if ($request->filled('categoria')) {
        $consulta->whereHas('categoria', fn ($q) => $q->where('nombre', $request->query('categoria')));
    }

    if ($request->filled('search')) {
        $texto = $request->query('search');
        $consulta->where(fn ($q) => $q->where('nombre', 'like', "%{$texto}%")
                                      ->orWhere('marca', 'like', "%{$texto}%"));
    }

    $productos = $consulta->orderBy('id_producto')->get()->map($formatear);

    return response()->json($productos, 200, [], JSON_UNESCAPED_UNICODE);
});

// GET /api/productos/{id}
Route::get('/productos/{id}', function ($id) use ($formatear) {
    $producto = Producto::with('categoria')->where('activo', true)->find($id);

    if (! $producto) {
        return response()->json(['mensaje' => 'Producto no encontrado'], 404, [], JSON_UNESCAPED_UNICODE);
    }

    return response()->json($formatear($producto), 200, [], JSON_UNESCAPED_UNICODE);
});

/* ---------------------------------------------------------------
 |  CLIENTES: registro, inicio y cierre de sesión (Sanctum)
 * ------------------------------------------------------------- */

// Datos del cliente que se envían al front (nunca la contraseña)
$formatearCliente = fn (Cliente $c) => [
    'id_cliente' => $c->id_cliente,
    'nombres'    => $c->nombres,
    'apellidos'  => $c->apellidos,
    'correo'     => $c->correo,
    'documento'  => $c->documento,
    'rol'        => $c->rol ?? 'cliente',
];

// POST /api/register
Route::post('/register', function (Request $request) use ($formatearCliente) {
    // Normaliza antes de validar: correo en minúsculas y documento en mayúsculas
    $request->merge([
        'correo'    => strtolower(trim((string) $request->input('correo'))),
        'documento' => strtoupper(trim((string) $request->input('documento'))),
    ]);

    $datos = $request->validate([
        'correo'    => ['required', 'email', 'max:150', 'unique:clientes,correo'],
        'nombres'   => ['required', 'string', 'min:2', 'max:100'],
        'apellidos' => ['required', 'string', 'min:2', 'max:100'],
        'documento' => ['required', 'regex:/^(\d{8}|[A-Za-z0-9]{9,12})$/', 'unique:clientes,documento'],
        'password'  => ['required', 'string', 'min:8', 'regex:/[A-Za-z]/', 'regex:/\d/'],
    ], [
        'correo.unique'    => 'Este correo ya está registrado.',
        'documento.unique' => 'Este documento ya está registrado.',
        'documento.regex'  => 'Ingresa un DNI (8 dígitos) o un CE (9 a 12 caracteres).',
        'password.min'     => 'Usa al menos 8 caracteres.',
        'password.regex'   => 'Combina letras y números.',
    ]);

    $cliente = Cliente::create($datos); // la contraseña se cifra sola (cast "hashed")

    return response()->json([
        'user'  => $formatearCliente($cliente),
        'token' => $cliente->createToken('zentra-home')->plainTextToken,
    ], 201, [], JSON_UNESCAPED_UNICODE);
});

// POST /api/login   ("usuario" puede ser el correo o el documento)
Route::post('/login', function (Request $request) use ($formatearCliente) {
    $request->validate([
        'usuario'  => ['required', 'string'],
        'password' => ['required', 'string'],
    ]);

    $buscado = trim($request->input('usuario'));
    $cliente = Cliente::where('correo', strtolower($buscado))
        ->orWhere('documento', strtoupper($buscado))
        ->first();

    if (! $cliente || ! Hash::check($request->input('password'), $cliente->password)) {
        return response()->json(['message' => 'Usuario o contraseña incorrectos.'], 401, [], JSON_UNESCAPED_UNICODE);
    }

    return response()->json([
        'user'  => $formatearCliente($cliente),
        'token' => $cliente->createToken('zentra-home')->plainTextToken,
    ], 200, [], JSON_UNESCAPED_UNICODE);
});

// POST /api/logout   (requiere el token en el encabezado Authorization)
Route::post('/logout', function (Request $request) {
    $request->user()->currentAccessToken()->delete();

    return response()->json(['mensaje' => 'Sesión cerrada'], 200, [], JSON_UNESCAPED_UNICODE);
})->middleware('auth:sanctum');


// ------------------------------------------------------------
// PEDIDOS
// ------------------------------------------------------------
$formatearPedido = function ($pedido) {
    return [
        'codigo_rastreo' => $pedido->codigo_rastreo,
        'estado'         => $pedido->estado,
        'fecha_registro' => \Carbon\Carbon::parse($pedido->fecha_registro)->toIso8601String(),
        'monto_total'    => (float) $pedido->monto_total,
        'costo_envio'    => (float) $pedido->costo_envio,
        'tipo_entrega'   => $pedido->tipo_entrega,
        'direccion'      => $pedido->direccion,
        'metodo_pago'    => $pedido->metodo_pago,
        'correo_boleta'  => $pedido->correo_boleta,
        'detalle'        => $pedido->detalles->map(fn ($d) => [
            'id_producto'     => $d->id_producto,
            'nombre'          => $d->producto->nombre,
            'cantidad'        => $d->cantidad,
            'precio_unitario' => (float) $d->precio_unitario,
            'subtotal'        => (float) $d->subtotal,
        ])->values(),
    ];
};

// POST /api/pedidos   (requiere el token del cliente)
Route::post('/pedidos', function (Request $request) use ($formatearPedido) {
    $datos = $request->validate([
        'tipo_entrega'          => 'required|in:retiro,despacho',
        'direccion'             => 'required_if:tipo_entrega,despacho|nullable|string|max:255',
        'telefono_contacto'     => 'nullable|string|max:20',
        'metodo_pago'           => 'required|in:tarjeta,yape_plin,mercado_pago',
        'correo_boleta'         => 'required|email|max:150',
        'detalle'               => 'required|array|min:1',
        'detalle.*.id_producto' => 'required|integer|exists:productos,id_producto',
        'detalle.*.cantidad'    => 'required|integer|min:1',
    ]);

    $pedido = \Illuminate\Support\Facades\DB::transaction(function () use ($datos, $request) {
        $lineas = [];
        $subtotalPedido = 0;

        foreach ($datos['detalle'] as $item) {
            $producto = \App\Models\Producto::lockForUpdate()->find($item['id_producto']);

            if (!$producto->activo) {
                throw \Illuminate\Validation\ValidationException::withMessages([
                    'detalle' => ["El producto {$producto->nombre} no está disponible."],
                ]);
            }
            if ($producto->stock < $item['cantidad']) {
                throw \Illuminate\Validation\ValidationException::withMessages([
                    'detalle' => ["Stock insuficiente para {$producto->nombre}. Disponible: {$producto->stock}."],
                ]);
            }

            $precio = $producto->precio_oferta ?? $producto->precio_regular;
            $subtotal = $precio * $item['cantidad'];
            $subtotalPedido += $subtotal;

            $producto->decrement('stock', $item['cantidad']);

            $lineas[] = [
                'id_producto'     => $producto->id_producto,
                'cantidad'        => $item['cantidad'],
                'precio_unitario' => $precio,
                'subtotal'        => $subtotal,
            ];
        }

        $costoEnvio = $datos['tipo_entrega'] === 'despacho' ? 10 : 0;
        $numero = (int) \App\Models\Pedido::max('id_pedido') + 1;

        $pedido = \App\Models\Pedido::create([
            'id_cliente'        => $request->user()->id_cliente,
            'codigo_rastreo'    => 'ZH-' . date('Y') . '-' . str_pad($numero, 4, '0', STR_PAD_LEFT),
            'estado'            => 'Registrado',
            'tipo_entrega'      => $datos['tipo_entrega'],
            'direccion'         => $datos['direccion'] ?? null,
            'telefono_contacto' => $datos['telefono_contacto'] ?? null,
            'metodo_pago'       => $datos['metodo_pago'],
            'correo_boleta'     => $datos['correo_boleta'],
            'costo_envio'       => $costoEnvio,
            'monto_total'       => $subtotalPedido + $costoEnvio,
        ]);

        foreach ($lineas as $linea) {
            $pedido->detalles()->create($linea);
        }

        return $pedido;
    });

    $pedido = \App\Models\Pedido::with('detalles.producto')->find($pedido->id_pedido);

    return response()->json($formatearPedido($pedido), 201, [], JSON_UNESCAPED_UNICODE);
})->middleware('auth:sanctum');

// GET /api/pedidos/{codigo}   (rastreo por código)
Route::get('/pedidos/{codigo}', function ($codigo) use ($formatearPedido) {
    $pedido = \App\Models\Pedido::with('detalles.producto')
        ->where('codigo_rastreo', strtoupper(trim($codigo)))
        ->first();

    if (!$pedido) {
        return response()->json(['message' => 'Pedido no encontrado.'], 404, [], JSON_UNESCAPED_UNICODE);
    }

    return response()->json($formatearPedido($pedido), 200, [], JSON_UNESCAPED_UNICODE);
});

// ------------------------------------------------------------
// ADMINISTRADOR: pedidos (solo usuarios con rol "admin")
// ------------------------------------------------------------
$soloAdmin = function (Request $request) {
    if (($request->user()->rol ?? null) !== 'admin') {
        abort(403, 'Acceso solo para administradores.');
    }
};

$formatearPedidoAdmin = function ($pedido) {
    $items = $pedido->detalles;
    $primero = $items->first();
    $producto = $primero ? $primero->producto->nombre : '-';
    if ($items->count() > 1) {
        $producto .= ' y ' . ($items->count() - 1) . ' más';
    }

    return [
        'codigo'   => $pedido->codigo_rastreo,
        'cliente'  => trim($pedido->cliente->nombres . ' ' . $pedido->cliente->apellidos),
        'producto' => $producto,
        'fecha'    => \Carbon\Carbon::parse($pedido->fecha_registro)
                        ->locale('es')->translatedFormat('j M, H:i'),
        'total'    => (float) $pedido->monto_total,
        'estado'   => $pedido->estado,
    ];
};

// GET /api/admin/pedidos
Route::get('/admin/pedidos', function (Request $request) use ($soloAdmin, $formatearPedidoAdmin) {
    $soloAdmin($request);

    $pedidos = \App\Models\Pedido::with(['cliente', 'detalles.producto'])
        ->orderByDesc('id_pedido')
        ->get()
        ->map($formatearPedidoAdmin);

    return response()->json($pedidos, 200, [], JSON_UNESCAPED_UNICODE);
})->middleware('auth:sanctum');

// PATCH /api/admin/pedidos/{codigo}   body: { estado }
Route::patch('/admin/pedidos/{codigo}', function (Request $request, $codigo) use ($soloAdmin, $formatearPedidoAdmin) {
    $soloAdmin($request);

    $datos = $request->validate([
        'estado' => 'required|in:Registrado,En proceso,Despachado,Entregado',
    ]);

    $pedido = \App\Models\Pedido::with(['cliente', 'detalles.producto'])
        ->where('codigo_rastreo', strtoupper(trim($codigo)))
        ->first();

    if (!$pedido) {
        return response()->json(['message' => 'Pedido no encontrado.'], 404, [], JSON_UNESCAPED_UNICODE);
    }

    $pedido->update(['estado' => $datos['estado']]);

    return response()->json($formatearPedidoAdmin($pedido), 200, [], JSON_UNESCAPED_UNICODE);
})->middleware('auth:sanctum');