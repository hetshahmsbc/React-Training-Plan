// App.tsx — reads state from context, lays out the page, lazy-loads the modal.
// Fill this in from the guide in chat.

import { lazy, Suspense } from "react";
import { useProducts } from "./context/useProducts";
import SearchBar from "./components/SearchBar";
import FilterSortBar from "./components/FilterSortBar";
import ProductList from "./components/ProductList";
import Pagination from "./components/Pagination";
import "./App.css";

// LAZY LOADING / CODE SPLITTING:
// The modal's code is put in its own bundle chunk and only downloaded the
// first time the user opens a product.
const ProductModal = lazy(() => import("./components/ProductModal"));

const PAGE_SIZE = 12; // used only for the loading skeleton count

export default function App() {
  const {
    products,
    total,
    totalPages,
    page,
    search,
    category,
    categoryName,
    sort,
    categories,
    loading,
    error,
    selected,
    setSearch,
    setCategory,
    setSort,
    setPage,
    selectProduct,
  } = useProducts();

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
          <SearchBar value={search} onChange={setSearch} />
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
            onCategoryChange={setCategory}
            sort={sort}
            onSortChange={setSort}
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
            <ProductList products={products} onSelect={selectProduct} />
            <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
          </>
        )}
      </main>

      <footer className="footer">
        <p>Built with React + TypeScript · Data from DummyJSON</p>
      </footer>

      {/* The modal only mounts when a product is selected. Suspense shows a
          spinner while the lazy chunk downloads for the first time. */}
      {selected && (
        <Suspense
          fallback={
            <div className="suspense-loader">
              <div className="spinner" />
            </div>
          }
        >
          <ProductModal product={selected} onClose={() => selectProduct(null)} />
        </Suspense>
      )}
    </div>
  );
}
