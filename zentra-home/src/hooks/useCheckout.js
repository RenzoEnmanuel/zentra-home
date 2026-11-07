import { useContext } from "react";
import { CheckoutContext } from "../context/CheckoutContext";

export default function useCheckout() {
  const contexto = useContext(CheckoutContext);
  if (!contexto) {
    throw new Error("useCheckout debe usarse dentro de <CheckoutProvider>");
  }
  return contexto;
}