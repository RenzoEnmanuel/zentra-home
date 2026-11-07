export default function TarjetaDato({ titulo, valor, nota, Icono, alerta = false }) {
  return (
    <article className={`panel tarjeta-dato ${alerta ? "tarjeta-dato--alerta" : ""}`}>
      <div className="tarjeta-dato__cabecera">
        <span>{titulo}</span>
        <span className="tarjeta-dato__icono"><Icono size={16} aria-hidden="true" /></span>
      </div>
      <strong className="tarjeta-dato__valor">{valor}</strong>
      <span className="tarjeta-dato__nota">{nota}</span>
    </article>
  );
}