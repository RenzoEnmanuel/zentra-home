import { Link, Navigate } from "react-router-dom";
import useCheckout from "../../hooks/useCheckout";
import "./Checkout.css";

export default function Finalizado() {
  const { pedidoCreado } = useCheckout();

  // Si entra directo a esta URL (o recarga la página) no hay pedido que mostrar
  if (!pedidoCreado) return <Navigate to="/" replace />;

  return (
    <section aria-labelledby="titulo-final">
      <h1 id="titulo-final" className="paso__titulo">Proceso finalizado</h1>

      <p className="paso__texto">
        Se ha completado tu compra con éxito, tu número de código del pedido es:
      </p>
      <p className="codigo-pedido">{pedidoCreado.codigo_rastreo}</p>

      <p className="paso__texto">
        ¡Gracias por tu compra! Tu pago ha sido procesado correctamente y la boleta
        correspondiente ha sido enviada a <strong>{pedidoCreado.correo_boleta}</strong>. Te
        recomendamos revisar tu bandeja de entrada y, si no encuentras el mensaje, verificar
        también la carpeta de correo no deseado o spam.
      </p>

      <div className="paso__acciones">
        <Link to={`/rastreo/${pedidoCreado.codigo_rastreo}`} className="boton-pildora">
          Rastrear mi pedido
        </Link>
        <Link to="/" className="boton-pildora boton-pildora--claro">Seguir comprando</Link>
      </div>
    </section>
  );
}