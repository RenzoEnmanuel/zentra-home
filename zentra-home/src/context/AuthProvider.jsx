import { useCallback, useState } from "react";
import { AuthContext } from "./AuthContext";
import { leerSesion, guardarSesion } from "./sesionStorage";
import { registrarUsuario, iniciarSesion, cerrarSesionApi } from "../services/authService";

export default function AuthProvider({ children }) {
  const [sesion, setSesion] = useState(leerSesion);

  const abrirSesion = (respuesta) => {
    const nueva = { user: respuesta.user, token: respuesta.token };
    guardarSesion(nueva);
    setSesion(nueva);
    return nueva.user;
  };

  // Registrar deja la sesión iniciada: así el cliente puede ir directo a pagar
  const registrar = async (datos) => abrirSesion(await registrarUsuario(datos));
  const ingresar = async (credenciales) => abrirSesion(await iniciarSesion(credenciales));

  const salir = useCallback(async () => {
    await cerrarSesionApi();
    guardarSesion(null);
    setSesion(null);
  }, []);

  const usuario = sesion?.user ?? null;

  return (
    <AuthContext.Provider value={{ usuario, estaLogueado: Boolean(usuario), registrar, ingresar, salir }}>
      {children}
    </AuthContext.Provider>
  );
}