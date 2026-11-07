import { Link, Navigate, useLocation, useNavigate } from "react-router-dom";
import CampoFormulario from "../components/auth/CampoFormulario";
import useAuth from "../hooks/useAuth";
import useFormulario from "../hooks/useFormulario";
import useCarrito from "../hooks/useCarrito";
import { validarObligatorio } from "../utils/validaciones";
import "./Auth.css";

const VALORES_INICIALES = { usuario: "", password: "" };
const REGLAS = {
  usuario: validarObligatorio("Ingresa tu correo o documento."),
  password: validarObligatorio("Ingresa tu contraseña."),
};

export default function Login() {
  const { estaLogueado, usuario, ingresar } = useAuth();
  const { abrir } = useCarrito();
  const navigate = useNavigate();
  const location = useLocation();
  const { propsDe, enviar, enviando, errorGeneral, formRef } = useFormulario(VALORES_INICIALES, REGLAS);

  const volverACarrito = location.state?.volverACarrito;

  // `ingresar` devuelve el usuario: si es admin va al panel, si no, a la tienda
  const alExito = (user) => {
    if (user?.rol === "admin") {
      navigate("/admin", { replace: true });
      return;
    }
    navigate("/", { replace: true });
    if (volverACarrito) abrir();
  };

  if (estaLogueado && !enviando) {
  return <Navigate to={usuario?.rol === "admin" ? "/admin" : "/"} replace />;
  }

  return (
    <section className="auth-tarjeta" aria-labelledby="titulo-login">
      <h1 id="titulo-login" className="auth-tarjeta__titulo">Iniciar sesión</h1>

      <form className="auth-form" ref={formRef} onSubmit={enviar(ingresar, alExito)} noValidate>
        {volverACarrito && (
          <p className="auth-form__aviso">Inicia sesión para continuar con tu pedido.</p>
        )}
        {errorGeneral && <p className="auth-form__alerta" role="alert">{errorGeneral}</p>}

        <CampoFormulario
          etiqueta="Usuario:"
          placeholder="Ingresa tu correo o Documento*"
          autoComplete="username"
          {...propsDe("usuario")}
        />
        <CampoFormulario
          etiqueta="Contraseña:"
          type="password"
          placeholder="Ingresa tu contraseña*"
          autoComplete="current-password"
          {...propsDe("password")}
        />

        <button type="submit" className="boton-pildora auth-form__enviar" disabled={enviando}>
          {enviando ? "Ingresando…" : "Ingresar"}
        </button>
      </form>

      <div className="auth-tarjeta__separador" aria-hidden="true">o</div>

      <div className="auth-tarjeta__alterna">
        <p>¿Eres nuevo en ZentraHome?</p>
        <Link to="/registro" state={location.state}>Crea tu cuenta</Link>
      </div>
    </section>
  );
}