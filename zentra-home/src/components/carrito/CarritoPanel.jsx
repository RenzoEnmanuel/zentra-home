import { useNavigate } from "react-router-dom";
import { Minus, Plus, Trash2, X } from "lucide-react";
import useCarrito from "../../hooks/useCarrito";
import useAuth from "../../hooks/useAuth";
import useModalAbierto from "../../hooks/useModalAbierto";
import { formatoSoles } from "../../utils/formato";
import "./CarritoPanel.css";

export default function CarritoPanel() {
  const { abierto, cerrar, items, total, cambiarCantidad, quitar, vaciar } = useCarrito();
  const { estaLogueado } = useAuth();
  const navigate = useNavigate();

  useModalAbierto(abierto, cerrar);

  if (!abierto) return null;

  const confirmar = () => {
    // Para pagar hace falta una cuenta: sin sesión, vamos al login y luego volvemos aquí
    if (!estaLogueado) {
      cerrar();
      navigate("/login", { state: { volverACarrito: true } });
      return;
    }
      // Con sesión iniciada: cerramos el panel y pasamos al paso 1 del checkout
      cerrar();
      navigate("/checkout/entrega");
    };
    
  return (
    <div className="carrito__fondo" onClick={cerrar}>
      <aside
        className="carrito"
        role="dialog"
        aria-modal="true"
        aria-label="Carrito de compras"
        onClick={(e) => e.stopPropagation()}
      >
        <header className="carrito__encabezado">
          <h2>Tu carrito</h2>
          <button onClick={cerrar} aria-label="Cerrar carrito">
            <X size={22} />
          </button>
        </header>

        {items.length === 0 ? (
          <div className="carrito__vacio">
            <p>Tu carrito está vacío.</p>
            <a href="#productos" className="boton-pildora" onClick={cerrar}>
              Explorar productos
            </a>
          </div>
        ) : (
          <>
            <ul className="carrito__lista">
              {items.map((item) => (
                <li key={item.id_producto} className="carrito__item">
                  <img src={item.imagen} alt="" />

                  <div>
                    <p className="carrito__nombre">{item.nombre}</p>
                    <p className="carrito__precio">{formatoSoles(item.precio_oferta)}</p>

                    <div className="carrito__cantidad">
                      <button
                        onClick={() => cambiarCantidad(item.id_producto, -1)}
                        disabled={item.cantidad <= 1}
                        aria-label="Disminuir cantidad"
                      >
                        <Minus size={14} />
                      </button>
                      <span>{item.cantidad}</span>
                      <button
                        onClick={() => cambiarCantidad(item.id_producto, 1)}
                        disabled={item.cantidad >= item.stock}
                        aria-label="Aumentar cantidad"
                      >
                        <Plus size={14} />
                      </button>
                    </div>
                  </div>

                  <button
                    className="carrito__quitar"
                    onClick={() => quitar(item.id_producto)}
                    aria-label={`Quitar ${item.nombre}`}
                  >
                    <Trash2 size={18} />
                  </button>
                </li>
              ))}
            </ul>

            <footer className="carrito__pie">
              <div className="carrito__total">
                <span>Total</span>
                <strong>{formatoSoles(total)}</strong>
              </div>
              <button className="boton-pildora carrito__confirmar" onClick={confirmar}>
                Confirmar solicitud de pedido
              </button>
              <button className="carrito__vaciar" onClick={vaciar}>
                Vaciar carrito
              </button>
            </footer>
          </>
        )}
      </aside>
    </div>
  );
}