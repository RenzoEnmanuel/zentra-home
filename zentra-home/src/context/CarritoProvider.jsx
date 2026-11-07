import { useCallback, useEffect, useState } from "react";
import { CarritoContext } from "./CarritoContext";

const CLAVE = "zentra-carrito";

// Lee el carrito guardado en el navegador (si existe y es válido)
function leerGuardado() {
  try {
    const datos = JSON.parse(localStorage.getItem(CLAVE));
    return Array.isArray(datos) ? datos : [];
  } catch {
    return [];
  }
}

export default function CarritoProvider({ children }) {
  const [items, setItems] = useState(leerGuardado);
  const [abierto, setAbierto] = useState(false);

  // Cada vez que cambia el carrito, lo guardamos
  useEffect(() => {
    try {
      localStorage.setItem(CLAVE, JSON.stringify(items));
    } catch {
      // Si el navegador no permite guardar, el carrito sigue funcionando en memoria
    }
  }, [items]);

  const abrir = useCallback(() => setAbierto(true), []);
  const cerrar = useCallback(() => setAbierto(false), []);

  const agregar = (producto, cantidad = 1) => {
    if (producto.stock <= 0) return;

    setItems((actual) => {
      const existente = actual.find((i) => i.id_producto === producto.id_producto);

      if (existente) {
        return actual.map((i) =>
          i.id_producto === producto.id_producto
            ? { ...i, stock: producto.stock, cantidad: Math.min(i.cantidad + cantidad, producto.stock) }
            : i
        );
      }

      return [
        ...actual,
        {
          id_producto: producto.id_producto,
          nombre: producto.nombre,
          precio_oferta: Number(producto.precio_oferta),
          imagen: producto.imagenes[0],
          stock: producto.stock,
          cantidad: Math.min(cantidad, producto.stock),
        },
      ];
    });
    setAbierto(true);
  };

  const cambiarCantidad = (id, delta) =>
    setItems((actual) =>
      actual.map((i) =>
        i.id_producto === id
          ? { ...i, cantidad: Math.max(1, Math.min(i.cantidad + delta, i.stock)) }
          : i
      )
    );

  const quitar = (id) => setItems((actual) => actual.filter((i) => i.id_producto !== id));
  const vaciar = () => setItems([]);

  // Valores derivados: se calculan a partir de items, no se guardan aparte
  const cantidadTotal = items.reduce((suma, i) => suma + i.cantidad, 0);
  const total = items.reduce((suma, i) => suma + i.precio_oferta * i.cantidad, 0);

  return (
    <CarritoContext.Provider
      value={{ items, abierto, abrir, cerrar, agregar, cambiarCantidad, quitar, vaciar, cantidadTotal, total }}
    >
      {children}
    </CarritoContext.Provider>
  );
}