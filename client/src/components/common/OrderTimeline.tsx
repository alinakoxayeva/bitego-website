import type { OrderStatus } from "@/features/orders/types";
import { STATUS_LABELS, STATUS_STEPS } from "@/lib/orderStatus";

export default function OrderTimeline({ status }: { status: OrderStatus }) {
  if (status === "CANCELLED") {
    return (
      <p className="rounded-md bg-red-50 p-3 text-sm text-red-700">
        Bu sifariş ləğv edilib.
      </p>
    );
  }

  const current = STATUS_STEPS.indexOf(status);

  return (
    <ol className="flex flex-col gap-4 sm:flex-row sm:gap-0">
      {STATUS_STEPS.map((step, i) => {
        const done = i <= current;
        return (
          <li
            key={step}
            className="flex flex-1 items-center gap-3 sm:flex-col sm:text-center"
          >
            <span
              className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm font-bold ${
                done ? "bg-orange-500 text-white" : "bg-gray-200 text-gray-500"
              }`}
            >
              {done ? "✓" : i + 1}
            </span>
            <span
              className={`text-sm ${i === current ? "font-semibold" : "text-gray-600"}`}
            >
              {STATUS_LABELS[step]}
            </span>
          </li>
        );
      })}
    </ol>
  );
}
