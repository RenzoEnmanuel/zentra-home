import { useNavigate } from "react-router-dom";
import CampoFormulario from "../../components/auth/CampoFormulario";
import useFormulario from "../../hooks/useFormulario";
import useCheckout from "../../hooks/useCheckout";
import { validarDireccion, validarTelefono } from "../../utils/validaciones";
import { formatoSolesExacto } from "../../utils/formato";
import { OPCIONES_ENTREGA } from "../../data/checkout";
import "./Checkout.css";

export default function Entrega() {
  const navigate = useNavigate();
  const { tipoEntrega, cambiarTipoEntrega, direccion, telefono, confirmarEntrega } = useCheckout();

  // La dirección solo es obligatoria si eligió despacho; el teléfono siempre
  const reglas = {
    direccion: tipoEntrega === "despacho" ? validarDireccion : () => "",
    telefono: validarTelefono,
  };
  const { propsDe, enviar, formRef } = useFormulario({ direccion, telefono }, reglas);

  // Lo que se hace al enviar el formulario (ya validado): guardar en el contexto
  const guardar = (valores) =>
    confirmarEntrega({
      direccion: valores.direccion.trim(),
      telefono: valores.telefono.replace(/\s/g, ""), // se guarda solo con dígitos
    });

  return (
    <section aria-labelledby="titulo-entrega">
      <h1 id="titulo-entrega" className="paso__titulo">Agregar dirección</h1>

      {/* id="form-entrega": el botón "Continuar" del resumen apunta a este formulario */}
      <form
        id="form-entrega"
        ref={formRef}
        onSubmit={enviar(guardar, () => navigate("/checkout/pago"))}
        noValidate
      >
        <div className="paso__tarjeta">
          <CampoFormulario
            etiqueta="Ingresa una dirección para recibir tus productos:"
            placeholder="Av. / Calle, número, distrito"
            autoComplete="street-address"  
            {...propsDe("direccion")}
          />

          <CampoFormulario
            etiqueta="Teléfono de contacto:"
            type="tel"
            inputMode="tel"
            placeholder="987654321"
            maxLength={11}
            autoComplete="tel"
            ayuda="Lo usaremos para coordinar la entrega o el retiro de tu pedido."
            {...propsDe("telefono")}
          />
        </div>

        <fieldset className="paso__tarjeta">
          <legend>Selecciona la entrega</legend>
          {OPCIONES_ENTREGA.map((o) => (
            <label
              key={o.id}
              className={`opcion ${tipoEntrega === o.id ? "opcion--activa" : ""}`}
            >
              <input
                type="radio"
                name="tipoEntrega"
                value={o.id}
                checked={tipoEntrega === o.id}
                onChange={() => cambiarTipoEntrega(o.id)}
              />
              <span className="opcion__texto">{o.etiqueta}</span>
              <span className="opcion__precio">
                {o.costo === 0 ? "Gratis" : formatoSolesExacto(o.costo)}
              </span>
            </label>
          ))}
        </fieldset>
      </form>
    </section>
  );
}