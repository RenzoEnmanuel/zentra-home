import { Routes, Route } from "react-router-dom";
import MainLayout from "./layouts/MainLayout";
import AuthLayout from "./layouts/AuthLayout";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Registro from "./pages/Registro";
import CheckoutLayout from "./layouts/CheckoutLayout";
import CheckoutProvider from "./context/CheckoutProvider";
import Entrega from "./pages/checkout/Entrega";
import Pago from "./pages/checkout/Pago";
import Finalizado from "./pages/checkout/Finalizado";
import Rastreo from "./pages/Rastreo";
import RutaAdmin from "./components/admin/RutaAdmin";
import AdminLayout from "./layouts/AdminLayout";
import AdminResumen from "./pages/admin/AdminResumen";
import AdminPedidos from "./pages/admin/AdminPedidos";
import AdminProductos from "./pages/admin/AdminProductos";

export default function App() {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/rastreo/:codigo?" element={<Rastreo />} />
      </Route>

      {/* Pantallas de cuenta: sin buscador ni carrito */}
      <Route element={<AuthLayout />}>
        <Route path="/login" element={<Login />} />
        <Route path="/registro" element={<Registro />} />
      </Route>

      {/* Checkout: el Provider envuelve al layout para que los 3 pasos compartan datos */}
      <Route
        path="/checkout"
        element={
          <CheckoutProvider>
            <CheckoutLayout />
          </CheckoutProvider>
        }
      >
        <Route path="entrega" element={<Entrega />} />
        <Route path="pago" element={<Pago />} />
        <Route path="finalizado" element={<Finalizado />} />
      </Route>

      {/* Panel administrativo: solo para el usuario admin.
          Va aparte, al mismo nivel que el checkout, NO dentro de él */}
      <Route path="/admin" element={<RutaAdmin />}>
        <Route element={<AdminLayout />}>
          <Route index element={<AdminResumen />} />
          <Route path="pedidos" element={<AdminPedidos />} />
          <Route path="productos" element={<AdminProductos />} />
        </Route>
      </Route>
    </Routes>
  );
}