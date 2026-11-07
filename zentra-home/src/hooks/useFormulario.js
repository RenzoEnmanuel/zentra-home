import { useRef, useState } from "react";
import { validarFormulario } from "../utils/validaciones";

// Maneja valores, errores y envío de un formulario.
//  - valoresIniciales: { campo: "" }
//  - reglas: { campo: funcionValidadora }
export default function useFormulario(valoresIniciales, reglas) {
  const [valores, setValores] = useState(valoresIniciales);
  const [errores, setErrores] = useState({});
  const [errorGeneral, setErrorGeneral] = useState("");
  const [enviando, setEnviando] = useState(false);
  const formRef = useRef(null);

  const propsDe = (campo) => ({
    name: campo,
    value: valores[campo],
    error: errores[campo],
    onChange: (e) => {
      const valor = e.target.value;
      setValores((v) => ({ ...v, [campo]: valor }));
      // Si el campo ya mostraba un error, se corrige en vivo mientras escribe
      if (errores[campo]) {
        setErrores((er) => ({ ...er, [campo]: reglas[campo]?.(valor) ?? "" }));
      }
    },
    // Al salir del campo se valida
    onBlur: () => {
      const mensaje = reglas[campo]?.(valores[campo]) ?? "";
      setErrores((er) => ({ ...er, [campo]: mensaje }));
    },
  });

  // Devuelve el manejador del submit.
  // `accion` recibe los valores y debe lanzar un Error si falla; si sale bien, corre `alExito`.
  const enviar = (accion, alExito) => async (e) => {
    e.preventDefault();
    if (enviando) return;
    setErrorGeneral("");

    const encontrados = validarFormulario(valores, reglas);
    setErrores(encontrados);
    const primero = Object.keys(encontrados)[0];
    if (primero) {
      formRef.current?.querySelector(`[name="${primero}"]`)?.focus();
      return;
    }

    setEnviando(true);
    try {
      const resultado = await accion(valores);
      alExito?.(resultado);
    } catch (err) {
      const campos = err.campos ?? {};
      setErrores(campos);
      const primerCampo = Object.keys(campos)[0];
      if (primerCampo) {
        formRef.current?.querySelector(`[name="${primerCampo}"]`)?.focus();
      } else {
        setErrorGeneral(err.message);
      }
      setEnviando(false);
    }
  };

  return { propsDe, enviar, enviando, errorGeneral, formRef };
}