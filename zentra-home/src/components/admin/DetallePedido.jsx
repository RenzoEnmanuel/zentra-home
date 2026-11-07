import { useEffect, useState } from "react";
import { ESTADOS_ADMIN } from "../../data/admin";
import { formatoSoles } from "../../utils/formato";

export default function DetallePedido({ pedido, onCerrar, onGuardar }) {
  const [estado, setEstado] = useState(pedido.estado);

  // Cerrar con la tecla Escape
  useEffect(() => {
    const alTeclear = (e) => e.key === "Escape" && onCerrar();
    window.addEventListener("keydown", alTeclear);
    return () => window.removeEventListener("keydown", alTeclear);
  }, [onCerrar]);

  return (
    <div className="modal-fondo" onClick={onCerrar}>
      <div
        className="modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="titulo-detalle"
        onClick={(e) => e.stopPropagation()} // clic dentro no cierra
      >
        <h3 id="titulo-detalle" className="modal__titulo">Pedido {pedido.codigo}</h3>

        <dl className="modal__datos">
          <div><dt>Cliente</dt><dd>{pedido.cliente}</dd></div>
          <div><dt>Producto</dt><dd>{pedido.producto}</dd></div>
          <div><dt>Fecha</dt><dd>{pedido.fecha}</dd></div>
          <div><dt>Total</dt><dd>{formatoSoles(pedido.total)}</dd></div>
        </dl>

        <label>
          Estado del pedido
          <select value={estado} onChange={(e) => setEstado(e.target.value)}>
            {ESTADOS_ADMIN.map((e) => <option key={e} value={e}>{e}</option>)}
          </select>
        </label>

        <div className="modal__acciones">
          <button type="button" className="boton-pildora boton-pildora--claro" onClick={onCerrar}>
            Cancelar
          </button>
          <button
            type="button"
            className="boton-pildora"
            onClick={() => onGuardar(pedido.codigo, estado)}
          >
            Guardar
          </button>
        </div>
      </div>
    </div>
  );
}