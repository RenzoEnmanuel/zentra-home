import { ClipboardList, ShoppingCart, Package, Info } from "lucide-react";
import TarjetaDato from "../../components/admin/TarjetaDato";
import GraficoVentas from "../../components/admin/GraficoVentas";
import DonaEstados from "../../components/admin/DonaEstados";
import { PEDIDOS_ADMIN, VENTAS_MENSUALES, PEDIDOS_POR_ESTADO, STOCK_CRITICO } from "../../data/admin";
import { PRODUCTOS } from "../../data/productos";
import { formatoSoles } from "../../utils/formato";
import "./AdminPaginas.css";

const formatoCorto = (n) => `S/ ${(n / 1000).toFixed(1)}K`;

export default function AdminResumen() {
  // Fecha de hoy, ej. "Viernes, 6 de noviembre"
  const hoy = new Date().toLocaleDateString("es-PE", { weekday: "long", day: "numeric", month: "long" });
  const fecha = hoy.charAt(0).toUpperCase() + hoy.slice(1);

  // Tarjetas: todo calculado desde los datos
  const pendientes = PEDIDOS_ADMIN.filter((p) => p.estado !== "Entregado").length;
  const ventas = PEDIDOS_ADMIN.reduce((suma, p) => suma + p.total, 0);
  const productosActivos = PRODUCTOS.length;
  const stockCritico = PRODUCTOS.filter((p) => p.stock <= STOCK_CRITICO).length;

  // Gráfico: último mes frente al anterior
  const ultimo = VENTAS_MENSUALES[VENTAS_MENSUALES.length - 1];
  const anterior = VENTAS_MENSUALES[VENTAS_MENSUALES.length - 2];
  const crecimiento = (((ultimo.monto - anterior.monto) / anterior.monto) * 100).toFixed(1);
  const pedidosMes = PEDIDOS_POR_ESTADO.reduce((suma, e) => suma + e.cantidad, 0);
  const ticketPromedio = Math.round(ultimo.monto / pedidosMes);

  return (
    <>
      <div className="admin-saludo">
        <p className="admin-saludo__fecha">{fecha}</p>
        <h2 className="admin-saludo__titulo">Bienvenido, admin</h2>
      </div>

      <section className="resumen__tarjetas" aria-label="Indicadores principales">
        <TarjetaDato titulo="Pedidos pendientes" valor={pendientes} nota="Requieren seguimiento" Icono={ClipboardList} />
        <TarjetaDato titulo="Ventas registradas" valor={formatoSoles(ventas)} nota="En pedidos recientes" Icono={ShoppingCart} />
        <TarjetaDato titulo="Productos activos" valor={productosActivos} nota="En el catálogo" Icono={Package} />
        <TarjetaDato titulo="Stock crítico" valor={stockCritico} nota="Productos por reponer" Icono={Info} alerta />
      </section>

      <section className="resumen__paneles">
        <article className="panel">
          <div className="panel__cabecera">
            <div>
              <h3 className="panel__titulo">
                Evolución de ventas
                <span className="crecimiento">+{crecimiento}%</span>
              </h3>
              <p className="panel__sub">Valor referencial de pedidos registrados</p>
            </div>
            <span className="chip">Últimos 6 meses</span>
          </div>

          <div className="mini-stats">
            <div><small>Ventas de {ultimo.mes}</small><strong>{formatoCorto(ultimo.monto)}</strong></div>
            <div><small>Pedidos</small><strong>{pedidosMes}</strong></div>
            <div><small>Ticket promedio</small><strong>{formatoSoles(ticketPromedio)}</strong></div>
          </div>

          <GraficoVentas datos={VENTAS_MENSUALES} />
        </article>

        <article className="panel">
          <h3 className="panel__titulo">Estado de pedidos</h3>
          <p className="panel__sub">Distribución del mes actual</p>
          <DonaEstados datos={PEDIDOS_POR_ESTADO} />
        </article>
      </section>
    </>
  );
}