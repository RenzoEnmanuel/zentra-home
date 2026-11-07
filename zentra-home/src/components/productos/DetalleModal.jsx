import { useEffect, useState } from "react";
import { X, Minus, Plus, ShoppingCart } from "lucide-react";
import Estrellas from "../ui/Estrellas";
import { formatoSoles, estadoStock } from "../../utils/formato";
import "./DetalleModal.css";

const PESTANAS = ["Descripción", "Especificaciones", "Opiniones"];

export default function DetalleModal({ producto, onCerrar, onAgregar }) {
  const [imagenActiva, setImagenActiva] = useState(0);
  const [cantidad, setCantidad] = useState(1);
  const [pestana, setPestana] = useState("Descripción");

  const estado = estadoStock(producto.stock);

  // Mientras está abierto: Esc lo cierra y la página de atrás no se desplaza
  useEffect(() => {
    const alPresionar = (e) => {
      if (e.key === "Escape") onCerrar();
    };
    document.addEventListener("keydown", alPresionar);
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", alPresionar);
      document.body.style.overflow = "";
    };
  }, [onCerrar]);

  const disminuir = () => setCantidad((c) => Math.max(1, c - 1));
  const aumentar = () => setCantidad((c) => Math.min(producto.stock, c + 1));

  const agregar = () => {
    onAgregar(producto, cantidad);
    onCerrar();
  };

  return (
    <div className="detalle__fondo" onClick={onCerrar}>
      <div
        className="detalle"
        role="dialog"
        aria-modal="true"
        aria-label={producto.nombre}
        onClick={(e) => e.stopPropagation()}
      >
        <button className="detalle__cerrar" onClick={onCerrar} aria-label="Cerrar">
          <X size={22} />
        </button>

        <div className="detalle__principal">
          <div>
            <img className="detalle__imagen" src={producto.imagenes[imagenActiva]} alt={producto.nombre} />

            {producto.imagenes.length > 1 && (
              <div className="detalle__miniaturas">
                {producto.imagenes.map((src, i) => (
                  <button
                    key={src}
                    className={i === imagenActiva ? "detalle__miniatura detalle__miniatura--activa" : "detalle__miniatura"}
                    onClick={() => setImagenActiva(i)}
                    aria-label={`Ver imagen ${i + 1}`}
                  >
                    <img src={src} alt="" />
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="detalle__info">
            {producto.marca && <span className="detalle__marca">{producto.marca}</span>}
            <h2 className="detalle__nombre">{producto.nombre}</h2>
            <Estrellas valor={0} total={0} size={16} />

            <p className="detalle__precio">{formatoSoles(producto.precio_oferta)}</p>
            {producto.precio_regular > producto.precio_oferta && (
              <p className="detalle__precio-antes">{formatoSoles(producto.precio_regular)}</p>
            )}
            <p className={`estado estado--${estado.clase}`}>{estado.texto}</p>

            <div className="detalle__cantidad">
              <button onClick={disminuir} disabled={estado.agotado} aria-label="Disminuir cantidad">
                <Minus size={16} />
              </button>
              <span>{cantidad}</span>
              <button onClick={aumentar} disabled={estado.agotado} aria-label="Aumentar cantidad">
                <Plus size={16} />
              </button>
            </div>

            <button className="boton-carrito detalle__agregar" disabled={estado.agotado} onClick={agregar}>
              Añadir al carrito
              <span className="boton-carrito__icono"><ShoppingCart size={14} /></span>
            </button>
          </div>
        </div>

        <div className="detalle__pestanas">
          <div className="detalle__tabs" role="tablist">
            {PESTANAS.map((nombre) => (
              <button
                key={nombre}
                role="tab"
                aria-selected={pestana === nombre}
                className={pestana === nombre ? "detalle__tab detalle__tab--activa" : "detalle__tab"}
                onClick={() => setPestana(nombre)}
              >
                {nombre}
              </button>
            ))}
          </div>

          <div className="detalle__panel">
            {pestana === "Descripción" && <p>{producto.descripcion}</p>}

            {pestana === "Especificaciones" &&
              (producto.caracteristicas.length > 0 ? (
                <dl className="detalle__specs">
                  {producto.caracteristicas.map((c) => (
                    <div key={c.etiqueta}>
                      <dt>{c.etiqueta}</dt>
                      <dd>{c.valor}</dd>
                    </div>
                  ))}
                </dl>
              ) : (
                <p>Sin especificaciones registradas.</p>
              ))}

            {pestana === "Opiniones" && <p>Aún no hay opiniones para este producto.</p>}
          </div>
        </div>
      </div>
    </div>
  );
}