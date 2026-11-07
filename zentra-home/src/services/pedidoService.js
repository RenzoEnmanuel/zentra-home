import { http } from "./http";

const USAR_MOCK = import.meta.env.VITE_USAR_MOCK_PEDIDOS !== "false";
const esperar = (ms) => new Promise((resolver) => setTimeout(resolver, ms));

/*
 * CONTRATO CON EL BACK-END (para coordinar con Renzo)
 *
 *  * POST /api/pedidos            (Authorization: Bearer <token>)
 *   body:  { tipo_entrega, direccion, telefono_contacto, metodo_pago, correo_boleta,
 *            detalle: [{ id_producto, cantidad }] }
 *   201 :  { codigo_rastreo, estado, fecha_registro, monto_total, costo_envio,
 *            tipo_entrega, direccion, metodo_pago, correo_boleta,
 *            detalle: [{ id_producto, nombre, cantidad, precio_unitario, subtotal }] }
 *   422 :  { message, errors }   // ej. stock insuficiente
 *
 * GET /api/pedidos/{codigo_rastreo}
 *   200 :  el mismo objeto de arriba
 *   404 :  { message }
 *
 * IMPORTANTE: el front NO envía precios ni totales. El back los calcula desde la
 * base de datos (si no, cualquiera podría cambiar un precio desde el navegador).
 * El cliente se identifica por el token, no por el body.
 */

// ---------- Error uniforme (mismo estilo que authService) ----------
function crearError(mensaje, campos = {}) {
  const error = new Error(mensaje);
  error.campos = campos;
  return error;
}

function normalizarError(err) {
  if (err.campos) return err;
  if (!err.response) {
    return crearError("No pudimos conectar con el servidor. Revisa tu conexión e inténtalo de nuevo.");
  }
  const { data, status } = err.response;
  if (status === 404) {
    return crearError(
      "No se encontró ninguna orden registrada con el código ingresado. Verifique el código e intente nuevamente."
    );
  }
  return crearError(data?.message ?? "Ocurrió un error inesperado. Inténtalo nuevamente.");
}

// ---------- MOCK: simula la tabla PEDIDO en el navegador ----------
const CLAVE_PEDIDOS = "zentra-pedidos-mock";

const leerPedidos = () => {
  try {
    const datos = JSON.parse(localStorage.getItem(CLAVE_PEDIDOS));
    return Array.isArray(datos) ? datos : [];
  } catch {
    return [];
  }
};
const guardarPedidos = (lista) => {
  try {
    localStorage.setItem(CLAVE_PEDIDOS, JSON.stringify(lista));
  } catch {
    // Sin almacenamiento, el mock no recuerda los pedidos entre recargas
  }
};

// Formato del documento (CU04): ZH-2026-0041
const generarCodigo = (cantidadActual) =>
  `ZH-${new Date().getFullYear()}-${String(cantidadActual + 1).padStart(4, "0")}`;

async function crearPedidoMock(datos) {
  await esperar(900); // simula la espera de red para ver el estado "Procesando…"

  if (!datos.items.length) throw crearError("Tu carrito está vacío.");

  const pedidos = leerPedidos();
  const detalle = datos.items.map((i) => ({
    id_producto: i.id_producto,
    nombre: i.nombre,
    cantidad: i.cantidad,
    precio_unitario: i.precio_oferta,
    subtotal: i.precio_oferta * i.cantidad,
  }));

  const pedido = {
    codigo_rastreo: generarCodigo(pedidos.length),
    estado: "Registrado",
    fecha_registro: new Date().toISOString(),
    id_cliente: datos.cliente.id_cliente,
    monto_total: datos.total,
    costo_envio: datos.costoEnvio,
    tipo_entrega: datos.tipoEntrega,
    direccion: datos.direccion,
    telefono_contacto: datos.telefono, 
    metodo_pago: datos.metodoPago,
    correo_boleta: datos.correoBoleta,
    detalle,
  };

  guardarPedidos([...pedidos, pedido]);
  return pedido;
}

async function consultarPedidoMock(codigo) {
  await esperar(600);
  const buscado = codigo.trim().toUpperCase();
  const pedido = leerPedidos().find((p) => p.codigo_rastreo.toUpperCase() === buscado);
  if (!pedido) {
    throw crearError(
      "No se encontró ninguna orden registrada con el código ingresado. Verifique el código e intente nuevamente."
    );
  }
  return pedido;
}

// ---------- API pública del servicio ----------
export async function crearPedido(datos) {
  if (USAR_MOCK) return crearPedidoMock(datos);
  try {
    const { data } = await http.post("/pedidos", {
      tipo_entrega: datos.tipoEntrega,
      direccion: datos.direccion,
      telefono_contacto: datos.telefono,
      metodo_pago: datos.metodoPago,
      correo_boleta: datos.correoBoleta,
      detalle: datos.items.map((i) => ({ id_producto: i.id_producto, cantidad: i.cantidad })),
    });
    return data.data ?? data; // Laravel suele envolver en { data: {...} }
  } catch (err) {
    throw normalizarError(err);
  }
}

export async function consultarPedido(codigo) {
  if (USAR_MOCK) return consultarPedidoMock(codigo);
  try {
    const { data } = await http.get(`/pedidos/${encodeURIComponent(codigo.trim())}`);
    return data.data ?? data;
  } catch (err) {
    throw normalizarError(err);
  }
}