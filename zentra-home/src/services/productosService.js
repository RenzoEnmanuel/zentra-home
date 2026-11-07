import { http } from "./http";
import { PRODUCTOS } from "../data/productos";

const USAR_MOCK = import.meta.env.VITE_USAR_MOCK_PRODUCTOS !== "false";
const esperar = (ms) => new Promise((resolver) => setTimeout(resolver, ms));

// Adaptador: deja cada producto con la forma que espera la interfaz,
// aunque el Back-End no envíe algunos campos opcionales.
const adaptar = (p) => ({
  ...p,
  marca: p.marca ?? "",
  imagenes: p.imagenes?.length ? p.imagenes : [p.imagen_url],
  caracteristicas: p.caracteristicas ?? [],
});

export async function obtenerProductos() {
  if (USAR_MOCK) {
    await esperar(600); // simula la espera de red para ver el estado "cargando"
    return PRODUCTOS.map(adaptar);
  }

  const { data } = await http.get("/productos");
  const lista = Array.isArray(data) ? data : data.data; // Laravel suele envolver en { data: [...] }
  return lista.map(adaptar);
}