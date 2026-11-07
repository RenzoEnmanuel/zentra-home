// Datos fijos del checkout. Si cambia el costo de despacho o un método de pago,
// se cambia SOLO aquí y toda la pantalla se actualiza.

export const COSTO_DESPACHO = 10;

// Los 3 pasos del proceso. "ruta" es el último tramo de la URL: /checkout/<ruta>
export const PASOS = [
  { numero: 1, ruta: "entrega", etiqueta: "Entrega" },
  { numero: 2, ruta: "pago", etiqueta: "Pago" },
  { numero: 3, ruta: "finalizado", etiqueta: "¡Finalizado!" },
];

export const OPCIONES_ENTREGA = [
  { id: "retiro", etiqueta: "Retiro en tienda", costo: 0 },
  { id: "despacho", etiqueta: "Despacho a dirección", costo: COSTO_DESPACHO },
];

export const METODOS_PAGO = [
  { id: "tarjeta", etiqueta: "Tarjeta de Crédito o Débito (Visa, Mastercard, Amex)" },
  { id: "yape_plin", etiqueta: "Yape o Plin" },
  { id: "mercado_pago", etiqueta: "Mercado Pago" },
];