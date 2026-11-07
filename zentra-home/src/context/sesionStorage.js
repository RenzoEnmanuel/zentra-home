export const CLAVE_SESION = "zentra-sesion";

export function leerSesion() {
  try {
    const datos = JSON.parse(localStorage.getItem(CLAVE_SESION));
    return datos?.token && datos?.user ? datos : null;
  } catch {
    return null;
  }
}

export function guardarSesion(sesion) {
  try {
    if (sesion) localStorage.setItem(CLAVE_SESION, JSON.stringify(sesion));
    else localStorage.removeItem(CLAVE_SESION);
  } catch {
    // Si no se puede guardar, la sesión dura solo mientras la pestaña esté abierta
  }
}