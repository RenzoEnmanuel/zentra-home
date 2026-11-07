import { Link, Navigate, Outlet, useLocation } from "react-router-dom";
import Stepper from "../components/checkout/Stepper";
import ResumenCompra from "../components/checkout/ResumenCompra";
import useAuth from "../hooks/useAuth";
import useCarrito from "../hooks/useCarrito";
import useCheckout from "../hooks/useCheckout";
import { PASOS } from "../data/checkout";
import logo from "../assets/img/logo.png";
import "./CheckoutLayout.css";

export default function CheckoutLayout() {
  const { pathname } = useLocation();
  const { estaLogueado } = useAuth();
  const { items } = useCarrito();
  const { pedidoCreado } = useCheckout();

  // El paso se deduce de la URL: /checkout/pago -> 2
  const paso = PASOS.find((p) => pathname === `/checkout/${p.ruta}`)?.numero ?? 1;

  // ---------- Guards: quién puede estar aquí ----------
  // 1) Ya pagó: solo puede ver la pantalla final (evita pagar dos veces con el botón "atrás")
  if (pedidoCreado && paso !== 3) return <Navigate to="/checkout/finalizado" replace />;
  // 2) Sin sesión: al login, y de vuelta al carrito (igual que en CarritoPanel)
  if (!estaLogueado) return <Navigate to="/login" replace state={{ volverACarrito: true }} />;
  // 3) Carrito vacío y sin pedido: no hay nada que pagar
  //    (si ya hay pedido, el carrito vacío es normal: ya se vació al pagar)
  if (!pedidoCreado && items.length === 0) return <Navigate to="/" replace />;

  return (
    <div className="checkout">
      <header className="checkout__encabezado">
        <Link to="/" aria-label="Volver al inicio de Zentra Home">
          <img src={logo} alt="Zentra Home" />
        </Link>
      </header>

      <div className="checkout__contenido">
        <Stepper paso={paso} />

        <div className={`checkout__cuerpo ${paso === 3 ? "checkout__cuerpo--solo" : ""}`}>
          <main>
            <Outlet />
          </main>
          {paso < 3 && <ResumenCompra paso={paso} />}
        </div>
      </div>
    </div>
  );
}