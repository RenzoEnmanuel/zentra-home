import { Outlet } from "react-router-dom";
import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";
import CarritoPanel from "../components/carrito/CarritoPanel";

export default function MainLayout() {
  return (
    <>
      <Navbar />
      <main>
        <Outlet />
      </main>
      <Footer />
      <CarritoPanel />
    </>
  );
}