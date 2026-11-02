import { Link } from "react-router";
import { useGetMyOrdersQuery } from "@/features/orders/ordersApi";
import StatusBadge from "@/components/common/StatusBadge";
import { formatDate, formatPrice } from "@/lib/format";

export default function Orders() {
  const {
    data: orders,
    isLoading,
    isError,
    error,
    refetch,
  } = useGetMyOrdersQuery();
  console.log("orders error:", error);
  if (isLoading) {
    return (
      <div className="space-y-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="h-20 animate-pulse rounded-xl bg-gray-200" />
        ))}
      </div>
    );
  }

  if (isError) {
    return (
      <div className="rounded-md border border-red-200 bg-red-50 p-4">
        <p className="text-red-700">Sifarişləri yükləmək mümkün olmadı.</p>
        <button onClick={refetch} className="mt-2 underline">
          Yenidən cəhd et
        </button>
      </div>
    );
  }

  if (!orders || orders.length === 0) {
    return (
      <div className="py-16 text-center">
        <h1 className="text-2xl font-bold">Hələ sifarişiniz yoxdur</h1>
        <Link
          to="/menu"
          className="mt-4 inline-block rounded-md bg-orange-500 px-4 py-2 text-white"
        >
          Menyuya keç
        </Link>
      </div>
    );
  }

  return (
    <div>
      <h1 className="mb-4 text-2xl font-bold">Sifarişlərim</h1>
      <ul className="space-y-3">
        {orders.map((o) => (
          <li key={o.id}>
            <Link
              to={`/orders/${o.id}`}
              className="flex items-center justify-between rounded-xl border bg-white p-4 transition hover:shadow-md"
            >
              <div>
                <p className="font-semibold">Sifariş #{o.orderNumber}</p>
                <p className="text-sm text-gray-500">
                  {formatDate(o.createdAt)} · {o.items.length} məhsul
                </p>
              </div>
              <div className="text-right">
                <StatusBadge status={o.status} />
                <p className="mt-1 font-bold">{formatPrice(o.total)}</p>
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
