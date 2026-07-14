import { useContext } from "react";
import { CartContext } from "../context/CartContext";

// Reusable access point to the cart context
export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart musr be used inside a <CartProvide>");
  }
  return context;
}
