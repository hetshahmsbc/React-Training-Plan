// useProducts.ts — a small custom hook to read the ProductsContext safely.
// Fill this in from the guide in chat.

import { useContext } from "react";
import { ProductsContext } from "./ProductsContext";

export function useProducts() {
  const context = useContext(ProductsContext);
  if (!context) {
    throw new Error("useProducts must be used inside a <ProductsProvider>");
  }
  return context;
}
