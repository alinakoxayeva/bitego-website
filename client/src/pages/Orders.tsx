import { Link } from "react-router";
import { useGetMyOrdersQuery } from "@/features/orders/ordersApi";
import StatusBadge from "@/components/common/StatusBadge";
import PageHeader from "@/components/common/PageHeader";
import { formatDate, formatPrice } from "@/lib/format";

export default function Orders() {
  const { data: orders, isLoading, isError, refetch } = useGetMyOrdersQuery();

  return (
    <>
      <PageHeader
        eyebrow="Növbəti xoş anınız"
        title="Gözləməyə dəyər."
        subtitle="Sifarişlərinizi izləyin və köhnə sevimlilərə qayıdın."
      />

      <section className="mx-auto max-w-7xl px-6 py-10">
        {isLoading && (
          <div className="space-y-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="h-24 animate-pulse rounded-2xl bg-cream" />
            ))}
          </div>
        )}

        {isError && (
          <div className="rounded-md border border-red-200 bg-red-50 p-4">
            <p className="text-red-700">Sifarişləri yükləmək mümkün olmadı.</p>
            <button onClick={() => refetch()} className="mt-2 underline">
              Yenidən cəhd et
            </button>
          </div>
        )}

        {!isLoading && !isError && (!orders || orders.length === 0) && (
          <div className="py-12 text-center">
            <h2 className="font-display text-3xl text-russet">Hələ sifarişiniz yoxdur</h2>
            <Link
              to="/menu"
              className="mt-6 inline-block rounded-md bg-fire px-6 py-3 text-sm font-bold text-white"
            >
              Menyuya keç
            </Link>
          </div>
        )}

        {orders && orders.length > 0 && (
          <ul className="space-y-4">
            {orders.map((o) => (
              <li key={o.id}>
                <Link
                  to={`/orders/${o.id}`}
                  className="flex items-center justify-between gap-4 rounded-2xl border border-cream bg-paper p-5 transition hover:shadow-md"
                >
                  <div>
                    <p className="text-xs font-bold uppercase tracking-wider text-russet/70">
                      Sifariş #{o.orderNumber} · {formatDate(o.createdAt)}
                    </p>
                    <p className="mt-1 font-display text-xl text-russet">
                      {o.items.length} məhsul
                    </p>
                  </div>
                  <div className="text-right">
                    <StatusBadge status={o.status} />
                    <p className="mt-2 font-display text-xl text-russet">
                      {formatPrice(o.total)}
                    </p>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </section>
    </>
  );
}