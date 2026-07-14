import { useState } from "react";
import { Routes, Route } from "react-router-dom";
import { HomePage } from "./pages/HomePage";
import { CatalogPage } from "./pages/CatalogPage";
import { ProductDetailsPage } from "./pages/ProductDetailsPage";
import { AboutPage } from "./pages/AboutPage";
import { ContactPage } from "./pages/ContactPage";
import { CareersPage } from "./pages/CareersPage";
import { CheckoutPage } from "./pages/CheckoutPage";
import { NotFoundPage } from "./pages/NotFoundPage";
import { Navbar } from "./components/Navbar";
import { Footer } from "./components/Footer";
import { CartDrawer } from "./components/CartDrawer";
import "./styles/catalog.css";
import "./styles/cart.css";
import "./styles/pages.css";

function App() {
  // Whether the cart drawer is currently open.
  const [isCartOpen, setCartOpen] = useState(false);

  return (
    // Flex column keeps the footer pinned to the bottom on short pages.
    <div className="app">
      <Navbar onCartClick={() => setCartOpen(true)} />

      <div className="app__main">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/products" element={<CatalogPage />} />
          <Route path="/product/:id" element={<ProductDetailsPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/careers" element={<CareersPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/checkout" element={<CheckoutPage />} />
          {/* "*" catches any URL that didn't match above */}
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </div>

      <Footer />

      <CartDrawer isOpen={isCartOpen} onClose={() => setCartOpen(false)} />
    </div>
  );
}

export default App;
