import CardProducto from "./CardProducto";

export default function ListaProductos({
  productos, cargando, error, mensajeVacio, onReintentar, onSeleccionar, onAgregar,
}) {
  if (cargando) {
    return (
      <div className="catalogo__grilla" aria-busy="true">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="catalogo__esqueleto" />
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="catalogo__mensaje" role="alert">
        <p>{error}</p>
        <button className="boton-pildora" onClick={onReintentar}>Reintentar</button>
      </div>
    );
  }

  if (productos.length === 0) {
    return <div className="catalogo__mensaje"><p>{mensajeVacio}</p></div>;
  }

  return (
    <div className="catalogo__grilla">
      {productos.map((producto) => (
        <CardProducto
          key={producto.id_producto}
          producto={producto}
          onSeleccionar={onSeleccionar}
          onAgregar={onAgregar}
        />
      ))}
    </div>
  );
}