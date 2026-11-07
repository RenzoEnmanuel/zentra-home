import { http } from "./http";

export async function listarPedidosAdmin() {
  const { data } = await http.get("/admin/pedidos");
  return data;
}

export async function cambiarEstadoPedido(codigo, estado) {
  const { data } = await http.patch(
    `/admin/pedidos/${encodeURIComponent(codigo)}`,
    { estado }
  );
  return data;
}