import { createContext, useCallback, useMemo, useState, type ReactNode } from "react";
import type { CartItem, Product } from "../types/product";

// Everything the app is allowed to use from the cart.
export interface CartContextValue {
  items: CartItem[];
  totalItems: number;
  totalPrice: number;
  addToCart: (product: Product) => void;
  removeFromCart: (id: number) => void;
  updateQuantity: (id: number, quantity: number) => void;
  clearCart: () => void;
}

// `undefined` defaults lets useCart detect "used outside the provider".
export const CartContext = createContext<CartContextValue | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);

  // useCallback keeps each function's identity stable across renders,
  // so components using them don't re-render for no reason. (performance)
  const addToCart = useCallback((product: Product) => {
    setItems((prev) => {
      const existing = prev.find((item) => item.id === product.id);
      if (existing) {
        // Already in cart -> increase its quantity by 1
        return prev.map((item) =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item,
        );
      }
      // Not in cart yet -> add it with quantity 1.
      return [...prev, { ...product, quantity: 1 }];
    });
  }, []);

  const removeFromCart = useCallback((id: number) => {
    setItems((prev) => prev.filter((item) => item.id != id));
  }, []);

  const updateQuantity = useCallback((id: number, quantity: number) => {
    setItems((prev) => {
      if (quantity <= 0) return prev.filter((item) => item.id !== id);
      return prev.map((item) => (item.id === id ? { ...item, quantity } : item));
    });
  }, []);
  const clearCart = useCallback(() => setItems([]), []);

  // Derived numbers — recomputed only when `items` changes. (performance)
  const totalItems = useMemo(() => items.reduce((sum, item) => sum + item.quantity, 0), [items]);
  const totalPrice = useMemo(
    () => items.reduce((sum, item) => sum + item.price * item.quantity, 0),
    [items],
  );

  // Bundle everything into one value; useMemo so consumers only update
  // When something inside actually changed.
  const value = useMemo<CartContextValue>(
    () => ({
      items,
      totalItems,
      totalPrice,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
    }),
    [items, totalItems, totalPrice, addToCart, removeFromCart, updateQuantity, clearCart],
  );
  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}
