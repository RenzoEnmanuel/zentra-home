import { useEffect, useState } from "react";
import { Info, ChevronLeft, ChevronRight } from "lucide-react";
import heroImg from "../../assets/img/hero/hero.jpg";
import hero1 from "../../assets/img/hero/hero-1.jpg";
import hero2 from "../../assets/img/hero/hero-2.jpg";
import hero3 from "../../assets/img/hero/hero-3.jpg";
import "./Hero.css";

const slides = [
  { src: heroImg, alt: "Mujer usando una lavadora en una cocina moderna" },
  { src: hero1, alt: "Hombre usando una licuadora en la cocina" },
  { src: hero2, alt: "Hombre usando un secador de cabello en un baño" },
  { src: hero3, alt: "Familia usando una aspiradora en el salón" },
  // Para agregar más imágenes: { src: otraImg, alt: "descripción" },
];

const INTERVALO = 5000;
export default function Hero() {
  const [actual, setActual] = useState(0);
  const [pausado, setPausado] = useState(false);
  const total = slides.length;

  const anterior = () => setActual((i) => (i - 1 + total) % total);
  const siguiente = () => setActual((i) => (i + 1) % total);

  // Avance automático
  useEffect(() => {
    const reducirMovimiento = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (total < 2 || pausado || reducirMovimiento) return;

    const id = setInterval(() => setActual((i) => (i + 1) % total), INTERVALO);
    return () => clearInterval(id);
  }, [actual, total, pausado]);

  return (
    <section id="inicio" className="hero">
      <div className="hero__contenido">
        <span className="hero__etiqueta">TECNOLOGÍA PARA VIVIR MEJOR</span>

        <h1 className="hero__titulo">
          Tu hogar más fácil.
          <span>Tu vida mejor.</span>
        </h1>

        <p className="hero__texto">
          Electrodomésticos de calidad, asesoría cercana y opciones pensadas
          para ti. Todo lo que tu hogar necesita, en un solo lugar.
        </p>

        <div className="hero__botones">
          <a href="#productos" className="boton-pildora">Explorar productos</a>
          <a href="#seguimiento" className="boton-pildora boton-pildora--claro">Rastrear mi pedido</a>
        </div>

        <ul className="hero__garantias">
          <li>Garantía oficial <Info size={14} /></li>
          <li>Entrega segura <Info size={14} /></li>
        </ul>
      </div>

      <div className="hero__visual">
        <img className="hero__imagen" src={slides[actual].src} alt={slides[actual].alt} />

        {total > 1 && (
          <>
            <button className="hero__flecha hero__flecha--izq" onClick={anterior} aria-label="Imagen anterior">
              <ChevronLeft size={18} />
            </button>
            <button className="hero__flecha hero__flecha--der" onClick={siguiente} aria-label="Imagen siguiente">
              <ChevronRight size={18} />
            </button>

            <div className="hero__puntos">
              {slides.map((slide, i) => (
                <button
                  key={i}
                  className={i === actual ? "hero__punto hero__punto--activo" : "hero__punto"}
                  onClick={() => setActual(i)}
                  aria-label={`Ir a la imagen ${i + 1}`}
                />
              ))}
            </div>
          </>
        )}
      </div>
    </section>
  );
}