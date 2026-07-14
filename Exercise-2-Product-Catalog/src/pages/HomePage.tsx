import { Link } from "react-router-dom";
import { getAllProducts, getCategories } from "../api/products";
import { useFetch } from "../hooks/useFetch";
import { ProductGrid } from "../components/ProductGrid";
import { Spinner } from "../components/Spinner";
import { ErrorMessage } from "../components/ErrorMessage";

// A small visual flourish: an emoji for each known category.
// Any unknown category falls back to a generic shopping bag.
const CATEGORY_ICONS: Record<string, string> = {
  electronics: "💻",
  jewelery: "💍",
  "men's clothing": "👔",
  "women's clothing": "👗",
};

// "Why shop with us" badges shown under the hero.
const PERKS = [
  { icon: "🚚", title: "Free shipping", text: "On all orders over $50" },
  { icon: "↩️", title: "Easy returns", text: "30-day money-back guarantee" },
  { icon: "🔒", title: "Secure payment", text: "Encrypted, protected checkout" },
  { icon: "⭐", title: "Top rated", text: "Loved by 50,000+ customers" },
];

export function HomePage() {
  // Reuse the same fetch hook we built earlier — no new data logic needed.
  const { data: products, loading, error } = useFetch(() => getAllProducts(), []);
  const { data: categories } = useFetch(() => getCategories(), []);

  // Show only the first 8 products as a "featured" preview.
  const featured = (products ?? []).slice(0, 8);

  return (
    <div className="page home">
      {/* ---------- Hero ---------- */}
      <section className="hero">
        <div className="hero__content">
          <p className="hero__eyebrow">New season, new deals</p>
          <h1 className="hero__title">
            Everything you love, <span>all in one place</span>
          </h1>
          <p className="hero__text">
            Discover top products across electronics, fashion, and more —
            handpicked and delivered right to your door.
          </p>
          <div className="hero__actions">
            <Link to="/products" className="btn btn--lg">
              Shop now
            </Link>
            <Link to="/about" className="btn btn--ghost btn--lg">
              Learn more
            </Link>
          </div>
        </div>
      </section>

      {/* ---------- Perks ---------- */}
      <section className="perks">
        {PERKS.map((perk) => (
          <div key={perk.title} className="perk">
            <span className="perk__icon">{perk.icon}</span>
            <div>
              <h3 className="perk__title">{perk.title}</h3>
              <p className="perk__text">{perk.text}</p>
            </div>
          </div>
        ))}
      </section>

      {/* ---------- Shop by category ---------- */}
      <section className="section">
        <div className="section__head">
          <h2>Shop by category</h2>
          <Link to="/products" className="section__link">
            View all →
          </Link>
        </div>
        <div className="category-tiles">
          {(categories ?? []).map((category) => (
            // Each tile links to the shop pre-filtered to that category.
            <Link
              key={category}
              to={`/products?category=${encodeURIComponent(category)}`}
              className="category-tile"
            >
              <span className="category-tile__icon">
                {CATEGORY_ICONS[category] ?? "🛍️"}
              </span>
              <span className="category-tile__name">{category}</span>
            </Link>
          ))}
        </div>
      </section>

      {/* ---------- Featured products ---------- */}
      <section className="section">
        <div className="section__head">
          <h2>Featured products</h2>
          <Link to="/products" className="section__link">
            See more →
          </Link>
        </div>
        {loading && <Spinner />}
        {error && <ErrorMessage message={error} />}
        {!loading && !error && <ProductGrid products={featured} />}
      </section>

      {/* ---------- Call to action ---------- */}
      <section className="cta">
        <h2>Join 50,000+ happy shoppers</h2>
        <p>Sign up for exclusive deals and early access to new arrivals.</p>
        <Link to="/contact" className="btn btn--lg">
          Get in touch
        </Link>
      </section>
    </div>
  );
}
