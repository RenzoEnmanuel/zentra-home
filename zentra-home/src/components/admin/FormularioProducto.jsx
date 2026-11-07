import CampoFormulario from "../auth/CampoFormulario";
import useFormulario from "../../hooks/useFormulario";
import useModalAbierto from "../../hooks/useModalAbierto";
import { CATEGORIAS } from "../../data/categorias";

// ---------- Reglas de validación (devuelven "" si está bien) ----------
const validarNombre = (v) =>
  v.trim().length >= 5 ? "" : "Escribe el nombre del producto (mínimo 5 caracteres).";

const validarCategoria = (v) => (v ? "" : "Elige una categoría.");

const validarPrecio = (v) => {
  if (!v.trim()) return "Ingresa el precio regular.";
  if (!(Number(v) > 0)) return "El precio debe ser mayor que 0.";
  return "";
};

// La oferta es opcional: vacío es válido
const validarOferta = (v) => {
  if (!v.trim()) return "";
  return Number(v) > 0 ? "" : "El precio de oferta debe ser mayor que 0.";
};

const validarStock = (v) => {
  if (!v.trim()) return "Ingresa el stock.";
  if (!/^\d+$/.test(v.trim())) return "El stock debe ser un número entero (0 o más).";
  return "";
};

export default function FormularioProducto({ producto, skusUsados, onCerrar, onGuardar }) {
  // `producto` es null cuando se crea uno nuevo
  const inicial = {
    codigo_sku: producto?.codigo_sku ?? "",
    nombre: producto?.nombre ?? "",
    marca: producto?.marca ?? "",
    categoria: producto?.categoria ?? "",
    precio_regular: producto ? String(producto.precio_regular) : "",
    precio_oferta: producto?.precio_oferta ? String(producto.precio_oferta) : "",
    stock: producto ? String(producto.stock) : "",
    imagen_url: producto?.imagen_url ?? "",
  };

  const reglas = {
    codigo_sku: (v) => {
      const sku = v.trim();
      if (!sku) return "Ingresa el código SKU.";
      if (!/^[A-Za-z0-9-]{3,20}$/.test(sku)) return "Usa de 3 a 20 letras, números o guiones (ej. ZH-016).";
      if (skusUsados.includes(sku.toLowerCase())) return "Ya existe un producto con este SKU.";
      return "";
    },
    nombre: validarNombre,
    categoria: validarCategoria,
    precio_regular: validarPrecio,
    precio_oferta: validarOferta,
    stock: validarStock,
  };

  const { propsDe, enviar, enviando, errorGeneral, formRef } = useFormulario(inicial, reglas);
  useModalAbierto(true, onCerrar); // cierra con Escape y bloquea el scroll de fondo

  // Validación que necesita dos campos a la vez: la oferta debe ser menor al precio regular
  const guardar = (v) => {
    const regular = Number(v.precio_regular);
    const oferta = v.precio_oferta.trim() ? Number(v.precio_oferta) : null;

    if (oferta !== null && oferta >= regular) {
      const error = new Error("Revisa los datos ingresados.");
      error.campos = { precio_oferta: "La oferta debe ser menor que el precio regular." };
      throw error;
    }

    onGuardar({
      codigo_sku: v.codigo_sku.trim().toUpperCase(),
      nombre: v.nombre.trim(),
      marca: v.marca.trim(),
      categoria: v.categoria,
      precio_regular: regular,
      precio_oferta: oferta,
      stock: Number(v.stock),
      imagen_url: v.imagen_url.trim(),
    });
  };

  // Si el producto tiene una categoría que no está en la lista, se conserva como opción
  const opciones =
    !inicial.categoria || CATEGORIAS.includes(inicial.categoria)
      ? CATEGORIAS
      : [...CATEGORIAS, inicial.categoria];

  // El <select> no usa CampoFormulario, así que separamos su error a mano
  const { error: errorCategoria, ...propsCategoria } = propsDe("categoria");

  return (
    <div className="modal-fondo" onClick={onCerrar}>
      <form
        className="modal modal--ancho"
        ref={formRef}
        onSubmit={enviar(guardar)}
        noValidate
        role="dialog"
        aria-modal="true"
        aria-labelledby="titulo-producto"
        onClick={(e) => e.stopPropagation()}
      >
        <h3 id="titulo-producto" className="modal__titulo">
          {producto ? "Editar producto" : "Nuevo producto"}
        </h3>

        {errorGeneral && <p className="auth-form__alerta" role="alert">{errorGeneral}</p>}

        <div className="modal__rejilla">
          <CampoFormulario etiqueta="SKU:" placeholder="ZH-016" {...propsDe("codigo_sku")} />
          <CampoFormulario etiqueta="Marca:" placeholder="Opcional" {...propsDe("marca")} />

          <div className="modal__completo">
            <CampoFormulario etiqueta="Nombre:" placeholder="Nombre del producto" {...propsDe("nombre")} />
          </div>

          <div className={`campo ${errorCategoria ? "campo--error" : ""}`}>
            <label htmlFor="campo-categoria">Categoría:</label>
            <select
              id="campo-categoria"
              aria-invalid={errorCategoria ? "true" : undefined}
              {...propsCategoria}
            >
              <option value="">Elige una categoría</option>
              {opciones.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
            {errorCategoria && <p className="campo__error" role="alert">{errorCategoria}</p>}
          </div>

          <CampoFormulario
            etiqueta="Stock:"
            type="number"
            min="0"
            step="1"
            placeholder="0"
            {...propsDe("stock")}
          />
          <CampoFormulario
            etiqueta="Precio regular (S/):"
            type="number"
            min="0"
            step="0.01"
            placeholder="0.00"
            {...propsDe("precio_regular")}
          />
          <CampoFormulario
            etiqueta="Precio oferta (S/):"
            type="number"
            min="0"
            step="0.01"
            placeholder="Opcional"
            {...propsDe("precio_oferta")}
          />

          <div className="modal__completo">
            <CampoFormulario
              etiqueta="Imagen (URL):"
              placeholder="/productos/nombre-imagen.jpg"
              {...propsDe("imagen_url")}
            />
          </div>
        </div>

        <div className="modal__acciones">
          <button type="button" className="boton-pildora boton-pildora--claro" onClick={onCerrar}>
            Cancelar
          </button>
          <button type="submit" className="boton-pildora" disabled={enviando}>
            Guardar
          </button>
        </div>
      </form>
    </div>
  );
}