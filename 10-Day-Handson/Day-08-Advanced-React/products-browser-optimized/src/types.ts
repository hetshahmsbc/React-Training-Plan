// types.ts — the "shape" of our data (Product, ProductResponse, Category).
// Fill this in from the guide in chat.

// One product from the DummyJSON API (only the fields we use).
export interface Product {
  id: number;
  title: string;
  description: string;
  price: number;
  thumbnail: string;
  category: string;
  rating: number;
}

// The whole response the API sends back for a product list.
export interface ProductResponse {
  products: Product[];
  total: number;
  skip: number;
  limit: number;
}

// A category, used to build the filter dropdown.
export interface Category {
  slug: string;
  name: string;
  url: string;
}
