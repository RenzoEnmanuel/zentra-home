import { useEffect, useState } from "react";
import { Search, Eye } from "lucide-react";
import DetallePedido from "../../components/admin/DetallePedido";
import { ESTADOS_ADMIN } from "../../data/admin";
import { listarPedidosAdmin, cambiarEstadoPedido } from "../../services/adminService";
import { formatoSoles, normalizarTexto } from "../../utils/formato";
import "./AdminPaginas.css";

// "En proceso" -> "en-proceso" (para la clase de color de la etiqueta)
const claseEstado = (estado) => normalizarTexto(estado).replace(/\s+/g, "-");

export default function AdminPedidos() {
  const [pedidos, setPedidos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState("");
  const [busqueda, setBusqueda] = useState("");
  const [filtro, setFiltro] = useState("Todos");
  const [seleccionado, setSeleccionado] = useState(null);

  // Carga los pedidos reales desde la API
  useEffect(() => {
    let activo = true;
    listarPedidosAdmin()
      .then((datos) => {
        if (activo) setPedidos(datos);
      })
      .catch(() => {
        if (activo) setError("No pudimos cargar los pedidos.");
      })
      .finally(() => {
        if (activo) setCargando(false);
      });
    return () => {
      activo = false;
    };
  }, []);

  // Aplica el filtro de estado y el texto buscado
  const texto = normalizarTexto(busqueda.trim());
  const visibles = pedidos.filter((p) => {
    const coincideEstado = filtro === "Todos" || p.estado === filtro;
    const coincideTexto =
      !texto || normalizarTexto(`${p.codigo} ${p.cliente} ${p.producto}`).includes(texto);
    return coincideEstado && coincideTexto;
  });

  const cuenta = (estado) =>
    estado === "Todos" ? pedidos.length : pedidos.filter((p) => p.estado === estado).length;

  // Guarda el nuevo estado en la base de datos
  const guardarEstado = async (codigo, nuevoEstado) => {
    try {
      const actualizado = await cambiarEstadoPedido(codigo, nuevoEstado);
      setPedidos((lista) => lista.map((p) => (p.codigo === codigo ? actualizado : p)));
      setError("");
    } catch {
      setError("No se pudo guardar el estado del pedido.");
    }
    setSeleccionado(null);
  };

  return (
    <>
      <div className="pedidos__barra">
        <div className="buscador">
          <Search size={16} aria-hidden="true" />
          <input
            type="search"
            placeholder="Buscar por código, cliente o producto"
            aria-label="Buscar pedidos"
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
          />
        </div>

        <div className="filtros" role="group" aria-label="Filtrar por estado">
          {["Todos", ...ESTADOS_ADMIN].map((estado) => (
            <button
              key={estado}
              type="button"
              className={`filtro ${filtro === estado ? "filtro--activo" : ""}`}
              aria-pressed={filtro === estado}
              onClick={() => setFiltro(estado)}
            >
              {estado} ({cuenta(estado)})
            </button>
          ))}
        </div>
      </div>

      <div className="panel tabla-envoltorio">
        <table className="tabla">
          <thead>
            <tr>
              <th>Código</th><th>Cliente</th><th>Producto</th>
              <th>Fecha</th><th>Total</th><th>Estado</th><th>Acción</th>
            </tr>
          </thead>
          <tbody>
            {visibles.length === 0 ? (
              <tr>
                <td colSpan="7" className="tabla__vacio">
                  {cargando ? "Cargando pedidos..." : error || "No hay pedidos que coincidan."}
                </td>
              </tr>
            ) : (
              visibles.map((p) => (
                <tr key={p.codigo}>
                  <td className="tabla__codigo">{p.codigo}</td>
                  <td>{p.cliente}</td>
                  <td>{p.producto}</td>
                  <td>{p.fecha}</td>
                  <td className="tabla__total">{formatoSoles(p.total)}</td>
                  <td><span className={`badge badge--${claseEstado(p.estado)}`}>{p.estado}</span></td>
                  <td>
                    <button type="button" className="boton-revisar" onClick={() => setSeleccionado(p)}>
                      <Eye size={14} aria-hidden="true" /> Revisar
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {seleccionado && (
        <DetallePedido
          pedido={seleccionado}
          onCerrar={() => setSeleccionado(null)}
          onGuardar={guardarEstado}
        />
      )}
    </>
  );
}