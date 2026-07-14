import { Link } from "react-router-dom";

export function NotFoundPage() {
  return (
    <main className="catalog">
      <h1>404-Page Not Found</h1>
      <p>
        <Link to="/">Go back to the catalog</Link>
      </p>
    </main>
  );
}
