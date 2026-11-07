import { http } from "./http";

const USAR_MOCK = import.meta.env.VITE_USAR_MOCK_AUTH !== "false";
const esperar = (ms) => new Promise((resolver) => setTimeout(resolver, ms));

/*
 * CONTRATO CON EL BACK-END (para coordinar con Renzo)
 *
 * POST /api/register
 *   body:  { correo, nombres, apellidos, documento, password }
 *   201 :  { user: { id_cliente, nombres, apellidos, correo, documento }, token }
 *   422 :  { message, errors: { correo: ["..."], documento: ["..."] } }
 *
 * POST /api/login
 *   body:  { usuario, password }      // "usuario" = correo o documento
 *   200 :  { user: {...}, token }
 *   401/422: { message }
 *
 * POST /api/logout   (con header Authorization: Bearer <token>)
 */

// ---------- Error uniforme ----------
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
  const campos = {};
  for (const [campo, mensajes] of Object.entries(data?.errors ?? {})) {
    campos[campo] = Array.isArray(mensajes) ? mensajes[0] : String(mensajes);
  }

  if (status === 401) return crearError(data?.message ?? "Usuario o contraseña incorrectos.");
  return crearError(data?.message ?? "Ocurrió un error inesperado. Inténtalo nuevamente.", campos);
}

// ---------- MOCK: simula la base de datos de clientes en el navegador ----------
const CLAVE_USUARIOS = "zentra-usuarios-mock";

const leerUsuarios = () => {
  try {
    const datos = JSON.parse(localStorage.getItem(CLAVE_USUARIOS));
    return Array.isArray(datos) ? datos : [];
  } catch {
    return [];
  }
};
const guardarUsuarios = (lista) => {
  try {
    localStorage.setItem(CLAVE_USUARIOS, JSON.stringify(lista));
  } catch {
    // Sin almacenamiento, el mock no recuerda usuarios entre recargas
  }
};

async function hashear(texto) {
  const bytes = new TextEncoder().encode(texto);
  const resumen = await crypto.subtle.digest("SHA-256", bytes);
  return [...new Uint8Array(resumen)].map((b) => b.toString(16).padStart(2, "0")).join("");
}

// Nunca devolver el hash al resto de la app
const publico = (usuario) => {
  const copia = { ...usuario };
  delete copia.password_hash;
  return copia;
};
const crearToken = () => `mock-${crypto.randomUUID()}`;

async function registrarMock(datos) {
  await esperar(700);
  const usuarios = leerUsuarios();
  const correo = datos.correo.trim().toLowerCase();
  const documento = datos.documento.trim().toUpperCase();

  const campos = {};
  if (usuarios.some((u) => u.correo === correo)) campos.correo = "Este correo ya está registrado.";
  if (usuarios.some((u) => u.documento === documento)) campos.documento = "Este documento ya está registrado.";
  if (Object.keys(campos).length) throw crearError("Revisa los datos ingresados.", campos);

  const usuario = {
    id_cliente: Date.now(),
    nombres: datos.nombres.trim(),
    apellidos: datos.apellidos.trim(),
    correo,
    documento,
    password_hash: await hashear(datos.password),
  };
  guardarUsuarios([...usuarios, usuario]);
  return { user: publico(usuario), token: crearToken() };
}

async function iniciarSesionMock({ usuario: identificador, password }) {
  await esperar(600);
  const buscado = identificador.trim().toLowerCase();
  const encontrado = leerUsuarios().find(
    (u) => u.correo === buscado || u.documento.toLowerCase() === buscado
  );
  const hash = await hashear(password);

    const credencialesOk = encontrado && encontrado.password_hash === hash;

  if (!credencialesOk) {
    throw crearError("Usuario o contraseña incorrectos.");
  }
  return { user: publico(encontrado), token: crearToken() };
}

// ---------- API pública del servicio ----------
export async function registrarUsuario(datos) {
  if (USAR_MOCK) return registrarMock(datos);
  try {
    const { data } = await http.post("/register", datos);
    return data;
  } catch (err) {
    throw normalizarError(err);
  }
}

export async function iniciarSesion(credenciales) {
  if (USAR_MOCK) return iniciarSesionMock(credenciales);
  try {
    const { data } = await http.post("/login", credenciales);
    return data;
  } catch (err) {
    throw normalizarError(err);
  }
}

export async function cerrarSesionApi() {
  if (USAR_MOCK) return;
  try {
    await http.post("/logout");
  } catch {
    // Aunque falle, la sesión local se cierra igual
  }
}