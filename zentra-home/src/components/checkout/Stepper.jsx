import { PASOS } from "../../data/checkout";
import "./Stepper.css";

// Indicador "1 Entrega — 2 Pago — 3 ¡Finalizado!". Solo dibuja: recibe el paso actual.
export default function Stepper({ paso }) {
  return (
    <nav className="stepper" aria-label="Progreso de la compra">
      <ol>
        {PASOS.map((p) => {
          const estado = p.numero < paso ? "hecho" : p.numero === paso ? "actual" : "pendiente";
          return (
            <li
              key={p.numero}
              className={`stepper__paso stepper__paso--${estado}`}
              aria-current={estado === "actual" ? "step" : undefined}
            >
              <span className="stepper__circulo">{p.numero}</span>
              <span className="stepper__etiqueta">{p.etiqueta}</span>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}