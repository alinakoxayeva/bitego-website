import { Link, useParams } from "react-router";
import { useGetOrderByIdQuery } from "@/features/orders/ordersApi";
import { formatPrice } from "@/lib/format";

export default function OrderSuccess() {
  const { id } = useParams();
  const {
    data: order,
    isLoading,
    isError,
  } = useGetOrderByIdQuery(id ?? "", { skip: !id });

  if (isLoading)
    return <div className="h-40 animate-pulse rounded-xl bg-gray-200" />;

  if (isError || !order) {
    return (
      <div className="py-12 text-center">
        <p>Sifariş tapılmadı.</p>
        <Link to="/menu" className="underline">
          Menyuya qayıt
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-lg rounded-xl border bg-white p-6 text-center">
      <h1 className="text-2xl font-bold text-green-600">
        Sifarişiniz qəbul olundu!
      </h1>
      <p className="mt-2">
        Sifariş nömrəsi: <strong>#{order.orderNumber}</strong>
      </p>

      <ul className="mt-4 space-y-1 text-left text-sm">
        {order.items.map((i) => (
          <li key={i.id} className="flex justify-between">
            <span>
              {i.nameSnapshot} × {i.quantity}
            </span>
            <span>{formatPrice(Number(i.priceSnapshot) * i.quantity)}</span>
          </li>
        ))}
      </ul>
      <p className="mt-3 border-t pt-3 text-lg font-bold">
        Cəmi: {formatPrice(order.total)}
      </p>

      <div className="mt-6 flex justify-center gap-3">
        <Link
          to="/orders"
          className="rounded-md bg-orange-500 px-4 py-2 text-white"
        >
          Sifarişlərim
        </Link>
        <Link to="/menu" className="rounded-md border px-4 py-2">
          Menyuya qayıt
        </Link>
      </div>
    </div>
  );
}
