import type { OrderStatus } from "@/features/orders/types";

export const STATUS_LABELS: Record<OrderStatus, string> = {
  PENDING: "Gözləyir",
  CONFIRMED: "Təsdiqləndi",
  PREPARING: "Hazırlanır",
  ON_THE_WAY: "Yoldadır",
  DELIVERED: "Çatdırıldı",
  CANCELLED: "Ləğv edildi",
};

export const STATUS_COLORS: Record<OrderStatus, string> = {
  PENDING: "bg-yellow-100 text-yellow-800",
  CONFIRMED: "bg-blue-100 text-blue-800",
  PREPARING: "bg-orange-100 text-orange-800",
  ON_THE_WAY: "bg-purple-100 text-purple-800",
  DELIVERED: "bg-green-100 text-green-800",
  CANCELLED: "bg-red-100 text-red-800",
};

export const STATUS_STEPS: OrderStatus[] = [
  "PENDING",
  "CONFIRMED",
  "PREPARING",
  "ON_THE_WAY",
  "DELIVERED",
];

export const isFinalStatus = (s: OrderStatus) =>
  s === "DELIVERED" || s === "CANCELLED";

