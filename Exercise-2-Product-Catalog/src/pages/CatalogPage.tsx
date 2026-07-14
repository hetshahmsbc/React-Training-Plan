import { useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { getAllProducts, getCategories } from "../api/products";
import { useFetch } from "../hooks/useFetch";
import { useDebounce } from "../hooks/useDebounce";
import { ProductGrid } from "../components/ProductGrid";
import { SearchBar } from "../components/SearchBar";
import { CategoryFilter } from "../components/CategoryFilter";
import { Spinner } from "../components/Spinner";
import { ErrorMessage } from "../components/ErrorMessage";

export function CatalogPage() {
  // Two independent fetches, both powered by the same reusable hook.
  const { data: products, loading, error } = useFetch(() => getAllProducts(), []);
  const { data: categories } = useFetch(() => getCategories(), []);

  // Keep the selected category in the URL (e.g. /products?category=electronics)
  // so links from the home page work and the filter is shareable/bookmarkable.
  const [searchParams, setSearchParams] = useSearchParams();
  const category = searchParams.get("category") ?? ""; // "" = All

  function handleSelectCategory(next: string) {
    setSearchParams(next ? { category: next } : {});
  }

  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 300);

  // useMemo remembers the filtered list and only recomputes it when
  // products / category / the debounced search actually change —
  // not on every single render. That's the performance optimization.
  const visibleProducts = useMemo(() => {
    const all = products ?? [];
    const term = debouncedSearch.trim().toLowerCase();

    return all.filter((product) => {
      const matchesCategory = category === "" || product.category === category;
      const matchesSearch = term === "" || product.title.toLowerCase().includes(term);
      return matchesCategory && matchesSearch;
    });
  }, [products, category, debouncedSearch]);

  if (loading) return <Spinner />;
  if (error) return <ErrorMessage message={error} />;

  return (
    <main className="catalog">
      <h1 className="catalog__title">Products</h1>

      <div className="catalog__controls">
        <SearchBar value={search} onChange={setSearch} />
        <CategoryFilter categories={categories ?? []} selected={category} onSelect={handleSelectCategory} />
      </div>

      <ProductGrid products={visibleProducts} />
    </main>
  );
}
