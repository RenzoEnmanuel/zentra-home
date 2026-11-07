import { useEffect, useState } from "react";
import { obtenerProductos } from "../services/productosService.js";

export default function useProductos() {
  const [productos, setProductos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);
  const [intento, setIntento] = useState(0);

  useEffect(() => {
    let cancelado = false;

    obtenerProductos()
      .then((lista) => {
        if (cancelado) return;
        setProductos(lista);
        setError(null);
      })
      .catch(() => {
        if (!cancelado) setError("No pudimos cargar los productos. Intenta nuevamente.");
      })
      .finally(() => {
        if (!cancelado) setCargando(false);
      });

    return () => {
      cancelado = true;
    };
  }, [intento]);

  const reintentar = () => {
    setCargando(true);
    setIntento((n) => n + 1);
  };

  return { productos, cargando, error, reintentar };
}