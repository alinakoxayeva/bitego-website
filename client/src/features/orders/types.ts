export type OrderStatus =
  | "PENDING"
  | "CONFIRMED"
  | "PREPARING"
  | "ON_THE_WAY"
  | "DELIVERED"
  | "CANCELLED";

export interface OrderItem {
  id: string;
  productId: string;
  nameSnapshot: string;
  priceSnapshot: string;
  quantity: number;
}

export interface Order {
  id: string;
  orderNumber: number;
  status: OrderStatus;
  subtotal: string;
  deliveryFee: string;
  total: string;
  paymentMethod: "CASH" | "CARD";
  address: string;
  phone: string;
  note: string | null;
  cancelReason: string | null;
  createdAt: string;
  items: OrderItem[];
}

export interface CreateOrderBody {
  items: { productId: string; quantity: number }[];
  address: string;
  phone: string;
  note?: string;
  paymentMethod: "CASH" | "CARD";
}