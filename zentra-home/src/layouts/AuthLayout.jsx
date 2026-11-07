import { Link, Outlet } from "react-router-dom";
import logo from "../assets/img/logo.png";
import banner from "../assets/img/auth-banner.jpg";
import "./AuthLayout.css";

export default function AuthLayout() {
  return (
    <div className="auth-layout">
      <header className="auth-layout__encabezado">
        <Link to="/" aria-label="Volver al inicio de Zentra Home">
          <img src={logo} alt="Zentra Home" />
        </Link>
      </header>

      {/* Imagen decorativa: alt vacío para que el lector de pantalla la omita */}
      <img className="auth-layout__banner" src={banner} alt="" />

      <main className="auth-layout__contenido">
        <Outlet />
      </main>
    </div>
  );
}