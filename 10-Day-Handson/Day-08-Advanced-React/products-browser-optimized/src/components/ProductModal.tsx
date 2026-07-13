// ProductModal.tsx — product details popup. LAZY LOADED / CODE SPLIT (Day 8).
// Fill this in from the guide in chat.

import type { Product } from "../types";

interface ProductModalProps {
  product: Product;
  onClose: () => void;
}

export default function ProductModal({ product, onClose }: ProductModalProps) {
  return (
    <div className="modal-overlay" onClick={onClose}>
      {/* stopPropagation: clicking INSIDE the modal should not close it */}
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose} aria-label="Close">
          ×
        </button>
        <div className="modal-media">
          <img src={product.thumbnail} alt={product.title} className="modal-img" />
        </div>
        <div className="modal-body">
          <span className="modal-category">{product.category}</span>
          <h2 className="modal-title">{product.title}</h2>
          <p className="modal-desc">{product.description}</p>
          <div className="modal-footer">
            <span className="modal-price">${product.price}</span>
            <span className="modal-rating">★ {product.rating}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
