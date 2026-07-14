import { useState } from "react";
import type { FormEvent } from "react";
import { Link } from "react-router-dom";

// Footer link columns. `to` is an internal route; `#` is a placeholder.
const LINK_COLUMNS = [
  {
    heading: "Shop",
    links: [
      { label: "All products", to: "/products" },
      { label: "Deals", to: "/products" },
      { label: "New arrivals", to: "/products" },
    ],
  },
  {
    heading: "Company",
    links: [
      { label: "About us", to: "/about" },
      { label: "Careers", to: "/careers" },
      { label: "Contact", to: "/contact" },
    ],
  },
  {
    heading: "Support",
    links: [
      { label: "Help center", to: "/contact" },
      { label: "Shipping", to: "/contact" },
      { label: "Returns", to: "/contact" },
    ],
  },
];

export function Footer() {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  function handleSubscribe(e: FormEvent) {
    e.preventDefault();
    setSubscribed(true);
    setEmail("");
  }

  // The current year, so the copyright never goes stale.
  const year = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="footer__inner">
        {/* Brand + newsletter */}
        <div className="footer__brand">
          <p className="footer__logo">🛒 ShopVerse</p>
          <p className="footer__tagline">
            Everything you love, all in one place.
          </p>

          <form className="footer__newsletter" onSubmit={handleSubscribe}>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              aria-label="Email address"
              required
            />
            <button type="submit" className="btn">
              Subscribe
            </button>
          </form>
          {subscribed && (
            <p className="footer__subscribed" role="status">
              🎉 You're subscribed!
            </p>
          )}
        </div>

        {/* Link columns */}
        <div className="footer__links">
          {LINK_COLUMNS.map((column) => (
            <div key={column.heading} className="footer__col">
              <h4>{column.heading}</h4>
              <ul>
                {column.links.map((link) => (
                  <li key={link.label}>
                    <Link to={link.to}>{link.label}</Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      <div className="footer__bottom">
        <p>© {year} ShopVerse. All rights reserved.</p>
        <div className="footer__social">
          <a href="#" aria-label="Twitter">𝕏</a>
          <a href="#" aria-label="Instagram">📷</a>
          <a href="#" aria-label="Facebook">📘</a>
        </div>
      </div>
    </footer>
  );
}
