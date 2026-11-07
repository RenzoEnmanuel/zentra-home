import { useCallback, useEffect, useState } from "react";
import { Link, Navigate, useLocation, useNavigate } from "react-router-dom";
import { CircleCheck } from "lucide-react";
import CampoFormulario from "../components/auth/CampoFormulario";
import useAuth from "../hooks/useAuth";
import useFormulario from "../hooks/useFormulario";
import useCarrito from "../hooks/useCarrito";
import {
  validarCorreo,
  validarNombres,
  validarApellidos,
  validarDocumento,
  validarPassword,
  LARGO_MIN_PASSWORD,
} from "../utils/validaciones";
import "./Auth.css";

const VALORES_INICIALES = { correo: "", nombres: "", apellidos: "", documento: "", password: "" };
const REGLAS = {
  correo: validarCorreo,
  nombres: validarNombres,
  apellidos: validarApellidos,
  documento: validarDocumento,
  password: validarPassword,
};

const SEGUNDOS_ESPERA = 4;

export default function Registro() {
  const { estaLogueado, registrar } = useAuth();
  const { abrir } = useCarrito();
  const navigate = useNavigate();
  const location = useLocation();
  const { propsDe, enviar, enviando, errorGeneral, formRef } = useFormulario(VALORES_INICIALES, REGLAS);

  // Guarda al usuario recién creado; mientras sea null se muestra el formulario
  const [nuevoUsuario, setNuevoUsuario] = useState(null);

  // Si venía del carrito ("Confirmar pedido"), al terminar lo devolvemos ahí
  const volverACarrito = location.state?.volverACarrito;

  const continuar = useCallback(() => {
    navigate("/", { replace: true });
    if (volverACarrito) abrir();
  }, [navigate, abrir, volverACarrito]);

  // Tras registrarse, espera unos segundos y continúa solo
  useEffect(() => {
    if (!nuevoUsuario) return;
    const temporizador = setTimeout(continuar, SEGUNDOS_ESPERA * 1000);
    return () => clearTimeout(temporizador); // si se va antes, cancelamos el temporizador
  }, [nuevoUsuario, continuar]);

  // Si ya había sesión antes de entrar aquí, no tiene sentido ver el formulario
  if (estaLogueado && !nuevoUsuario) return <Navigate to="/" replace />;

  if (nuevoUsuario) {
    return (
      <section className="auth-tarjeta" aria-live="polite">
        <div className="auth-exito" role="status">
          <CircleCheck size={64} className="auth-exito__icono" aria-hidden="true" />
          <h1>¡Registro exitoso!</h1>
          <p>
            Bienvenido a Zentra Home, {nuevoUsuario.nombres.split(" ")[0]}. Tu cuenta ya está lista
            {volverACarrito ? " y te llevaremos de vuelta a tu carrito." : "."}
          </p>
          <button className="boton-pildora auth-exito__boton" onClick={continuar}>
            {volverACarrito ? "Volver a mi carrito" : "Ir a la tienda"}
          </button>
        </div>
      </section>
    );
  }

  return (
    <section className="auth-tarjeta" aria-labelledby="titulo-registro">
      <h1 id="titulo-registro" className="auth-tarjeta__titulo">Crea tu cuenta</h1>

      <form className="auth-form" ref={formRef} onSubmit={enviar(registrar, setNuevoUsuario)} noValidate>
        {errorGeneral && <p className="auth-form__alerta" role="alert">{errorGeneral}</p>}

        <CampoFormulario
          etiqueta="Correo"
          type="email"
          placeholder="Ingresa tu correo*"
          autoComplete="email"
          {...propsDe("correo")}
        />
        <CampoFormulario
          etiqueta="Nombres"
          placeholder="Ingresa tus nombres*"
          autoComplete="given-name"
          {...propsDe("nombres")}
        />
        <CampoFormulario
          etiqueta="Apellidos"
          placeholder="Ingresa tus Apellidos*"
          autoComplete="family-name"
          {...propsDe("apellidos")}
        />
        <CampoFormulario
          etiqueta="Documento"
          placeholder="Ingresa documento de identidad (DNI/CE)*"
          autoComplete="off"
          maxLength={12}
          {...propsDe("documento")}
        />
        <CampoFormulario
          etiqueta="Contraseña"
          type="password"
          placeholder="Ingresa tu contraseña*"
          autoComplete="new-password"
          ayuda={`Mínimo ${LARGO_MIN_PASSWORD} caracteres, con letras y números.`}
          {...propsDe("password")}
        />

        <button type="submit" className="boton-pildora auth-form__enviar" disabled={enviando}>
          {enviando ? "Creando cuenta…" : "Regístrate"}
        </button>
      </form>

      <div className="auth-tarjeta__separador" aria-hidden="true">o</div>

      <div className="auth-tarjeta__alterna">
        <Link to="/login" state={location.state}>Ya tengo una cuenta</Link>
      </div>
    </section>
  );
}