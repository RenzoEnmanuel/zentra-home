import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import "./CampoFormulario.css";

export default function CampoFormulario({
  name,
  etiqueta,
  error,
  ayuda,
  type = "text",
  ...resto
}) {
  const [visible, setVisible] = useState(false);
  const esPassword = type === "password";
  const id = `campo-${name}`;
  const describedBy = [error && `${id}-error`, ayuda && `${id}-ayuda`].filter(Boolean).join(" ");

  return (
    <div className={`campo ${error ? "campo--error" : ""}`}>
      <label htmlFor={id}>{etiqueta}</label>

      <div className="campo__control">
        <input
          id={id}
          name={name}
          type={esPassword && visible ? "text" : type}
          aria-invalid={error ? "true" : undefined}
          aria-describedby={describedBy || undefined}
          {...resto}
        />
        {esPassword && (
          <button
            type="button"
            className="campo__ojo"
            onClick={() => setVisible(!visible)}
            aria-label={visible ? "Ocultar contraseña" : "Mostrar contraseña"}
            aria-pressed={visible}
          >
            {visible ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        )}
      </div>

      {error ? (
        <p id={`${id}-error`} className="campo__error" role="alert">{error}</p>
      ) : (
        ayuda && <p id={`${id}-ayuda`} className="campo__ayuda">{ayuda}</p>
      )}
    </div>
  );
}