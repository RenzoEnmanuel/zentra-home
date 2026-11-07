import { useState } from "react";
import { CheckoutContext } from "./CheckoutContext";
import useCarrito from "../hooks/useCarrito";
import { OPCIONES_ENTREGA } from "../data/checkout";

export default function CheckoutProvider({ children }) {
  const { total } = useCarrito();

  // ---------- Lo que se guarda (estado) ----------
  const [tipoEntrega, setTipoEntrega] = useState("retiro"); // "retiro" | "despacho"
  const [direccion, setDireccion] = useState("");
   const [telefono, setTelefono] = useState("");
  const [entregaConfirmada, setEntregaConfirmada] = useState(false);
  const [pedidoCreado, setPedidoCreado] = useState(null); // lo que devuelve el servicio
  const [procesando, setProcesando] = useState(false);

  // ---------- Acciones ----------
  const cambiarTipoEntrega = (tipo) => {
    setTipoEntrega(tipo);
    setEntregaConfirmada(false); // si cambia la entrega, debe volver a confirmarla
  };

    const confirmarEntrega = ({ direccion: nuevaDireccion, telefono: nuevoTelefono }) => {
    setDireccion(nuevaDireccion);
    setTelefono(nuevoTelefono);
    setEntregaConfirmada(true);
  };

  const registrarPedido = (pedido) => setPedidoCreado(pedido);

  // ---------- Valores derivados (se calculan, no se guardan) ----------
  const costoEnvio = OPCIONES_ENTREGA.find((o) => o.id === tipoEntrega)?.costo ?? 0;
  const descuentos = 0; // el carrito aún no guarda el precio regular
  const totalFinal = total + costoEnvio - descuentos;

  return (
    <CheckoutContext.Provider
      value={{
        tipoEntrega,
        direccion,
        telefono,
        entregaConfirmada,
        pedidoCreado,
        procesando,
        cambiarTipoEntrega,
        confirmarEntrega,
        registrarPedido,
        setProcesando,
        costoEnvio,
        descuentos,
        totalFinal,
      }}
    >
      {children}
    </CheckoutContext.Provider>
  );
}