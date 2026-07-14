// The exact shape of ONE product from the Fake Store API.
// Open https://fakestoreapi.com/products/1 in your browser to see it live.
export interface Product {
  id: number;
  title: string;
  price: number;
  description: string;
  category: string;
  image: string; // URL of the product photo
  rating: {
    rate: number; // average stars (e.g. 4.5)
    count: number; // number of reviews
  };
}

// A cart item is a Product plus how many we want.
export interface CartItem extends Product {
  quantity: number;
}
