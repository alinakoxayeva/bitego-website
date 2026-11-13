import { Link } from "react-router";
import { ArrowLeft, Minus, Plus } from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/app/hooks";
import { decrement, increment, removeItem, clearCart } from "@/features/cart/cartSlice";
import { selectCartItems, selectCartTotal } from "@/features/cart/selectors";
import { formatPrice } from "@/lib/format";

export default function Cart() {
  const dispatch = useAppDispatch();
  const items = useAppSelector(selectCartItems);
  const total = useAppSelector(selectCartTotal);

  if (items.length === 0) {
    return (
      <section className="mx-auto max-w-7xl px-6 py-24 text-center">
        <h1 className="font-display text-4xl text-russet md:text-5xl">
          Səbətiniz boşdur
        </h1>
        <p className="mt-3 text-russet/80">Menyudan bir şey seçin, qalanını bizə qoyun.</p>
        <Link
          to="/menu"
          className="mt-8 inline-block rounded-md bg-fire px-6 py-3 text-sm font-bold text-white"
        >
          Menyuya keç
        </Link>
      </section>
    );
  }

  const count = items.reduce((sum, i) => sum + i.quantity, 0);

  return (
    <>
      <section className="bg-cream">
        <div className="mx-auto max-w-7xl px-6 py-12">
          <p className="mb-3 text-xs font-bold uppercase tracking-widest text-fire">
            Bir neçə yaxşı seçim
          </p>
          <h1 className="font-display text-4xl text-russet md:text-6xl">
            Seçdiyiniz yeməklər.
          </h1>
          <p className="mt-3 text-russet">{count} məhsul. Çox yaxşı qərar.</p>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-10 px-6 py-10 lg:grid-cols-[1fr_380px]">
        <div>
          <ul className="divide-y divide-cream border-y border-cream">
            {items.map((item) => (
              <li key={item.productId} className="flex gap-4 py-5">
                <img
                  src={item.imageUrl}
                  alt={item.name}
                  className="size-24 shrink-0 rounded-xl object-cover"
                />
                <div className="flex flex-1 flex-col justify-between">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="font-display text-xl text-russet">{item.name}</p>
                      <p className="text-sm text-russet/70">{formatPrice(item.price)}</p>
                    </div>
                    <p className="font-bold text-russet">
                      {formatPrice(item.price * item.quantity)}
                    </p>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3 rounded-md bg-cream px-2 py-1.5">
                      <button
                        onClick={() => dispatch(decrement(item.productId))}
                        aria-label="Azalt"
                        className="text-russet"
                      >
                        <Minus size={14} />
                      </button>
                      <span className="w-6 text-center text-sm font-bold text-russet">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => dispatch(increment(item.productId))}
                        aria-label="Artır"
                        className="text-russet"
                      >
                        <Plus size={14} />
                      </button>
                    </div>
                    <button
                      onClick={() => dispatch(removeItem(item.productId))}
                      className="text-sm font-bold text-fire hover:underline"
                      aria-label="Sil"
                    >
                      Sil
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>

          <div className="mt-6 flex items-center justify-between">
            <Link
              to="/menu"
              className="flex items-center gap-2 text-sm font-bold text-fire"
            >
              <ArrowLeft size={14} /> Menyuya qayıt
            </Link>
            <button
              onClick={() => dispatch(clearCart())}
              className="text-sm text-russet/70 underline"
            >
              Səbəti təmizlə
            </button>
          </div>
        </div>

        <aside className="h-fit rounded-2xl bg-cream p-6">
          <h2 className="font-display text-2xl text-russet">Sifarişiniz</h2>
          <div className="mt-5 space-y-3 border-b border-russet/20 pb-4 text-sm text-russet">
            <div className="flex justify-between">
              <span>Məhsullar ({count})</span>
              <span>{formatPrice(total)}</span>
            </div>
          </div>
          <div className="mt-4 flex items-baseline justify-between text-russet">
            <span className="font-display text-xl">Cəmi</span>
            <span className="font-display text-2xl">{formatPrice(total)}</span>
          </div>
          <p className="mt-2 text-xs text-forest">
            Çatdırılma haqqı növbəti mərhələdə hesablanır.
          </p>
          <Link
            to="/checkout"
            className="mt-6 block rounded-md bg-fire py-3 text-center text-sm font-bold text-white"
          >
            Sifarişi rəsmiləşdir →
          </Link>
        </aside>
      </section>
    </>
  );
}