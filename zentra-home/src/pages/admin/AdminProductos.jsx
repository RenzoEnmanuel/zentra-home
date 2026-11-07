import { useState } from "react";
import { Search, Pencil, Plus } from "lucide-react";
import FormularioProducto from "../../components/admin/FormularioProducto";
import useProductos from "../../hooks/useProductos";
import { STOCK_CRITICO } from "../../data/admin";
import { formatoSoles, normalizarTexto } from "../../utils/formato";
import "./AdminPaginas.css";

export default function AdminProductos() {
  const { productos: base, cargando, error, reintentar } = useProductos();

  // La API aún no guarda cambios, así que se llevan en memoria:
  //  - nuevos: productos creados aquí
  //  - cambios: ediciones y activar/desactivar, por id_producto
  const [nuevos, setNuevos] = useState([]);
  const [cambios, setCambios] = useState({});
  const [formulario, setFormulario] = useState(null); // null = cerrado | "nuevo" | un producto
  const [busqueda, setBusqueda] = useState("");

  // Lista final: nuevos + catálogo, con los cambios aplicados. Sin dato, "activo" es true.
  const productos = [...nuevos, ...base].map((p) => ({
    activo: true,
    ...p,
    ...cambios[p.id_producto],
  }));

  // Buscar por nombre, SKU o categoría (sin importar mayúsculas ni tildes)
  const texto = normalizarTexto(busqueda.trim());
  const visibles = productos.filter(
    (p) =>
      !texto || normalizarTexto(`${p.nombre} ${p.codigo_sku} ${p.categoria}`).includes(texto)
  );

  const cambiarActivo = (p) =>
    setCambios((c) => ({ ...c, [p.id_producto]: { ...c[p.id_producto], activo: !p.activo } }));

  const guardarProducto = (datos) => {
    if (formulario === "nuevo") {
      setNuevos((lista) => [
        { id_producto: Date.now(), activo: true, descripcion: "", caracteristicas: [], imagenes: [datos.imagen_url], ...datos },
        ...lista,
      ]);
    } else {
      setCambios((c) => ({ ...c, [formulario.id_producto]: { ...c[formulario.id_producto], ...datos } }));
    }
    setFormulario(null);
  };

  // SKU ya usados por OTROS productos (para no permitir repetidos)
  const skusUsados = formulario
    ? productos
        .filter((p) => formulario === "nuevo" || p.id_producto !== formulario.id_producto)
        .map((p) => p.codigo_sku.toLowerCase())
    : [];

  const claseStock = (stock) =>
    stock <= 0 ? "stock stock--cero" : stock <= STOCK_CRITICO ? "stock stock--bajo" : "stock";

  return (
    <>
      <div className="pedidos__barra">
        <div className="buscador">
          <Search size={16} aria-hidden="true" />
          <input
            type="search"
            placeholder="Buscar nombre, SKU o categoría"
            aria-label="Buscar productos"
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
          />
        </div>

        <button type="button" className="boton-pildora boton-nuevo" onClick={() => setFormulario("nuevo")}>
          <Plus size={14} aria-hidden="true" /> Nuevo producto
        </button>
      </div>

      {cargando && <p className="panel aviso-panel" role="status">Cargando productos…</p>}

      {!cargando && error && (
        <div className="panel aviso-panel" role="alert">
          <p>{error}</p>
          <button type="button" className="boton-pildora" onClick={reintentar}>Reintentar</button>
        </div>
      )}

      {!cargando && !error && (
        <div className="panel tabla-envoltorio">
          <table className="tabla">
            <thead>
              <tr>
                <th>Producto</th><th>Categoría</th><th>Precio</th>
                <th>Stock</th><th>Disponibilidad</th><th className="tabla__derecha">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {visibles.length === 0 ? (
                <tr><td colSpan="6" className="tabla__vacio">No hay productos que coincidan.</td></tr>
              ) : (
                visibles.map((p) => (
                  <tr key={p.id_producto} className={p.activo ? "" : "fila--inactiva"}>
                    <td>
                      <span className="tabla__codigo">{p.nombre}</span>
                      <small className="tabla__sku">{p.codigo_sku}</small>
                    </td>
                    <td>{p.categoria}</td>
                    <td className="tabla__total">
                      {formatoSoles(p.precio_oferta ?? p.precio_regular)}
                      {p.precio_oferta != null && <s className="tabla__tachado">{formatoSoles(p.precio_regular)}</s>}
                    </td>
                    <td className={claseStock(p.stock)}>{p.stock} {p.stock === 1 ? "unidad" : "unidades"}</td>
                    <td>
                      <span className={`badge ${p.activo ? "badge--activo" : "badge--desactivado"}`}>
                        {p.activo ? "Activo" : "Desactivado"}
                      </span>
                    </td>
                    <td>
                      <div className="tabla__acciones">
                        <button type="button" className="boton-revisar" onClick={() => setFormulario(p)}>
                          <Pencil size={14} aria-hidden="true" /> Editar
                        </button>
                        <button
                          type="button"
                          className={p.activo ? "boton-desactivar" : "boton-activar"}
                          onClick={() => cambiarActivo(p)}
                        >
                          {p.activo ? "Desactivar" : "Activar"}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}

      {formulario && (
        <FormularioProducto
          producto={formulario === "nuevo" ? null : formulario}
          skusUsados={skusUsados}
          onCerrar={() => setFormulario(null)}
          onGuardar={guardarProducto}
        />
      )}
    </>
  );
}