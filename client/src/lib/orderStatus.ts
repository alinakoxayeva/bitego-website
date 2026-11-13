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
  PENDING: "bg-saffron/40 text-russet",
  CONFIRMED: "bg-retro-green/15 text-retro-green",
  PREPARING: "bg-saffron text-foreground",
  ON_THE_WAY: "bg-russet/15 text-russet",
  DELIVERED: "bg-retro-green text-cream",
  CANCELLED: "bg-primary/15 text-primary",
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

