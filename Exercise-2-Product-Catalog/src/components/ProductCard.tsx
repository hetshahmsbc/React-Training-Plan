import { memo } from "react";
import type { MouseEvent } from "react";
import { Link } from "react-router-dom";
import type { Product } from "../types/product";
import { Rating } from "./Rating";
import { useCart } from "../hooks/useCart";

interface ProductCardProps {
  product: Product;
}

// memo = skip re-rendering this card if `product` hasn't changed.
export const ProductCard = memo(function ProductCard({ product }: ProductCardProps) {
  const { addToCart } = useCart();

  function handleAdd(e: MouseEvent) {
    // The whole card is a link, so stop the click from navigating.
    e.preventDefault();
    e.stopPropagation();
    addToCart(product);
  }

  return (
    <Link to={`/product/${product.id}`} className="card">
      <div className="card__image">
        <img src={product.image} alt={product.title} loading="lazy" />
      </div>
      <div className="card__body">
        <span className="card__category">{product.category}</span>
        <h3 className="card__title">{product.title}</h3>
        <Rating rate={product.rating.rate} count={product.rating.count} />
        <p className="card__price">${product.price.toFixed(2)}</p>
        <button className="btn card__add" onClick={handleAdd}>
          Add to cart
        </button>
      </div>
    </Link>
  );
});
