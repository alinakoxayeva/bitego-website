import type { Order, OrderStatus } from "@/features/orders/types";

export interface AdminOrder extends Order {
  user: { id: string; name: string; email: string; phone: string | null };
  nextStatuses?: OrderStatus[];
}

export interface Paginated<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface AdminOrdersQuery {
  status?: OrderStatus;
  search?: string;
  from?: string;
  to?: string;
  page?: number;
  limit?: number;
}