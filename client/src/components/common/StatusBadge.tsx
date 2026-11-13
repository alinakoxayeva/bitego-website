import type { OrderStatus } from "@/features/orders/types";
import { STATUS_COLORS, STATUS_LABELS } from "@/lib/orderStatus";

export default function StatusBadge({ status }: { status: OrderStatus }) {
  return (
    <span
      className={`inline-block rounded-md px-3 py-1 text-xs font-bold ${STATUS_COLORS[status]}`}
    >
      {STATUS_LABELS[status]}
    </span>
  );
}