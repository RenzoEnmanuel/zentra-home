import "./Estadisticas.css";

const datos = [
  { valor: "+1,200", texto: "hogares equipados" },
  { valor: "24 h", texto: "para confirmar tu pedido" },
  { valor: "4.8 / 5", texto: "de satisfacción del cliente" },
];

export default function Estadisticas() {
  return (
    <section id="beneficios" className="estadisticas">
      {datos.map((dato) => (
        <div key={dato.texto} className="estadisticas__item">
          <strong>{dato.valor}</strong>
          <span>{dato.texto}</span>
        </div>
      ))}
    </section>
  );
}