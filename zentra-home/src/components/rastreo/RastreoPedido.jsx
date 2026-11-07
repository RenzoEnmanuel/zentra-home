import { useNavigate } from "react-router-dom";
import imagenRastreo from "../../assets/img/rastreo.png";
import CampoFormulario from "../auth/CampoFormulario";
import useFormulario from "../../hooks/useFormulario";
import { validarObligatorio } from "../../utils/validaciones";
import "./RastreoPedido.css";

const REGLAS = { codigo: validarObligatorio("Ingresa el código de tu compra.") };

// Caja "Rastrea tu pedido". Se usa en el inicio y en la página de resultado.
export default function RastreoPedido({ codigoInicial = "" }) {
  const navigate = useNavigate();
  const { propsDe, enviar, formRef } = useFormulario({ codigo: codigoInicial }, REGLAS);

  // Se ejecuta solo si el campo no está vacío: lleva a la página de resultado
  const buscar = ({ codigo }) =>
    navigate(`/rastreo/${encodeURIComponent(codigo.trim().toUpperCase())}`);

  return (
    // id="seguimiento": a este bloque apuntan "Rastrear mi pedido" (Hero) y el Footer
    <section className="rastreo" id="seguimiento" aria-labelledby="titulo-rastreo">
    <img className="rastreo__imagen" src={imagenRastreo} alt="" />

      <div className="rastreo__contenido">
        <h2 id="titulo-rastreo" className="rastreo__titulo">Rastrea tu pedido</h2>

        <form ref={formRef} onSubmit={enviar(buscar)} noValidate>
          <CampoFormulario
            etiqueta="Código de compra"
            placeholder="Ingresa tu código de compra"
            autoComplete="off"
            {...propsDe("codigo")}
          />

          <details className="rastreo__ayuda">
            <summary>¿Qué es código de compra?</summary>
            <p>
              Es el código que te mostramos al finalizar tu compra (por ejemplo, ZH-2026-0001).
              También lo encuentras en el correo donde enviamos tu boleta.
            </p>
          </details>

          <button type="submit" className="boton-pildora rastreo__boton">Buscar</button>
        </form>
      </div>
    </section>
  );
}