
const REGEX_CORREO = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const REGEX_NOMBRE = /^[A-Za-zÁÉÍÓÚÜÑáéíóúüñ]+(?:[ '-][A-Za-zÁÉÍÓÚÜÑáéíóúüñ]+)*$/;
const REGEX_DNI = /^\d{8}$/;
const REGEX_CE = /^[A-Za-z0-9]{9,12}$/;

export const LARGO_MIN_PASSWORD = 8;

export const validarCorreo = (valor) => {
  if (!valor.trim()) return "Ingresa tu correo.";
  if (!REGEX_CORREO.test(valor.trim())) return "Ingresa un correo válido (ej. nombre@correo.com).";
  return "";
};

const validarTextoPersona = (etiqueta) => (valor) => {
  if (!valor.trim()) return `Ingresa tus ${etiqueta}.`;
  if (valor.trim().length < 2) return `Tus ${etiqueta} son demasiado cortos.`;
  if (!REGEX_NOMBRE.test(valor.trim())) return `Tus ${etiqueta} solo pueden tener letras.`;
  return "";
};
export const validarNombres = validarTextoPersona("nombres");
export const validarApellidos = validarTextoPersona("apellidos");

export const validarDocumento = (valor) => {
  const v = valor.trim();
  if (!v) return "Ingresa tu DNI o CE.";
  if (REGEX_DNI.test(v) || REGEX_CE.test(v)) return "";
  return "Ingresa un DNI (8 dígitos) o un CE (9 a 12 caracteres).";
};

export const validarPassword = (valor) => {
  if (!valor) return "Ingresa tu contraseña.";
  if (valor.length < LARGO_MIN_PASSWORD) return `Usa al menos ${LARGO_MIN_PASSWORD} caracteres.`;
  if (!/[A-Za-z]/.test(valor) || !/\d/.test(valor)) return "Combina letras y números.";
  return "";
};

const REGEX_CELULAR = /^9\d{8}$/;

export const validarTelefono = (valor) => {
  const v = valor.replace(/\s/g, ""); // ignora los espacios: "987 654 321" también vale
  if (!v) return "Ingresa un teléfono de contacto.";
  if (!REGEX_CELULAR.test(v)) return "Ingresa un celular válido de 9 dígitos (empieza con 9).";
  return "";
};

export const validarDireccion = (valor) => {
  const v = valor.trim();
  if (!v) return "Ingresa la dirección donde recibirás tu pedido.";
  if (v.length < 10) return "Escribe la dirección completa (calle, número y distrito).";
  return "";
};

// En el login solo pedimos que no esté vacío
export const validarObligatorio = (mensaje) => (valor) => (valor.trim() ? "" : mensaje);

// Aplica { campo: funcionValidadora } a los valores del formulario.
// Devuelve { campo: "mensaje" } solo con los campos que tienen error.
export function validarFormulario(valores, reglas) {
  const errores = {};
  for (const [campo, validar] of Object.entries(reglas)) {
    const mensaje = validar(valores[campo] ?? "");
    if (mensaje) errores[campo] = mensaje;
  }
  return errores;
}