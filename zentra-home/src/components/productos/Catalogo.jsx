import { useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import useProductos from "../../hooks/useProductos";
import { CATEGORIAS } from "../../data/categorias";
import { normalizarTexto } from "../../utils/formato";
import FiltrosCategorias from "./FiltrosCategorias";
import ListaProductos from "./ListaProductos";
import DetalleModal from "./DetalleModal";
import useCarrito from "../../hooks/useCarrito";
import "./Catalogo.css";

export default function Catalogo() {
  const { productos, cargando, error, reintentar } = useProductos();
  const [categoria, setCategoria] = useState("Todos");
  const [seleccionado, setSeleccionado] = useState(null);
  const { agregar } = useCarrito();

  // La búsqueda vive en la URL (?q=...), porque la escribe el Navbar
  const [params, setParams] = useSearchParams();
  const consulta = params.get("q") ?? "";

  const filtrados = useMemo(() => {
  const texto = normalizarTexto(consulta);
    return productos.filter((p) => {
      const coincideCategoria = categoria === "Todos" || p.categoria === categoria;
      const coincideTexto = normalizarTexto(`${p.nombre} ${p.marca}`).includes(texto);
      return coincideCategoria && coincideTexto;
    });
  }, [productos, categoria, consulta]);

  const mensajeVacio = consulta
    ? `No encontramos productos para «${consulta}». Prueba con términos más generales.`
    : "No se encontraron electrodomésticos en esta categoría";

  return (
    <section id="productos" className="catalogo">
      <h2 className="catalogo__titulo">Encuentra tu próximo Producto favorito</h2>

      <FiltrosCategorias categorias={CATEGORIAS} activa={categoria} onCambiar={setCategoria} />

      {consulta && (
        <p className="catalogo__resultado">
          Resultados para «{consulta}»
          <button onClick={() => setParams({})}>Limpiar búsqueda</button>
        </p>
      )}

      <ListaProductos
        productos={filtrados}
        cargando={cargando}
        error={error}
        mensajeVacio={mensajeVacio}
        onReintentar={reintentar}
        onSeleccionar={setSeleccionado}
        onAgregar={agregar}
      />

      {seleccionado && (
        <DetalleModal
          producto={seleccionado}
          onCerrar={() => setSeleccionado(null)}
          onAgregar={agregar}
        />
      )}
    </section>
  );
}