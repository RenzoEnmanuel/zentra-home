export const formatoSoles = (numero) =>
  `S/ ${Number(numero).toLocaleString("es-PE")}`;

// Texto y clase de color según el stock
export function estadoStock(stock) {
  if (stock <= 0) return { texto: "Agotado", clase: "agotado", agotado: true };
  if (stock <= 10) return { texto: `Últimas ${stock} unidades`, clase: "pocas", agotado: false };
  return { texto: "Disponible", clase: "disponible", agotado: false };
}

// Para buscar sin importar mayúsculas ni tildes ("refrigeracion" encuentra "Refrigeración")
export const normalizarTexto = (texto) =>
  texto.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");

// Con dos decimales, para el resumen de compra: S/ 1,850.00
export const formatoSolesExacto = (numero) =>
  `S/ ${Number(numero).toLocaleString("es-PE", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

// Fecha legible a partir de la que guarda el pedido: 6 de noviembre de 2026
export const formatoFecha = (iso) =>
  new Date(iso).toLocaleDateString("es-PE", { day: "numeric", month: "long", year: "numeric" });