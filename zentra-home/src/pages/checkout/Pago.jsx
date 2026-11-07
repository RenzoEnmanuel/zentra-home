import { Navigate, useNavigate } from "react-router-dom";
import CampoFormulario from "../../components/auth/CampoFormulario";
import useAuth from "../../hooks/useAuth";
import useCarrito from "../../hooks/useCarrito";
import useCheckout from "../../hooks/useCheckout";
import useFormulario from "../../hooks/useFormulario";
import { crearPedido } from "../../services/pedidoService";
import { validarCorreo, validarObligatorio } from "../../utils/validaciones";
import { METODOS_PAGO } from "../../data/checkout";
import "./Checkout.css";

const REGLAS = {
  metodoPago: validarObligatorio("Elige un método de pago."),
  correo: validarCorreo,
};



export default function Pago() {
  const navigate = useNavigate();
  const { usuario } = useAuth();
  const { items, vaciar } = useCarrito();
  const { entregaConfirmada, tipoEntrega, direccion, telefono, costoEnvio, totalFinal, registrarPedido, setProcesando } =
    useCheckout();

    

  const { propsDe, enviar, errorGeneral, formRef } = useFormulario(
    { metodoPago: "", correo: usuario?.correo ?? "" },
    REGLAS
  );
  const campoMetodo = propsDe("metodoPago");

  // No se puede pagar sin haber completado la entrega
  if (!entregaConfirmada) return <Navigate to="/checkout/entrega" replace />;

  // Se ejecuta solo si el formulario es válido
  const pagar = async (valores) => {
    setProcesando(true);
    try {
      const pedido = await crearPedido({
        cliente: usuario,
        items,
        tipoEntrega,
        direccion,
        telefono, 
        costoEnvio,
        total: totalFinal,
        metodoPago: valores.metodoPago,
        correoBoleta: valores.correo.trim(),
      });
      registrarPedido(pedido); // guarda el pedido para mostrarlo en la pantalla final
      vaciar();                // el pedido ya existe: se limpia el carrito
      return pedido;
    } finally {
      setProcesando(false);
    }
  };

  return (
    <section aria-labelledby="titulo-pago">
      <h1 id="titulo-pago" className="paso__titulo">Medios de pago</h1>

      {errorGeneral && <p className="paso__alerta" role="alert">{errorGeneral}</p>}

      <form
        id="form-pago"
        ref={formRef}
        onSubmit={enviar(pagar, () => navigate("/checkout/finalizado", { replace: true }))}
        noValidate
      >
        <fieldset className="paso__tarjeta">
          <legend>Elige cómo quieres pagar</legend>
          {METODOS_PAGO.map((m) => (
            <label
              key={m.id}
              className={`opcion ${campoMetodo.value === m.id ? "opcion--activa" : ""}`}
            >
              <input
                type="radio"
                name="metodoPago"
                value={m.id}
                checked={campoMetodo.value === m.id}
                onChange={campoMetodo.onChange}
              />
              <span className="opcion__texto">{m.etiqueta}</span>
            </label>
          ))}
          {campoMetodo.error && <p className="paso__error" role="alert">{campoMetodo.error}</p>}
        </fieldset>

        <div className="paso__tarjeta">
          <h2 className="paso__titulo">Boleta</h2>
          <CampoFormulario
            etiqueta="Correo donde enviaremos tu boleta:"
            type="email"
            autoComplete="email"
            {...propsDe("correo")}
          />
        </div>
      </form>
    </section>
  );
}