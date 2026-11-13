import type { OrderStatus } from "@/features/orders/types";
import { STATUS_LABELS, STATUS_STEPS } from "@/lib/orderStatus";

export default function OrderTimeline({ status }: { status: OrderStatus }) {
  if (status === "CANCELLED") {
    return (
      <p className="rounded-md bg-fire/10 p-3 text-sm font-bold text-fire">
        Bu sifariş ləğv edilib.
      </p>
    );
  }

  const current = STATUS_STEPS.indexOf(status);
  const delivered = status === "DELIVERED";

  return (
    <ol className="flex flex-col gap-6 sm:flex-row">
      {STATUS_STEPS.map((step, i) => {
        const done = i < current || delivered;
        const active = i === current && !delivered;

        return (
          <li
            key={step}
            className="relative flex flex-1 items-center gap-3 sm:flex-col sm:gap-2"
          >
            {i < STATUS_STEPS.length - 1 && (
              <span
                className={`absolute left-1/2 top-4 hidden h-0.5 w-full sm:block ${
                  i < current || delivered ? "bg-forest" : "bg-russet/20"
                }`}
              />
            )}

            <span
              className={`relative z-10 flex size-8 shrink-0 items-center justify-center rounded-md text-sm font-bold ${
                done
                  ? "bg-forest text-cream"
                  : active
                    ? "bg-saffron text-russet"
                    : "border border-russet/20 bg-paper text-russet/60"
              }`}
            >
              {done ? "✓" : i + 1}
            </span>

            <span
              className={`text-sm ${
                active || (delivered && i === current)
                  ? "font-bold text-russet"
                  : "text-russet/70"
              }`}
            >
              {STATUS_LABELS[step]}
            </span>
          </li>
        );
      })}
    </ol>
  );
}