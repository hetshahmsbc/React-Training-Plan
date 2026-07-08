import { useEffect, useState } from "react";
import type { Product, Category } from "./types";
import { fetchProducts, fetchCategories } from "./api";
import SearchBar from "./components/SearchBar";
import ProductList from "./components/ProductList";
import Pagination from "./components/Pagination";
import FilterSortBar from "./components/FilterSortBar";
import "./App.css";

const PAGE_SIZE = 12; // products shown per page

export default function App() {
  const [products, setProducts] = useState<Product[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [sort, setSort] = useState("");
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Load the category list once, when the app first mounts.
  useEffect(() => {
    fetchCategories()
      .then(setCategories)
      .catch(() => setCategories([]));
  }, []);

  // This runs every time page, search, category, or sort changes.
  useEffect(() => {
    let ignore = false; // guards against out-of-order responses

    //wait 400ms after the user stops typinf before calling the API (debounce).
    const timer = setTimeout(async () => {
      const skip = (page - 1) * PAGE_SIZE;
      // "price-asc" -> sortBy "price", order "asc".  "" -> no sorting.
      const [sortBy, order] = sort ? sort.split("-") : ["", ""];
      setLoading(true);
      setError("");

      try {
        const data = await fetchProducts({
          limit: PAGE_SIZE,
          skip,
          search,
          category,
          sortBy,
          order,
        });
        if (!ignore) {
          setProducts(data.products);
          setTotal(data.total);
        }
      } catch (err) {
        if (!ignore) {
          setError(err instanceof Error ? err.message : "something went wrong");
        }
      } finally {
        if (!ignore) setLoading(false);
      }
    }, 400);

    // Cleanup : cancel this request if page/search changes again quickly.
    return () => {
      ignore = true;
      clearTimeout(timer);
    };
  }, [page, search, category, sort]);

  const totalPages = Math.ceil(total / PAGE_SIZE);
  const categoryName = categories.find((c) => c.slug === category)?.name;

  function handleSearchChange(value: string) {
    setSearch(value);
    setCategory(""); // searching looks across all categories
    setPage(1); // always jump back to page 1 on a new search
  }

  function handleCategoryChange(value: string) {
    setCategory(value);
    setSearch(""); // filtering by category clears the search box
    setPage(1);
  }

  function handleSortChange(value: string) {
    setSort(value);
    setPage(1);
  }

  return (
    <div className="app">
      <header className="navbar">
        <div className="navbar-inner">
          <div className="brand">
            <span className="brand-logo">🛍️</span>
            <span className="brand-name">ShopHub</span>
          </div>
          <span className="brand-badge">Product Portal</span>
        </div>
      </header>

      <section className="hero">
        <div className="hero-inner">
          <h1 className="hero-title">Find your next favorite product</h1>
          <p className="hero-subtitle">Live data from the DummyJSON API</p>
          <SearchBar value={search} onChange={handleSearchChange} />
        </div>
      </section>

      <main className="container">
        <div className="toolbar">
          <div className="toolbar-info">
            <h2 className="page-title">Products</h2>
            {!loading && !error && (
              <span className="result-count">
                {total} {total === 1 ? "item" : "items"}
                {search && ` matching “${search}”`}
                {category && ` in ${categoryName ?? category}`}
              </span>
            )}
          </div>

          <FilterSortBar
            categories={categories}
            category={category}
            onCategoryChange={handleCategoryChange}
            sort={sort}
            onSortChange={handleSortChange}
          />
        </div>

        {loading && (
          <div className="grid">
            {Array.from({ length: PAGE_SIZE }).map((_, i) => (
              <div key={i} className="card skeleton-card">
                <div className="skeleton skeleton-img" />
                <div className="skeleton-body">
                  <div className="skeleton skeleton-line" />
                  <div className="skeleton skeleton-line short" />
                  <div className="skeleton skeleton-line price" />
                </div>
              </div>
            ))}
          </div>
        )}

        {error && (
          <div className="error-box">
            <span className="error-icon">⚠️</span>
            <div>
              <h3 className="error-title">Something went wrong</h3>
              <p className="error-msg">{error}</p>
            </div>
          </div>
        )}

        {!loading && !error && (
          <>
            <ProductList products={products} />
            <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
          </>
        )}
      </main>

      <footer className="footer">
        <p>Built with React + TypeScript · Data from DummyJSON</p>
      </footer>
    </div>
  );
}
