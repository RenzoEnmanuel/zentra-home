import { ShoppingCart } from "lucide-react";
import Estrellas from "../ui/Estrellas";
import { formatoSoles, estadoStock } from "../../utils/formato";
import "./CardProducto.css";

export default function CardProducto({ producto, onSeleccionar, onAgregar }) {
  const { nombre, imagenes, precio_oferta, precio_regular, stock } = producto;
  const estado = estadoStock(stock);

  const manejarTeclado = (e) => {
    if (e.target !== e.currentTarget) return; // solo si el foco está en la tarjeta misma
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      onSeleccionar(producto);
    }
  };

  const manejarAgregar = (e) => {
    e.stopPropagation(); // evita que este clic abra el modal
    onAgregar(producto, 1);
  };

  return (
    <article
      className="card"
      tabIndex={0}
      aria-label={`Ver detalle de ${nombre}`}
      onClick={() => onSeleccionar(producto)}
      onKeyDown={manejarTeclado}
    >
      <img className="card__imagen" src={imagenes[0]} alt={nombre} loading="lazy" />

      <h3 className="card__nombre">{nombre}</h3>
      <p className="card__precio">{formatoSoles(precio_oferta)}</p>
      {precio_regular > precio_oferta && (
        <p className="card__precio-antes">{formatoSoles(precio_regular)}</p>
      )}
      <Estrellas valor={0} total={0} />
      <p className={`estado estado--${estado.clase}`}>{estado.texto}</p>

      <button className="boton-carrito" disabled={estado.agotado} onClick={manejarAgregar}>
        Añadir al carrito
        <span className="boton-carrito__icono">
          <ShoppingCart size={14} />
        </span>
      </button>
    </article>
  );
}