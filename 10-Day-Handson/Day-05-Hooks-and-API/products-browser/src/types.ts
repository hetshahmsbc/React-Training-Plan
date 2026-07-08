// types.ts — describe the "shape" of your data here.
// TODO: export a `Product` interface and a `ProductsResponse` interface.

// The shape of ONE product coming back from DummyJSON
// We only list the fields we actually use.

export interface Product {
  id: number;
  title: string;
  description: string;
  price: number;
  thumbnail: string;
  category: string;
  rating: number;
}

// The shape of the WHOLE response the API Sends back
export interface ProductResponse {
  products: Product[];
  total: number; // total number of products (used for pagination)
  skip: number;
  limit: number;
}

// A product category, used to build the filter dropdown.
export interface Category {
  slug: string; // used in the URL, e.g. "smartphones"
  name: string; // shown to the user, e.g. "Smartphones"
  url: string;
}
