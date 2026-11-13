import { useEffect, useState } from "react";
import { Link, useParams } from "react-router";
import { ArrowLeft } from "lucide-react";
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

  if (isLoading)
    return (
      <div className="mx-auto my-12 h-60 max-w-3xl animate-pulse rounded-2xl bg-cream" />
    );

  if (isError || !order) {
    return (
      <div className="py-20 text-center text-russet">
        <p>Sifariş tapılmadı.</p>
        <Link to="/orders" className="mt-2 inline-block font-bold text-fire underline">
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
    <>
      <section className="bg-cream">
        <div className="mx-auto max-w-7xl px-6 py-10">
          <Link
            to="/orders"
            className="mb-4 inline-flex items-center gap-2 text-sm font-bold text-fire"
          >
            <ArrowLeft size={14} /> Sifarişlərim
          </Link>
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="mb-2 text-xs font-bold uppercase tracking-widest text-russet/70">
                {formatDate(order.createdAt)}
              </p>
              <h1 className="font-display text-4xl text-russet md:text-5xl">
                Sifariş #{order.orderNumber}
              </h1>
            </div>
            <StatusBadge status={order.status} />
          </div>
        </div>
      </section>

      <div className="mx-auto grid max-w-7xl gap-6 px-6 py-10 lg:grid-cols-[1fr_380px]">
        <div className="space-y-6">
          <section className="rounded-2xl bg-cream p-6">
            <OrderTimeline status={order.status} />
            {order.status === "CANCELLED" && order.cancelReason && (
              <p className="mt-4 text-sm text-russet">Səbəb: {order.cancelReason}</p>
            )}
          </section>

          <section className="rounded-2xl border border-cream bg-paper p-6">
            <h2 className="mb-4 font-display text-2xl text-russet">Məhsullar</h2>
            <ul className="space-y-2 text-sm text-russet">
              {order.items.map((i) => (
                <li key={i.id} className="flex justify-between gap-3">
                  <span>
                    {i.quantity} × {i.nameSnapshot}
                  </span>
                  <span>{formatPrice(Number(i.priceSnapshot) * i.quantity)}</span>
                </li>
              ))}
            </ul>
            <div className="mt-4 space-y-2 border-t border-cream pt-4 text-sm text-russet">
              <div className="flex justify-between">
                <span>Məhsullar</span>
                <span>{formatPrice(order.subtotal)}</span>
              </div>
              <div className="flex justify-between">
                <span>Çatdırılma</span>
                <span>{formatPrice(order.deliveryFee)}</span>
              </div>
              <div className="flex items-baseline justify-between pt-2">
                <span className="font-display text-xl">Cəmi</span>
                <span className="font-display text-2xl">{formatPrice(order.total)}</span>
              </div>
            </div>
          </section>
        </div>

        <aside className="h-fit space-y-6">
          <section className="rounded-2xl border border-cream bg-paper p-6 text-sm text-russet">
            <h2 className="mb-3 font-display text-2xl">Çatdırılma</h2>
            <p>{order.address}</p>
            <p className="mt-1 text-russet/80">{order.phone}</p>
            {order.note && <p className="mt-3 text-russet/80">Qeyd: {order.note}</p>}
            <p className="mt-3 border-t border-cream pt-3">
              Ödəniş: {order.paymentMethod === "CASH" ? "Nağd" : "Kart"}
            </p>
          </section>

          {order.status === "PENDING" && (
            <button
              onClick={handleCancel}
              disabled={isCancelling}
              className="w-full rounded-md border border-fire py-3 text-sm font-bold text-fire transition hover:bg-fire hover:text-white disabled:opacity-50"
            >
              {isCancelling ? "Gözləyin..." : "Sifarişi ləğv et"}
            </button>
          )}
        </aside>
      </div>
    </>
  );
}