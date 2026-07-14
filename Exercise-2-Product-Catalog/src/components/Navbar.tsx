import { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { useCart } from "../hooks/useCart";

interface NavbarProps {
  onCartClick: () => void;
}

// The site navigation. `end` makes "Home" active only on the exact "/" path.
const NAV_LINKS = [
  { to: "/", label: "Home", end: true },
  { to: "/products", label: "Shop", end: false },
  { to: "/about", label: "About", end: false },
  { to: "/careers", label: "Careers", end: false },
  { to: "/contact", label: "Contact", end: false },
];

export function Navbar({ onCartClick }: NavbarProps) {
  const { totalItems } = useCart();

  // Controls the mobile dropdown menu (ignored on desktop, where the nav
  // is always visible via CSS).
  const [menuOpen, setMenuOpen] = useState(false);
  const closeMenu = () => setMenuOpen(false);

  return (
    <header className="navbar">
      <div className="navbar__inner">
        <Link to="/" className="navbar__brand" onClick={closeMenu}>
          🛒 ShopVerse
        </Link>

        {/* NavLink automatically knows which route is active.
            Tapping a link closes the mobile menu. */}
        <nav className={`navbar__nav ${menuOpen ? "navbar__nav--open" : ""}`}>
          {NAV_LINKS.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.end}
              onClick={closeMenu}
              className={({ isActive }) =>
                `navbar__link ${isActive ? "navbar__link--active" : ""}`
              }
            >
              {link.label}
            </NavLink>
          ))}
        </nav>

        <div className="navbar__actions">
          <button className="navbar__cart" onClick={onCartClick}>
            Cart
            {totalItems > 0 && (
              <span className="navbar__badge">{totalItems}</span>
            )}
          </button>

          {/* Hamburger — shown only on small screens (see pages.css) */}
          <button
            className="navbar__toggle"
            onClick={() => setMenuOpen((open) => !open)}
            aria-label="Toggle navigation menu"
            aria-expanded={menuOpen}
          >
            {menuOpen ? "✕" : "☰"}
          </button>
        </div>
      </div>
    </header>
  );
}
