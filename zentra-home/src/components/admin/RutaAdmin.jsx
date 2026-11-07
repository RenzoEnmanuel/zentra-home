import { Navigate, Outlet } from "react-router-dom";
import useAuth from "../../hooks/useAuth";

// Guardián: solo deja pasar al usuario con rol "admin"
export default function RutaAdmin() {
  const { usuario } = useAuth();

  if (!usuario) return <Navigate to="/login" replace />;
  if (usuario.rol !== "admin") return <Navigate to="/" replace />;

  return <Outlet />;
}