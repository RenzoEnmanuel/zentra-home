import useCarrito from "../../hooks/useCarrito";
import useCheckout from "../../hooks/useCheckout";
import { formatoSolesExacto } from "../../utils/formato";
import "./ResumenCompra.css";

// Cada paso tiene su formulario (con este id). El botón "Continuar" vive aquí, fuera
// del <form>, pero el atributo form="..." le dice a cuál formulario pertenece.
const FORMULARIO_DEL_PASO = { 1: "form-entrega", 2: "form-pago" };
const TEXTO_BOTON = { 1: "Continuar", 2: "Confirmar pago" };

export default function ResumenCompra({ paso }) {
  const { total } = useCarrito();
  const { costoEnvio, descuentos, totalFinal, procesando } = useCheckout();

  return (
    <aside className="resumen" aria-labelledby="titulo-resumen">
      <h2 id="titulo-resumen" className="resumen__titulo">Resumen de compra</h2>

      <div className="resumen__tarjeta">
        <dl className="resumen__filas">
          <div><dt>Productos</dt><dd>{formatoSolesExacto(total)}</dd></div>
          <div><dt>Entrega</dt><dd>{formatoSolesExacto(costoEnvio)}</dd></div>
        </dl>

        <hr />

        <dl className="resumen__filas">
          <div><dt>Descuentos</dt><dd>{formatoSolesExacto(descuentos)}</dd></div>
          <div className="resumen__total"><dt>Total</dt><dd>{formatoSolesExacto(totalFinal)}</dd></div>
        </dl>

        <button
          type="submit"
          form={FORMULARIO_DEL_PASO[paso]}
          className="resumen__boton"
          disabled={procesando}
        >
          {procesando ? "Procesando…" : TEXTO_BOTON[paso]}
        </button>
      </div>
    </aside>
  );
}