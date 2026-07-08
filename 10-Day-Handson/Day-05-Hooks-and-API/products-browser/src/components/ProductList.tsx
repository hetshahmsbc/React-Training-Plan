// ProductList.tsx — the grid of products.
// TODO: accept a { products } prop, map over it, and render a ProductCard for each.

import type { Product } from "../types";
import ProductCard from "./ProductCard";

interface productListProps {
  products: Product[];
}

export default function ProductList({ products }: productListProps) {
  if (products.length === 0) {
    return (
      <div className="empty-state">
        <div className="empty-icon">🔍</div>
        <h3>No products found</h3>
        <p>Try searching with a different keyword.</p>
      </div>
    );
  }

  return (
    <div className="grid">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
