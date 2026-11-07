// Etapas por las que pasa un pedido, en orden (CU05 de tu documento).
// El estado que llegue del backend se compara con "etiqueta" sin importar
// mayúsculas ni tildes: "En Proceso" y "en proceso" son lo mismo.
export const ESTADOS_PEDIDO = [
  { etiqueta: "Registrado", detalle: "Recibimos tu pedido" },
  { etiqueta: "En proceso", detalle: "Lo estamos preparando" },
  { etiqueta: "Despachado", detalle: "Va en camino" },
  { etiqueta: "Entregado", detalle: "Pedido entregado" },
];