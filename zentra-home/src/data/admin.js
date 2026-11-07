import { ESTADOS_PEDIDO } from "./rastreo";

// Mismos estados que ve el cliente en el rastreo: ["Registrado", "En proceso", ...]
export const ESTADOS_ADMIN = ESTADOS_PEDIDO.map((e) => e.etiqueta);

// Pedidos recientes (luego vendrán de la API: GET /api/admin/pedidos)
export const PEDIDOS_ADMIN = [
  { codigo: "ZEN-25-A84F", cliente: "María Torres",    producto: "Refrigeradora No Frost 420L", fecha: "18 jun, 10:42", total: 2099, estado: "Registrado" },
  { codigo: "ZEN-25-B19K", cliente: "Carlos Mendoza",  producto: "Lavadora Inverter 18 kg",     fecha: "18 jun, 09:16", total: 1849, estado: "En proceso" },
  { codigo: "ZEN-25-C52M", cliente: "Lucía Fernández", producto: "Cocina a gas 6 hornillas",    fecha: "17 jun, 16:28", total: 1399, estado: "En proceso" },
  { codigo: "ZEN-25-D77P", cliente: "Diego Salazar",   producto: "Freidora de aire 7.5L",       fecha: "17 jun, 12:05", total: 459,  estado: "Entregado" },
  { codigo: "ZEN-25-E41R", cliente: "Andrea Rojas",    producto: "Aire acondicionado 12K BTU",  fecha: "16 jun, 15:54", total: 1699, estado: "Despachado" },
];

// Ventas de los últimos 6 meses (para el gráfico de línea)
export const VENTAS_MENSUALES = [
  { mes: "Ene", monto: 28000 },
  { mes: "Feb", monto: 35000 },
  { mes: "Mar", monto: 32000 },
  { mes: "Abr", monto: 48000 },
  { mes: "May", monto: 52000 },
  { mes: "Jun", monto: 61800 },
];

// Pedidos del mes actual según su estado (para la dona)
export const PEDIDOS_POR_ESTADO = [
  { estado: "Registrado", cantidad: 16 },
  { estado: "En proceso", cantidad: 24 },
  { estado: "Despachado", cantidad: 15 },
  { estado: "Entregado", cantidad: 18 },
];

export const STOCK_CRITICO = 5;