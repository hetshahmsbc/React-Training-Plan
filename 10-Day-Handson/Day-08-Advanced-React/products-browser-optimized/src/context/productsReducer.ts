// productsReducer.ts — Day 8 REDUCERS.
// The State shape, the Action type, initialState, and the productsReducer function.
// Fill this in from the guide in chat.

import type { Product, Category } from "../types";

// Everything the products page needs to remember, in one object.
export interface State {
  products: Product[];
  total: number;
  page: number;
  search: string;
  category: string;
  sort: string;
  categories: Category[];
  loading: boolean;
  error: string;
  selected: Product | null; // product shown in the modal (null = modal closed)
}

// The starting state, before anything loads.
export const initialState: State = {
  products: [],
  total: 0,
  page: 1,
  search: "",
  category: "",
  sort: "",
  categories: [],
  loading: false,
  error: "",
  selected: null,
};

// Every "thing that can happen" in the app. Each has a `type` and its own data.
export type Action =
  | { type: "search_changed"; value: string }
  | { type: "category_changed"; value: string }
  | { type: "sort_changed"; value: string }
  | { type: "page_changed"; value: number }
  | { type: "fetch_start" }
  | { type: "fetch_success"; products: Product[]; total: number }
  | { type: "fetch_error"; message: string }
  | { type: "categories_loaded"; categories: Category[] }
  | { type: "product_selected"; product: Product | null };

// Given the old state + an acrtion, return a NEW state object.
export function productsReducer(state: State, action: Action): State {
  switch (action.type) {
    case "search_changed":
      // A new search clears the category and jumps back to page 1
      return { ...state, search: action.value, category: "", page: 1 };

    case "category_changed":
      // Picking a category clears the search box and jumps back to page 1.
      return { ...state, category: action.value, search: "", page: 1 };
    case "sort_changed":
      return { ...state, sort: action.value, page: 1 };
    case "page_changed":
      return { ...state, page: action.value };
    case "fetch_start":
      return { ...state, loading: true, error: "" };
    case "fetch_success":
      return { ...state, loading: false, products: action.products, total: action.total };
    case "fetch_error":
      return { ...state, loading: false, error: action.message };
    case "categories_loaded":
      return { ...state, categories: action.categories };
    case "product_selected":
      return { ...state, selected: action.product };
    default:
      return state;
  }
}
