import { useState } from "react";
import { Link, useParams } from "react-router";
import { toast } from "sonner";
import {
  useGetAdminOrderByIdQuery,
  useUpdateOrderStatusMutation,
} from "@/features/admin/adminApi";
import type { OrderStatus } from "@/features/orders/types";
import StatusBadge from "@/components/common/StatusBadge";
import OrderTimeline from "@/components/common/OrderTimeline";
import { STATUS_LABELS } from "@/lib/orderStatus";
import { getErrorMessage } from "@/lib/errors";
import { formatDate, formatPrice } from "@/lib/format";

export default function AdminOrderDetail() {
  const { id } = useParams();
  const { data: order, isLoading, isError } = useGetAdminOrderByIdQuery(id ?? "", {
    skip: !id,
  });
  const [updateStatus, { isLoading: isUpdating }] = useUpdateOrderStatusMutation();
  const [cancelling, setCancelling] = useState(false);
  const [reason, setReason] = useState("");

  if (isLoading) return <div className="h-60 animate-pulse rounded-xl bg-gray-200" />;

  if (isError || !order) {
    return (
      <div className="py-12 text-center">
        <p>Sifariş tapılmadı.</p>
        <Link to="/admin/orders" className="underline">
          Sifarişlərə qayıt
        </Link>
      </div>
    );
  }

  const next = order.nextStatuses ?? [];
  const forwardStatuses = next.filter((s) => s !== "CANCELLED");
  const canCancel = next.includes("CANCELLED");

  async function change(status: OrderStatus, cancelReason?: string) {
    if (!order) return;
    try {
      await updateStatus({ id: order.id, status, cancelReason }).unwrap();
      toast.success(`Status dəyişdi: ${STATUS_LABELS[status]}`);
      setCancelling(false);
      setReason("");
    } catch (err) {
      toast.error(getErrorMessage(err));
    }
  }

  function confirmCancel() {
    if (reason.trim().length < 3) {
      toast.error("Ləğv səbəbini yazın (ən azı 3 simvol)");
      return;
    }
    change("CANCELLED", reason.trim());
  }

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <Link to="/admin/orders" className="text-sm text-gray-500 underline">
        ← Sifarişlər
      </Link>

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Sifariş #{order.orderNumber}</h1>
          <p className="text-sm text-gray-500">{formatDate(order.createdAt)}</p>
        </div>
        <StatusBadge status={order.status} />
      </div>

      <section className="rounded-xl border bg-white p-4">
        <OrderTimeline status={order.status} />
        {order.status === "CANCELLED" && order.cancelReason && (
          <p className="mt-3 text-sm text-gray-600">Səbəb: {order.cancelReason}</p>
        )}
      </section>

      {next.length > 0 && (
        <section className="rounded-xl border bg-white p-4">
          <h2 className="mb-3 font-semibold">Statusu dəyiş</h2>
          <div className="flex flex-wrap gap-3">
            {forwardStatuses.map((s) => (
              <button
                key={s}
                disabled={isUpdating}
                onClick={() => change(s)}
                className="rounded-md bg-orange-500 px-4 py-2 text-white disabled:opacity-50"
              >
                {STATUS_LABELS[s]}
              </button>
            ))}
            {canCancel && !cancelling && (
              <button
                onClick={() => setCancelling(true)}
                className="rounded-md border border-red-300 px-4 py-2 text-red-600"
              >
                Ləğv et
              </button>
            )}
          </div>

          {cancelling && (
            <div className="mt-4 space-y-2">
              <textarea
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                rows={2}
                placeholder="Ləğv səbəbi"
                className="w-full rounded-md border px-3 py-2"
              />
              <div className="flex gap-2">
                <button
                  onClick={confirmCancel}
                  disabled={isUpdating}
                  className="rounded-md bg-red-600 px-4 py-2 text-white disabled:opacity-50"
                >
                  Ləğvi təsdiqlə
                </button>
                <button
                  onClick={() => {
                    setCancelling(false);
                    setReason("");
                  }}
                  className="rounded-md border px-4 py-2"
                >
                  Vaz keç
                </button>
              </div>
            </div>
          )}
        </section>
      )}

      <section className="rounded-xl border bg-white p-4 text-sm">
        <h2 className="mb-2 font-semibold">Müştəri</h2>
        <p>{order.user.name}</p>
        <p className="text-gray-600">{order.user.email}</p>
        <p className="text-gray-600">{order.phone}</p>
        <p className="mt-2">{order.address}</p>
        {order.note && <p className="mt-2 text-gray-600">Qeyd: {order.note}</p>}
        <p className="mt-2 text-gray-600">
          Ödəniş: {order.paymentMethod === "CASH" ? "Nağd" : "Kart"}
        </p>
      </section>

      <section className="rounded-xl border bg-white p-4">
        <h2 className="mb-3 font-semibold">Məhsullar</h2>
        <ul className="space-y-2 text-sm">
          {order.items.map((i) => (
            <li key={i.id} className="flex justify-between">
              <span>
                {i.nameSnapshot} × {i.quantity}
              </span>
              <span>{formatPrice(Number(i.priceSnapshot) * i.quantity)}</span>
            </li>
          ))}
        </ul>
        <div className="mt-3 space-y-1 border-t pt-3 text-sm">
          <div className="flex justify-between">
            <span>Məhsullar</span>
            <span>{formatPrice(order.subtotal)}</span>
          </div>
          <div className="flex justify-between">
            <span>Çatdırılma</span>
            <span>{formatPrice(order.deliveryFee)}</span>
          </div>
          <div className="flex justify-between text-base font-bold">
            <span>Cəmi</span>
            <span>{formatPrice(order.total)}</span>
          </div>
        </div>
      </section>
    </div>
  );
}