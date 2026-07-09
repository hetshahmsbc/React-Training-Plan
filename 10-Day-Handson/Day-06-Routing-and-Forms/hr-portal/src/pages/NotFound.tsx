// 404 page — route "*".

import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <section className="notfound">
      <div className="notfound__code">404</div>
      <h1>Page not found</h1>
      <p>Sorry, the page you're looking for doesn't exist.</p>
      <Link to="/" className="btn">
        ← Back to dashboard
      </Link>
    </section>
  );
}
