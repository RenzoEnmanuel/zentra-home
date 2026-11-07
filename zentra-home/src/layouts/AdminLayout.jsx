import { NavLink, Outlet, useLocation, useNavigate } from "react-router-dom";
import { LayoutDashboard, ShoppingCart, Package, Users, LogOut } from "lucide-react";
import useAuth from "../hooks/useAuth";
import logo from "../assets/img/logo-claro.png";
import "./AdminLayout.css";

// Un solo lugar para el menú. `to: null` = sección que aún no existe
const MENU = [
  { to: "/admin", texto: "Resumen", Icono: LayoutDashboard, end: true },
  { to: "/admin/pedidos", texto: "Pedidos", Icono: ShoppingCart },
  { to: "/admin/productos", texto: "Productos", Icono: Package },
  { to: null, texto: "Clientes", Icono: Users },
];

export default function AdminLayout() {
  const { salir } = useAuth();
  const navigate = useNavigate();
  const { pathname } = useLocation();

  // El título de la cabecera sale de la opción activa del menú
  const titulo = MENU.find((m) => m.to === pathname)?.texto ?? "Panel";

  const cerrarSesion = async () => {
    await salir();
    navigate("/login", { replace: true });
  };

  return (
    <div className="admin">
      <aside className="admin__lateral">
        <img src={logo} alt="Zentra Home" className="admin__logo" />

        <nav className="admin__menu" aria-label="Menú del panel">
          {MENU.map(({ to, texto, Icono, end }) =>
            to ? (
              <NavLink key={texto} to={to} end={end} className="admin__link">
                <Icono size={18} aria-hidden="true" />
                {texto}
              </NavLink>
            ) : (
              <span key={texto} className="admin__link admin__link--off" aria-disabled="true">
                <Icono size={18} aria-hidden="true" />
                {texto}
                <small>Pronto</small>
              </span>
            )
          )}
        </nav>

        <button type="button" className="admin__salir" onClick={cerrarSesion}>
          <LogOut size={18} aria-hidden="true" />
          Salir
        </button>
      </aside>

      <div className="admin__contenido">
        <header className="admin__cabecera">
          <h1>{titulo}</h1>
          <span className="admin__usuario">admin</span>
        </header>
        <main className="admin__pagina">
          <Outlet />
        </main>
      </div>
    </div>
  );
}