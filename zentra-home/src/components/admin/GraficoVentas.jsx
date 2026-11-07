const ANCHO = 600;
const ALTO = 240;
const M = { izq: 46, der: 14, arr: 14, abajo: 30 }; // márgenes para los textos

export default function GraficoVentas({ datos }) {
  const maximo = Math.max(...datos.map((d) => d.monto));
  const tope = Math.ceil(maximo / 20000) * 20000; // sube al siguiente múltiplo de 20 mil
  const w = ANCHO - M.izq - M.der;
  const h = ALTO - M.arr - M.abajo;

  // Convierten un dato en coordenadas del dibujo
  const x = (i) => M.izq + (i * w) / (datos.length - 1);
  const y = (valor) => M.arr + h - (valor / tope) * h;

  const puntos = datos.map((d, i) => `${x(i)},${y(d.monto)}`);
  const linea = `M ${puntos.join(" L ")}`;
  const area = `${linea} L ${x(datos.length - 1)},${M.arr + h} L ${x(0)},${M.arr + h} Z`;

  // Líneas horizontales de guía: 0, 20K, 40K...
  const guias = [0, 1, 2, 3, 4].map((n) => (tope / 4) * n);

  return (
    <svg
      className="grafico"
      viewBox={`0 0 ${ANCHO} ${ALTO}`}
      role="img"
      aria-label="Gráfico de línea de las ventas de los últimos meses"
    >
      <defs>
        <linearGradient id="relleno-ventas" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#3556d8" stopOpacity="0.18" />
          <stop offset="100%" stopColor="#3556d8" stopOpacity="0" />
        </linearGradient>
      </defs>

      {guias.map((valor) => (
        <g key={valor}>
          <line x1={M.izq} x2={ANCHO - M.der} y1={y(valor)} y2={y(valor)} stroke="#edf1f0" />
          <text x={M.izq - 8} y={y(valor) + 4} textAnchor="end">
            {valor === 0 ? "0" : `${valor / 1000}K`}
          </text>
        </g>
      ))}

      <path d={area} fill="url(#relleno-ventas)" />
      <path d={linea} fill="none" stroke="#3556d8" strokeWidth="2.5" strokeLinejoin="round" />

      {datos.map((d, i) => (
        <g key={d.mes}>
          <circle cx={x(i)} cy={y(d.monto)} r="3.5" fill="#fff" stroke="#3556d8" strokeWidth="2" />
          <text x={x(i)} y={ALTO - 8} textAnchor="middle">{d.mes}</text>
        </g>
      ))}
    </svg>
  );
}