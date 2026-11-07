import { Link, useParams } from "react-router-dom";
import usePedido from "../hooks/usePedido";
import LineaTiempo from "../components/rastreo/LineaTiempo";
import RastreoPedido from "../components/rastreo/RastreoPedido";
import { formatoFecha, formatoSolesExacto } from "../utils/formato";
import { OPCIONES_ENTREGA } from "../data/checkout";
import "./Rastreo.css";

// Busca el pedido y muestra el resultado. Se dibuja con "key={codigo}" (ver abajo)
function ResultadoPedido({ codigo }) {
  const { pedido, cargando, error } = usePedido(codigo);

  if (cargando) {
    return <p className="resultado__aviso" role="status">Buscando tu pedido…</p>;
  }
  if (error) {
    return <p className="resultado__alerta" role="alert">{error}</p>;
  }

  const entrega = OPCIONES_ENTREGA.find((o) => o.id === pedido.tipo_entrega)?.etiqueta;

  return (
    <section className="resultado" aria-labelledby="titulo-pedido">
      <h1 id="titulo-pedido" className="resultado__titulo">Estado de tu pedido</h1>
      <p className="resultado__codigo">
        Código de compra: <strong>{pedido.codigo_rastreo}</strong>
      </p>

      <LineaTiempo estado={pedido.estado} />

      <div className="resultado__tarjeta">
        <dl className="resultado__datos">
          <div><dt>Fecha del pedido</dt><dd>{formatoFecha(pedido.fecha_registro)}</dd></div>
          {entrega && <div><dt>Entrega</dt><dd>{entrega}</dd></div>}
        </dl>

        <ul className="resultado__productos">
          {pedido.detalle.map((d) => (
            <li key={d.id_producto}>
              <span>{d.nombre} <small>× {d.cantidad}</small></span>
              <span>{formatoSolesExacto(d.subtotal)}</span>
            </li>
          ))}
        </ul>

        <p className="resultado__total">
          <span>Total</span>
          <strong>{formatoSolesExacto(pedido.monto_total)}</strong>
        </p>
      </div>

      <Link to="/" className="boton-pildora boton-pildora--claro">Seguir comprando</Link>
    </section>
  );
}

export default function Rastreo() {
  const { codigo } = useParams(); // viene de la URL: /rastreo/:codigo

  return (
    <div className="rastreo-pagina">
      {/* key={codigo}: si busca otro código, React crea el bloque de nuevo y empieza limpio */}
      {codigo && <ResultadoPedido key={codigo} codigo={codigo} />}
      <RastreoPedido key={codigo ?? "sin-codigo"} codigoInicial={codigo ?? ""} />
    </div>
  );
}