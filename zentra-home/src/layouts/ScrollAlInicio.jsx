import { useEffect } from "react";
import { useLocation, useNavigationType } from "react-router-dom";

// Al cambiar de página, sube al inicio (el navegador, por defecto, conserva el scroll anterior).
export default function ScrollAlInicio() {
  const { pathname, hash } = useLocation();
  const tipo = useNavigationType(); // "PUSH" (clic en enlace), "REPLACE" o "POP" (botón atrás/adelante)

  useEffect(() => {
    if (tipo === "POP" || hash) return; // atrás/adelante y enlaces con # los maneja el navegador
    // "instant" porque tu global.css activa scroll-behavior: smooth y no queremos que se vea deslizar
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
  }, [pathname, hash, tipo]);

  return null;
}