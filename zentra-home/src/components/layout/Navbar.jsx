import { useEffect, useRef, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Search, User, ChevronDown, ShoppingCart } from "lucide-react";
import useCarrito from "../../hooks/useCarrito";
import useAuth from "../../hooks/useAuth";
import logo from "../../assets/img/logo.png";
import "./Navbar.css";

export default function Navbar() {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const consulta = params.get("q") ?? "";
  const [sesionAbierta, setSesionAbierta] = useState(false);
  const sesionRef = useRef(null);
  const { cantidadTotal, abrir } = useCarrito();
  const { usuario, estaLogueado, salir } = useAuth();

  // Cierra el menú al hacer clic fuera o al presionar Esc
  useEffect(() => {
    if (!sesionAbierta) return;

    const cerrarSiClicFuera = (e) => {
      if (sesionRef.current && !sesionRef.current.contains(e.target)) {
        setSesionAbierta(false);
      }
    };
    const cerrarConEsc = (e) => {
      if (e.key === "Escape") setSesionAbierta(false);
    };

    document.addEventListener("mousedown", cerrarSiClicFuera);
    document.addEventListener("keydown", cerrarConEsc);
    return () => {
      document.removeEventListener("mousedown", cerrarSiClicFuera);
      document.removeEventListener("keydown", cerrarConEsc);
    };
  }, [sesionAbierta]);

  const irA = (ruta) => {
    setSesionAbierta(false);
    navigate(ruta);
  };

  const cerrarSesion = async () => {
    setSesionAbierta(false);
    await salir();
  };

  const buscar = (e) => {
    e.preventDefault();
    const texto = new FormData(e.currentTarget).get("q").trim();
    navigate({ pathname: "/", search: texto ? `?q=${encodeURIComponent(texto)}` : "" });
    document.getElementById("productos")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <header className="navbar">
      <a href="#inicio" className="navbar__logo">
        <img src={logo} alt="Zentra Home" />
      </a>

      <form className="navbar__buscador" onSubmit={buscar} role="search">
        <Search size={18} />
        <input
          key={consulta}
          name="q"
          type="search"
          placeholder="Buscar en ZENTRAHOME"
          aria-label="Buscar productos"
          defaultValue={consulta}
        />
      </form>

      <div className="navbar__acciones">
        <div className="navbar__sesion" ref={sesionRef}>
          <button
            className="navbar__sesion-boton"
            onClick={() => setSesionAbierta(!sesionAbierta)}
            aria-expanded={sesionAbierta}
            aria-haspopup="true"
          >
            <User size={18} />
            <span>{estaLogueado ? `Hola, ${usuario.nombres.split(" ")[0]}` : "Iniciar sesión"}</span>
            <ChevronDown size={16} className={sesionAbierta ? "navbar__flecha--girada" : ""} />
          </button>

          {sesionAbierta && (
            <div className="navbar__menu">
              {estaLogueado ? (
                <>
                  <p className="navbar__menu-correo">{usuario.correo}</p>
                  <button className="navbar__menu-boton" onClick={cerrarSesion}>Cerrar sesión</button>
                </>
              ) : (
                <>
                  <button className="navbar__menu-boton" onClick={() => irA("/login")}>Iniciar sesión</button>
                  <p>¿Eres nuevo en ZentraHome?</p>
                  <button className="navbar__menu-enlace" onClick={() => irA("/registro")}>Crea tu cuenta</button>
                </>
              )}
            </div>
          )}
        </div>

        <button
          className="navbar__carrito"
          onClick={abrir}
          aria-label={`Carrito, ${cantidadTotal} productos`}
        >
          <ShoppingCart size={22} />
          {cantidadTotal > 0 && <span className="navbar__contador">{cantidadTotal}</span>}
        </button>
      </div>
    </header>
  );
}