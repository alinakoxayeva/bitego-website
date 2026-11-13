import { Link, useParams } from "react-router";
import { CircleCheck } from "lucide-react";
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
    return (
      <div className="mx-auto my-16 h-48 max-w-lg animate-pulse rounded-2xl bg-cream" />
    );

  if (isError || !order) {
    return (
      <div className="py-20 text-center text-russet">
        <p>Sifariş tapılmadı.</p>
        <Link to="/menu" className="mt-2 inline-block font-bold text-fire underline">
          Menyuya qayıt
        </Link>
      </div>
    );
  }

  return (
    <section className="px-6 py-14">
      <div className="mx-auto max-w-lg rounded-2xl bg-cream p-8 text-center">
        <CircleCheck className="mx-auto text-forest" size={48} />
        <h1 className="mt-4 font-display text-3xl text-russet md:text-4xl">
          Yemək yoldadır!
        </h1>
        <p className="mt-2 text-russet">
          Sifariş nömrəsi: <strong>#{order.orderNumber}</strong>
        </p>

        <ul className="mt-6 space-y-2 border-t border-russet/20 pt-4 text-left text-sm text-russet">
          {order.items.map((i) => (
            <li key={i.id} className="flex justify-between gap-3">
              <span>
                {i.quantity} × {i.nameSnapshot}
              </span>
              <span>{formatPrice(Number(i.priceSnapshot) * i.quantity)}</span>
            </li>
          ))}
        </ul>
        <p className="mt-4 flex items-baseline justify-between border-t border-russet/20 pt-4 text-russet">
          <span className="font-display text-xl">Cəmi</span>
          <span className="font-display text-2xl">{formatPrice(order.total)}</span>
        </p>

        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link
            to="/orders"
            className="rounded-md bg-fire px-5 py-3 text-sm font-bold text-white"
          >
            Sifarişlərim
          </Link>
          <Link
            to="/menu"
            className="rounded-md border border-russet px-5 py-3 text-sm font-bold text-russet"
          >
            Menyuya qayıt
          </Link>
        </div>
      </div>
    </section>
  );
}