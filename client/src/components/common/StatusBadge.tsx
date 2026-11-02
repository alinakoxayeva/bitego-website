import type { OrderStatus } from "@/features/orders/types";
import { STATUS_COLORS, STATUS_LABELS } from "@/lib/orderStatus";

export default function StatusBadge({ status }: { status: OrderStatus }) {
  return (
    <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${STATUS_COLORS[status]}`}>
      {STATUS_LABELS[status]}
    </span>
  );
}