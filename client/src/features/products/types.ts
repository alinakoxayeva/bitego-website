export interface Category {
  id: string;
  name: string;
  slug: string;
  imageUrl: string | null;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  price: string;
  imageUrl: string;
  isAvailable: boolean;
  isFeatured: boolean;
  category: { name: string; slug: string };
}

export interface ProductsResponse {
  items: Product[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface ProductsQuery {
  search?: string;
  category?: string;
  sort?: string;
  page?: number;
  limit?: number;
}