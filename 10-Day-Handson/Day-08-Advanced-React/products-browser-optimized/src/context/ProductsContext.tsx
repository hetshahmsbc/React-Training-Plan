// ProductsContext.tsx — Day 8 CONTEXT API (+ useReducer, useMemo, useCallback).
// Creates the context and the ProductsProvider that holds all the state.
// Fill this in from the guide in chat.

import { createContext, useEffect, useReducer, useCallback, useMemo, type ReactNode } from "react";
import type { Category, Product } from "../types";
import { initialState, productsReducer } from "./productsReducer";
import { fetchCategories, fetchProducts } from "../api";

const PAGE_SIZE = 12; // products per page

// The value of every consumer of this context receives.
export interface ProductsContextValue {
  products: Product[];
  total: number;
  totalPages: number;
  page: number;
  search: string;
  category: string;
  categoryName: string | undefined;
  sort: string;
  categories: Category[];
  loading: boolean;
  error: string;
  selected: Product | null;
  setSearch: (value: string) => void;
  setCategory: (value: string) => void;
  setSort: (value: string) => void;
  setPage: (value: number) => void;
  selectProduct: (product: Product | null) => void;
}

// Create the context (starts as null; the userProducts hook will guard it).
export const ProductsContext = createContext<ProductsContextValue | null>(null);

interface ProviderProps {
  children: ReactNode;
}

export function ProductsProvider({ children }: ProviderProps) {
  const [state, dispatch] = useReducer(productsReducer, initialState);

  // --- Load the category list  once, on first mount ----
  useEffect(() => {
    fetchCategories()
      .then((categories) => dispatch({ type: "categories_loaded", categories }))
      .catch(() => dispatch({ type: "categories_loaded", categories: [] }));
  }, []);

  // --- Load products whenever page / search / category / sort changes ---
  useEffect(() => {
    let ignore = false; // ignore out-of-date responses

    // wait 400ms after the user stops typing before calling the API (debounce).
    const timer = setTimeout(async () => {
      const skip = (state.page - 1) * PAGE_SIZE;
      const [sortBy, order] = state.sort ? state.sort.split("-") : ["", ""];

      dispatch({ type: "fetch_start" });
      try {
        const data = await fetchProducts({
          limit: PAGE_SIZE,
          skip,
          search: state.search,
          category: state.category,
          sortBy,
          order,
        });
        if (!ignore) {
          dispatch({ type: "fetch_success", products: data.products, total: data.total });
        }
      } catch (err) {
        if (!ignore) {
          const message = err instanceof Error ? err.message : "Something went wrong";
          dispatch({ type: "fetch_error", message });
        }
      }
    }, 400);

    return () => {
      ignore = true;
      clearTimeout(timer);
    };
  }, [state.page, state.search, state.category, state.sort]);

  // --- useCALLBACK: action functions with a STABLE identity ---
  // These never change between renders, so memoized children that receive
  // them as props won't re- render for no reason.

  const setSearch = useCallback((value: string) => {
    dispatch({ type: "search_changed", value });
  }, []);

  const setCategory = useCallback((value: string) => {
    dispatch({ type: "category_changed", value });
  }, []);

  const setSort = useCallback((value: string) => {
    dispatch({ type: "sort_changed", value });
  }, []);

  const setPage = useCallback((value: number) => {
    dispatch({ type: "page_changed", value });
  }, []);

  const selectProduct = useCallback((product: Product | null) => {
    dispatch({ type: "product_selected", product });
  }, []);

  // ---- useMEMO : derived values, only recalculated when their inputs change ---
  const totalPages = useMemo(() => Math.ceil(state.total / PAGE_SIZE), [state.total]);
  const categoryName = useMemo(
    () => state.categories.find((c) => c.slug === state.category)?.name,
    [state.categories, state.category],
  );

  // useMEMO: the context value object itself (VERY important) ---
  // Without this we'd build a brand new object every render and force EVERY
  // consumenr to re-render. Memoizing keeps its identity stable.
  const value = useMemo<ProductsContextValue>(
    () => ({
      products: state.products,
      total: state.total,
      totalPages,
      page: state.page,
      search: state.search,
      category: state.category,
      categoryName,
      sort: state.sort,
      categories: state.categories,
      loading: state.loading,
      error: state.error,
      selected: state.selected,
      setSearch,
      setCategory,
      setSort,
      setPage,
      selectProduct,
    }),
    [state, totalPages, categoryName, setSearch, setCategory, setSort, setPage, selectProduct],
  );

  return <ProductsContext.Provider value={value}>{children}</ProductsContext.Provider>;
}
