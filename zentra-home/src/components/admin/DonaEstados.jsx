const COLORES = {
  Registrado: "#3556d8",
  "En proceso": "#e8a238",
  Despachado: "#1f9d6b",
  Entregado: "#c4cad1",
};

export default function DonaEstados({ datos }) {
  const total = datos.reduce((suma, d) => suma + d.cantidad, 0);

  // Arma los tramos del círculo: "azul 0% 22%, naranja 22% 49%, ..."
  let acumulado = 0;
  const tramos = datos.map((d) => {
    const inicio = acumulado;
    acumulado += (d.cantidad / total) * 100;
    return `${COLORES[d.estado]} ${inicio}% ${acumulado}%`;
  });

  return (
    <>
      <div className="dona-contenedor">
        <div
          className="dona"
          style={{ background: `conic-gradient(${tramos.join(", ")})` }}
          role="img"
          aria-label={`${total} pedidos repartidos por estado`}
        >
          <div className="dona__centro">
            <strong>{total}</strong>
            <small>Pedidos</small>
          </div>
        </div>
      </div>

      <ul className="leyenda">
        {datos.map((d) => {
          const porcentaje = Math.round((d.cantidad / total) * 100);
          return (
            <li key={d.estado}>
              <div className="leyenda__fila">
                <span>
                  <i className="leyenda__punto" style={{ background: COLORES[d.estado] }} />
                  {d.estado}
                </span>
                <span><strong>{d.cantidad}</strong> {porcentaje}%</span>
              </div>
              <div className="leyenda__barra">
                <span style={{ width: `${porcentaje}%`, background: COLORES[d.estado] }} />
              </div>
            </li>
          );
        })}
      </ul>
    </>
  );
}