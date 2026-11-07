import { useEffect } from "react";

export default function useModalAbierto(activo, onCerrar) {
  useEffect(() => {
    if (!activo) return;

    const alPresionar = (e) => {
      if (e.key === "Escape") onCerrar();
    };
    document.addEventListener("keydown", alPresionar);
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", alPresionar);
      document.body.style.overflow = "";
    };
  }, [activo, onCerrar]);
}