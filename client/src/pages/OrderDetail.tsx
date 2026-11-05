import { useEffect, useState } from "react";
import { Link, useParams } from "react-router";
import { toast } from "sonner";
import {
  useCancelOrderMutation,
  useGetOrderByIdQuery,
} from "@/features/orders/ordersApi";
import StatusBadge from "@/components/common/StatusBadge";
import OrderTimeline from "@/components/common/OrderTimeline";
import { isFinalStatus } from "@/lib/orderStatus";
import { getErrorMessage } from "@/lib/errors";
import { formatDate, formatPrice } from "@/lib/format";

export default function OrderDetail() {
  const { id } = useParams();
  const [pollingInterval, setPollingInterval] = useState(15000);

  const { data: order, isLoading, isError } = useGetOrderByIdQuery(id ?? "", {
    skip: !id,
    pollingInterval,
  });
  const [cancelOrder, { isLoading: isCancelling }] = useCancelOrderMutation();

  // Sifariş son statusa çatanda artıq sorğu göndərmirik
  useEffect(() => {
    if (order && isFinalStatus(order.status)) setPollingInterval(0);
  }, [order]);

  if (isLoading) return <div className="h-60 animate-pulse rounded-xl bg-gray-200" />;

  if (isError || !order) {
    return (
      <div className="py-12 text-center">
        <p>Sifariş tapılmadı.</p>
        <Link to="/orders" className="underline">
          Sifarişlərimə qayıt
        </Link>
      </div>
    );
  }

  async function handleCancel() {
    if (!order) return;
    if (!window.confirm("Sifarişi ləğv etmək istədiyinizə əminsiniz?")) return;
    try {
      await cancelOrder({ id: order.id }).unwrap();
      toast.success("Sifariş ləğv edildi");
    } catch (err) {
      toast.error(getErrorMessage(err));
    }
  }

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <Link to="/orders" className="text-sm text-gray-500 underline">
        ← Sifarişlərim
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

      <section className="rounded-xl border bg-white p-4 text-sm">
        <h2 className="mb-2 font-semibold">Çatdırılma</h2>
        <p>{order.address}</p>
        <p className="text-gray-600">{order.phone}</p>
        {order.note && <p className="mt-2 text-gray-600">Qeyd: {order.note}</p>}
        <p className="mt-2 text-gray-600">
          Ödəniş: {order.paymentMethod === "CASH" ? "Nağd" : "Kart"}
        </p>
      </section>

      {order.status === "PENDING" && (
        <button
          onClick={handleCancel}
          disabled={isCancelling}
          className="rounded-md border border-red-300 px-4 py-2 text-red-600 disabled:opacity-50"
        >
          {isCancelling ? "Gözləyin..." : "Sifarişi ləğv et"}
        </button>
      )}
    </div>
  );
}