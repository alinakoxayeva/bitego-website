import type { Order, OrderStatus } from "@/features/orders/types";

export interface Paginated<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// Sifarişlər
export interface AdminOrder extends Order {
  user: { id: string; name: string; email: string; phone: string | null };
  nextStatuses?: OrderStatus[];
}

export interface AdminOrdersQuery {
  status?: OrderStatus;
  search?: string;
  from?: string;
  to?: string;
  page?: number;
  limit?: number;
}

// Kateqoriyalar
export interface AdminCategory {
  id: string;
  name: string;
  slug: string;
  imageUrl: string | null;
  sortOrder: number;
  isActive: boolean;
  _count: { products: number };
}

// Məhsullar
export interface AdminProduct {
  id: string;
  name: string;
  description: string;
  price: string;
  imageUrl: string;
  isAvailable: boolean;
  isFeatured: boolean;
  categoryId: string;
  category: { id: string; name: string; slug: string };
}

export interface AdminProductsQuery {
  search?: string;
  category?: string;
  page?: number;
  limit?: number;
}

export interface ProductFormBody {
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  categoryId: string;
  isAvailable: boolean;
  isFeatured: boolean;
}

// Kateqoriya formu
export interface CategoryFormBody {
  name: string;
  imageUrl?: string;
  sortOrder?: number;
  isActive?: boolean;
}

// İstifadəçilər
export type UserRole = "USER" | "ADMIN";

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  role: UserRole;
  isBlocked: boolean;
  createdAt: string;
  _count: { orders: number };
}

export interface AdminUsersQuery {
  search?: string;
  role?: UserRole;
  page?: number;
  limit?: number;
}