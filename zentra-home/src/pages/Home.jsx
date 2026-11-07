import Hero from "../components/home/Hero";
import Estadisticas from "../components/home/Estadisticas";
import Catalogo from "../components/productos/Catalogo";
import RastreoPedido from "../components/rastreo/RastreoPedido";

export default function Home() {
  return (
    <>
      <Hero />
      <Estadisticas />
      <Catalogo />
      <RastreoPedido />
    </>
  );
}