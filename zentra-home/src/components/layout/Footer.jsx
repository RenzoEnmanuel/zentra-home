import logoFooter from "../../assets/img/footer/logo-footer.png";
import mediosPago from "../../assets/img/footer/medios-pago.png";
import libro from "../../assets/img/footer/libro-reclamaciones.png";
import facebook from "../../assets/img/footer/facebook.png";
import instagram from "../../assets/img/footer/instagram.png";
import youtube from "../../assets/img/footer/youtube.png";
import "./Footer.css";

const columnas = [
  {
    titulo: "COMPRA CON CONFIANZA",
    conLibro: true,
    enlaces: [
      { texto: "Términos y Condiciones" },
      { texto: "Cambios y Devoluciones" },
      { texto: "Seguridad y Privacidad" },
      { texto: "Seguimiento de despacho", href: "#seguimiento" },
      { texto: "Política de privacidad de datos" },
    ],
  },
  {
    titulo: "SOBRE NOSOTROS",
    enlaces: [
      { texto: "¿Quiénes Somos?" },
      { texto: "Comprobante Electrónico" },
      { texto: "Trabaja con nosotros" },
    ],
  },
];

const redes = [
  { nombre: "Facebook", icono: facebook, href: "#" },
  { nombre: "Instagram", icono: instagram, href: "#" },
  { nombre: "YouTube", icono: youtube, href: "#" },
];

export default function Footer() {
  const anio = new Date().getFullYear();

  return (
    <footer className="footer" id="nosotros">
      <div className="footer__marca">
        <img src={logoFooter} alt="Zentra Home" />
      </div>

      <div className="footer__cuerpo">
        {columnas.map((columna) => (
          <nav key={columna.titulo} className="footer__columna" aria-label={columna.titulo}>
            <h3>{columna.titulo}</h3>
            <ul>
              {columna.enlaces.map((enlace) => (
                <li key={enlace.texto}>
                  {enlace.href ? <a href={enlace.href}>{enlace.texto}</a> : <span>{enlace.texto}</span>}
                </li>
              ))}
            </ul>

            {columna.conLibro && (
              <a href="#" className="footer__libro">
                <img src={libro} alt="" />
                <span>Libro de Reclamaciones</span>
              </a>
            )}
          </nav>
        ))}

        <div className="footer__columna">
          <h3>Medios de pago</h3>
          <img className="footer__medios" src={mediosPago} alt="Medios de pago disponibles" />

          <h3 className="footer__subtitulo">Síguenos</h3>
          <div className="footer__redes">
            {redes.map((red) => (
              <a key={red.nombre} href={red.href} aria-label={red.nombre}>
                <img src={red.icono} alt="" />
              </a>
            ))}
          </div>
        </div>
      </div>

      <div className="footer__pie">
        <p>
          Asesoría y electrodomésticos para hogares que funcionan mejor.
          Los pagos en esta tienda son una simulación: no se realizan cargos reales.
        </p>
        <small>© {anio} Zentra Home · Privacidad · Términos</small>
      </div>
    </footer>
  );
}