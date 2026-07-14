import { Link } from "react-router-dom";

// Headline numbers for the stats strip.
const STATS = [
  { value: "50K+", label: "Happy customers" },
  { value: "10K+", label: "Products" },
  { value: "120+", label: "Countries shipped" },
  { value: "4.8/5", label: "Average rating" },
];

// The company's guiding principles.
const VALUES = [
  {
    icon: "🎯",
    title: "Customer first",
    text: "Every decision starts with the question: is this better for our shoppers?",
  },
  {
    icon: "🌱",
    title: "Sustainable",
    text: "We use recyclable packaging and partner with responsible suppliers.",
  },
  {
    icon: "🤝",
    title: "Fair & honest",
    text: "Transparent pricing, no hidden fees, and reviews you can trust.",
  },
];

export function AboutPage() {
  return (
    <div className="page">
      <section className="page__hero">
        <h1>About ShopVerse</h1>
        <p>
          We're on a mission to make quality products accessible to everyone,
          everywhere — with a shopping experience that's simple, fast, and fair.
        </p>
      </section>

      <section className="prose">
        <h2>Our story</h2>
        <p>
          ShopVerse started in a small garage in 2018 with a single idea: online
          shopping should feel effortless. What began as a weekend project quickly
          grew into a marketplace trusted by shoppers in over 120 countries.
        </p>
        <p>
          Today we bring together thousands of products across electronics,
          fashion, and lifestyle — all carefully curated and backed by our
          customer-first guarantee. But no matter how much we grow, our promise
          stays the same: put people before profit, and quality before hype.
        </p>
      </section>

      <section className="stats">
        {STATS.map((stat) => (
          <div key={stat.label} className="stat">
            <span className="stat__value">{stat.value}</span>
            <span className="stat__label">{stat.label}</span>
          </div>
        ))}
      </section>

      <section className="section">
        <div className="section__head">
          <h2>What we stand for</h2>
        </div>
        <div className="values">
          {VALUES.map((value) => (
            <div key={value.title} className="value-card">
              <span className="value-card__icon">{value.icon}</span>
              <h3>{value.title}</h3>
              <p>{value.text}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="cta">
        <h2>Want to be part of the journey?</h2>
        <p>We're always looking for passionate people to join our team.</p>
        <Link to="/careers" className="btn btn--lg">
          See open roles
        </Link>
      </section>
    </div>
  );
}
