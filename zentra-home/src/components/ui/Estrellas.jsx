import { Star } from "lucide-react";
import "./Estrellas.css";

export default function Estrellas({ valor = 0, total = 0, size = 14 }) {
  return (
    <div className="estrellas" aria-label={`Valoración ${valor} de 5`}>
      {[1, 2, 3, 4, 5].map((n) => (
        <Star
          key={n}
          size={size}
          className={n <= Math.round(valor) ? "estrella estrella--llena" : "estrella"}
        />
      ))}
      <span className="estrellas__total">({total})</span>
    </div>
  );
}