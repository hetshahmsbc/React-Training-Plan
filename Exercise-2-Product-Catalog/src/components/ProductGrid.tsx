import type { Product } from "../types/product";
import { ProductCard } from "./ProductCard";

interface ProductGridProps {
  products: Product[];
}

export function ProductGrid({ products }: ProductGridProps) {
  if (products.length === 0) {
    return <p className="empty">No products found.</p>;
  }

  return (
    <div className="grid">
      {products.map((product) => (
        // key = a stable unique id; React needs it to track list items.
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
