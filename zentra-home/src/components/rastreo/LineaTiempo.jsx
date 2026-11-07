import { ClipboardList, Package, Truck, CircleCheck } from "lucide-react";
import { ESTADOS_PEDIDO } from "../../data/rastreo";
import { normalizarTexto } from "../../utils/formato";
import "./LineaTiempo.css";

// Un ícono por etapa, en el mismo orden que ESTADOS_PEDIDO
const ICONOS = [ClipboardList, Package, Truck, CircleCheck];

export default function LineaTiempo({ estado }) {
  // Posición del estado actual dentro de la lista (si no lo reconoce, usa el primero)
  const actual = Math.max(
    0,
    ESTADOS_PEDIDO.findIndex((e) => normalizarTexto(e.etiqueta) === normalizarTexto(estado))
  );

  return (
    <ol className="linea" aria-label="Estado del pedido">
      {ESTADOS_PEDIDO.map((e, i) => {
        const Icono = ICONOS[i];
        const situacion = i < actual ? "hecho" : i === actual ? "actual" : "pendiente";
        return (
          <li
            key={e.etiqueta}
            className={`linea__paso linea__paso--${situacion}`}
            aria-current={situacion === "actual" ? "step" : undefined}
          >
            <span className="linea__icono">
              <Icono size={20} aria-hidden="true" />
            </span>
            <span className="linea__etiqueta">{e.etiqueta}</span>
            <span className="linea__detalle">{e.detalle}</span>
          </li>
        );
      })}
    </ol>
  );
}