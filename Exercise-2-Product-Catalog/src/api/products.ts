import type { Product } from "../types/product";
import { apiGet } from "./client";

// GET /products -> all products
export function getAllProducts(): Promise<Product[]> {
  return apiGet<Product[]>("/products");
}

// GET /products/:id  → one product
export function getProductById(id: number): Promise<Product> {
  return apiGet<Product>(`/products/${id}`);
}

// GET /products/categories  → ["electronics", "jewelery", ...]
export function getCategories(): Promise<string[]> {
  return apiGet<string[]>("/products/categories");
}

// GET /products/category/:category  → products in that category
export function getProductsByCategory(category: string): Promise<Product[]> {
  return apiGet<Product[]>(`/products/category/${category}`);
}
