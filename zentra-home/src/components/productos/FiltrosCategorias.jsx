import "./FiltrosCategorias.css";

export default function FiltrosCategorias({ categorias, activa, onCambiar }) {
  return (
    <div className="chips" role="group" aria-label="Filtrar por categoría">
      {["Todos", ...categorias].map((nombre) => (
        <button
          key={nombre}
          className={activa === nombre ? "chip chip--activo" : "chip"}
          aria-pressed={activa === nombre}
          onClick={() => onCambiar(nombre)}
        >
          {nombre}
        </button>
      ))}
    </div>
  );
}