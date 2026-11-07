import { useEffect, useState } from "react";
import { consultarPedido } from "../services/pedidoService";

// Busca un pedido por su código y avisa en qué situación está la búsqueda.
export default function usePedido(codigo) {
  const [pedido, setPedido] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelado = false; // evita actualizar el estado si la pantalla ya se cerró

    consultarPedido(codigo)
      .then((encontrado) => {
        if (!cancelado) setPedido(encontrado);
      })
      .catch((err) => {
        if (!cancelado) setError(err.message);
      })
      .finally(() => {
        if (!cancelado) setCargando(false);
      });

    return () => {
      cancelado = true;
    };
  }, [codigo]);

  return { pedido, cargando, error };
}