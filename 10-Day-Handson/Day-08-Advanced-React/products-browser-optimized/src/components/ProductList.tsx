// ProductList.tsx — the grid of ProductCards. Wrapped in React.memo (Day 8).
// Fill this in from the guide in chat.

// ProductList.tsx — the grid of ProductCards, wrapped in React.memo.

import { memo } from "react";
import type { Product } from "../types";
import ProductCard from "./ProductCard";

interface ProductListProps {
  products: Product[];
  onSelect: (product: Product) => void;
}

function ProductList({ products, onSelect }: ProductListProps) {
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
        <ProductCard key={product.id} product={product} onSelect={onSelect} />
      ))}
    </div>
  );
}

export default memo(ProductList);
