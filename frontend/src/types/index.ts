export interface Category {
  id: number;
  name: string;
}

export interface Product {
  id: number;
  shop: number;
  category: number | null;
  category_name: string | null;
  name: string;
  description: string;
  price: string; // Decimal is returned as string in JSON
  stock: number;
  created_at: string;
}

export interface Shop {
  id: number;
  owner: number;
  owner_username: string;
  name: string;
  location: string;
  description: string;
  products: Product[];
  created_at: string;
}
