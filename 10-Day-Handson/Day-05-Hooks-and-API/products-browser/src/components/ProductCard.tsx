// ProductCard.tsx — shows ONE product (image, title, price, rating).
// TODO: accept a { product } prop and render its details.

import type { Product } from "../types";

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  return (
    <article className="card">
      <div className="card-media">
        <span className="card-badge">{product.category}</span>
        <img src={product.thumbnail} alt={product.title} className="card-img" />
      </div>
      <div className="card-body">
        <h3 className="card-title">{product.title}</h3>
        <p className="card-desc">{product.description}</p>
        <div className="card-footer">
          <span className="card-price">${product.price}</span>
          <span className="card-rating">
            <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path d="M12 17.3l-5.4 3.3 1.4-6.2-4.7-4.1 6.3-.5L12 4l2.4 5.8 6.3.5-4.7 4.1 1.4 6.2z" />
            </svg>
            {product.rating}
          </span>
        </div>
      </div>
    </article>
  );
}
