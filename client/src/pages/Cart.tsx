import { Link } from "react-router";
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
      <div className="py-16 text-center">
        <h1 className="text-2xl font-bold">Səbətiniz boşdur</h1>
        <p className="mt-2 text-gray-600">Menyudan bir şey seçin.</p>
        <Link to="/menu" className="mt-4 inline-block rounded-md bg-orange-500 px-4 py-2 text-white">
          Menyuya keç
        </Link>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Səbət</h1>
        <button onClick={() => dispatch(clearCart())} className="text-sm text-red-600 underline">
          Səbəti təmizlə
        </button>
      </div>

      <ul className="divide-y rounded-xl border bg-white">
        {items.map((item) => (
          <li key={item.productId} className="flex items-center gap-4 p-3">
            <img src={item.imageUrl} alt={item.name} className="h-16 w-20 rounded-md object-cover" />
            <div className="flex-1">
              <p className="font-medium">{item.name}</p>
              <p className="text-sm text-gray-500">{formatPrice(item.price)}</p>
            </div>
            <div className="flex items-center gap-2 rounded-md border px-2 py-1">
              <button onClick={() => dispatch(decrement(item.productId))} aria-label="Azalt">
                −
              </button>
              <span className="w-6 text-center">{item.quantity}</span>
              <button onClick={() => dispatch(increment(item.productId))} aria-label="Artır">
                +
              </button>
            </div>
            <p className="w-24 text-right font-semibold">{formatPrice(item.price * item.quantity)}</p>
            <button
              onClick={() => dispatch(removeItem(item.productId))}
              className="text-sm text-red-600"
              aria-label="Sil"
            >
              Sil
            </button>
          </li>
        ))}
      </ul>

      <div className="mt-6 flex items-center justify-between">
        <p className="text-xl font-bold">Cəmi: {formatPrice(total)}</p>
        <Link to="/checkout" className="rounded-md bg-orange-500 px-6 py-2 font-medium text-white">
          Sifarişi rəsmiləşdir
        </Link>
      </div>
    </div>
  );
}