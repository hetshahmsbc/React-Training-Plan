import { useState } from "react";
import type { ChangeEvent, FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../hooks/useCart";

// Shipping + payment fields.
interface CheckoutForm {
  fullName: string;
  email: string;
  address: string;
  city: string;
  zip: string;
  card: string;
}

const EMPTY_FORM: CheckoutForm = {
  fullName: "",
  email: "",
  address: "",
  city: "",
  zip: "",
  card: "",
};

export function CheckoutPage() {
  const { items, totalItems, totalPrice, clearCart } = useCart();
  const [form, setForm] = useState<CheckoutForm>(EMPTY_FORM);
  const [placed, setPlaced] = useState(false);
  const navigate = useNavigate();

  function handleChange(e: ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    // A real store would send the order to a server here.
    setPlaced(true);
    clearCart();
  }

  // 1) Order confirmation (shown after placing the order).
  if (placed) {
    return (
      <div className="page checkout-msg">
        <div className="checkout-msg__card">
          <span className="checkout-msg__icon">✅</span>
          <h1>Order placed!</h1>
          <p>Thank you for your purchase. A confirmation email is on its way.</p>
          <Link to="/products" className="btn btn--lg">
            Continue shopping
          </Link>
        </div>
      </div>
    );
  }

  // 2) Guard: nothing to check out.
  if (items.length === 0) {
    return (
      <div className="page checkout-msg">
        <div className="checkout-msg__card">
          <span className="checkout-msg__icon">🛒</span>
          <h1>Your cart is empty</h1>
          <p>Add some products before checking out.</p>
          <Link to="/products" className="btn btn--lg">
            Browse products
          </Link>
        </div>
      </div>
    );
  }

  // 3) The checkout form + order summary.
  return (
    <div className="page">
      <section className="page__hero">
        <h1>Checkout</h1>
        <p>Review your order and enter your details to place it.</p>
      </section>

      <div className="checkout">
        {/* ---------- Form ---------- */}
        <form className="checkout__form" onSubmit={handleSubmit}>
          <h2>Shipping details</h2>

          <label className="field">
            <span>Full name</span>
            <input
              name="fullName"
              value={form.fullName}
              onChange={handleChange}
              placeholder="Jane Doe"
              required
            />
          </label>

          <label className="field">
            <span>Email</span>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="you@example.com"
              required
            />
          </label>

          <label className="field">
            <span>Address</span>
            <input
              name="address"
              value={form.address}
              onChange={handleChange}
              placeholder="123 Main St"
              required
            />
          </label>

          <div className="checkout__row">
            <label className="field">
              <span>City</span>
              <input
                name="city"
                value={form.city}
                onChange={handleChange}
                placeholder="San Francisco"
                required
              />
            </label>
            <label className="field">
              <span>ZIP code</span>
              <input
                name="zip"
                value={form.zip}
                onChange={handleChange}
                placeholder="94105"
                required
              />
            </label>
          </div>

          <h2>Payment</h2>
          <label className="field">
            <span>Card number</span>
            <input
              name="card"
              value={form.card}
              onChange={handleChange}
              placeholder="4242 4242 4242 4242"
              inputMode="numeric"
              required
            />
          </label>

          <button type="submit" className="btn btn--lg">
            Place order · ${totalPrice.toFixed(2)}
          </button>
          <button
            type="button"
            className="btn btn--ghost"
            onClick={() => navigate("/products")}
          >
            Continue shopping
          </button>
        </form>

        {/* ---------- Order summary ---------- */}
        <aside className="checkout__summary">
          <h2>Order summary</h2>

          <ul className="checkout__items">
            {items.map((item) => (
              <li key={item.id} className="checkout__item">
                <img src={item.image} alt={item.title} />
                <div className="checkout__item-info">
                  <p className="checkout__item-title">{item.title}</p>
                  <p className="checkout__item-qty">Qty: {item.quantity}</p>
                </div>
                <span className="checkout__item-price">
                  ${(item.price * item.quantity).toFixed(2)}
                </span>
              </li>
            ))}
          </ul>

          <div className="checkout__totals">
            <div>
              <span>Items</span>
              <span>{totalItems}</span>
            </div>
            <div>
              <span>Shipping</span>
              <span>Free</span>
            </div>
            <div className="checkout__grand">
              <span>Total</span>
              <strong>${totalPrice.toFixed(2)}</strong>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
