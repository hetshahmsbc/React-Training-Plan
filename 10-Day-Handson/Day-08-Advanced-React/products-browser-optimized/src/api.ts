// api.ts — talks to the DummyJSON API (fetchProducts + fetchCategories).
// Fill this in from the guide in chat.

import type { ProductResponse, Category } from "./types";

// The server address comes from the .env file.
const BASE_URL = import.meta.env.VITE_API_BASE_URL;

interface FetchParams {
  limit: number; // how many products per page
  skip: number; // how many to skip (page 2 skips the first 12)
  search: string; // what the user typed
  category: string; // selected category slug ("" = all)
  sortBy: string; // field to sort by ("" = no sorting)
  order: string; // "asc" or "desc"
}

export async function fetchProducts({
  limit,
  skip,
  search,
  category,
  sortBy,
  order,
}: FetchParams): Promise<ProductResponse> {
  const params = new URLSearchParams();
  params.set("limit", String(limit));
  params.set("skip", String(skip));
  if (sortBy) {
    params.set("sortBy", sortBy);
    params.set("order", order);
  }

  // DummyJSON can't do search + category together, so we pick one endpoint.
  let path: string;
  if (category) {
    path = `/products/category/${category}`;
  } else if (search) {
    path = `/products/search`;
    params.set("q", search);
  } else {
    path = `/products`;
  }

  const url = `${BASE_URL}${path}?${params.toString()}`;
  const response = await fetch(url);

  // fetch does NOT throw on 404/500 — we must check ourselves.
  if (!response.ok) {
    throw new Error(`Request failed (status ${response.status})`);
  }

  return response.json();
}

// Fetch the category list for the filter dropdown (runs once on load).
export async function fetchCategories(): Promise<Category[]> {
  const response = await fetch(`${BASE_URL}/products/categories`);
  if (!response.ok) {
    throw new Error(`Request failed (status ${response.status})`);
  }
  return response.json();
}
