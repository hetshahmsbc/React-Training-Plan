import { useNavigate } from "react-router-dom";
import { useCart } from "../hooks/useCart";

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CartDrawer({ isOpen, onClose }: CartDrawerProps) {
  const { items, totalItems, totalPrice, updateQuantity, removeFromCart, clearCart } = useCart();
  const navigate = useNavigate();

  // Close the drawer, then go to the checkout page.
  function handleCheckout() {
    onClose();
    navigate("/checkout");
  }

  return (
    <>
      {/* Dark backdrop behind the drawer; click it to close */}
      <div
        className={`drawer__overlay ${isOpen ? "drawer__overlay--open" : ""}`}
        onClick={onClose}
      />

      <aside className={`drawer ${isOpen ? "drawer--open" : ""}`}>
        <div className="drawer__header">
          <h2>Your Cart ({totalItems})</h2>
          <button className="drawer__close" onClick={onClose} aria-label="Close cart">
            ×
          </button>
        </div>

        {items.length === 0 ? (
          <p className="empty">Your cart is empty.</p>
        ) : (
          <>
            <ul className="drawer__list">
              {items.map((item) => (
                <li key={item.id} className="cart-item">
                  <img className="cart-item__img" src={item.image} alt={item.title} />

                  <div className="cart-item__info">
                    <p className="cart-item__title">{item.title}</p>
                    <p className="cart-item__price">${item.price.toFixed(2)}</p>

                    <div className="cart-item__qty">
                      <button onClick={() => updateQuantity(item.id, item.quantity - 1)}>−</button>
                      <span>{item.quantity}</span>
                      <button onClick={() => updateQuantity(item.id, item.quantity + 1)}>+</button>
                    </div>
                  </div>

                  <button className="cart-item__remove" onClick={() => removeFromCart(item.id)}>
                    Remove
                  </button>
                </li>
              ))}
            </ul>

            <div className="drawer__footer">
              <div className="drawer__total">
                <span>Total</span>
                <strong>${totalPrice.toFixed(2)}</strong>
              </div>
              <button className="btn" onClick={handleCheckout}>
                Checkout
              </button>
              <button className="btn btn--ghost" onClick={clearCart}>
                Clear cart
              </button>
            </div>
          </>
        )}
      </aside>
    </>
  );
}
