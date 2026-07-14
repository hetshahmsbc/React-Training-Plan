import { useParams, Link } from "react-router-dom";
import { getProductById } from "../api/products";
import { useFetch } from "../hooks/useFetch";
import { useCart } from "../hooks/useCart";
import { Rating } from "../components/Rating";
import { Spinner } from "../components/Spinner";
import { ErrorMessage } from "../components/ErrorMessage";

export function ProductDetailsPage() {
  const { id } = useParams();
  const productId = Number(id);
  const { addToCart } = useCart();

  const { data: product, loading, error } = useFetch(() => getProductById(productId), [productId]);

  if (loading) return <Spinner />;
  if (error) return <ErrorMessage message={error} />;
  if (!product) return <ErrorMessage message="Product not found." />;

  return (
    <main className="details">
      <Link to="/products" className="details__back">
        ← Back to products
      </Link>

      <div className="details__content">
        <div className="details__image">
          <img src={product.image} alt={product.title} />
        </div>

        <div className="details__info">
          <span className="card__category">{product.category}</span>
          <h1>{product.title}</h1>
          <Rating rate={product.rating.rate} count={product.rating.count} />
          <p className="details__price">${product.price.toFixed(2)}</p>
          <p className="details__desc">{product.description}</p>
          <button className="btn" onClick={() => addToCart(product)}>
            Add to cart
          </button>
        </div>
      </div>
    </main>
  );
}
