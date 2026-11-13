import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Navigate, useNavigate } from "react-router";
import { toast } from "sonner";
import { useAppDispatch, useAppSelector } from "@/app/hooks";
import { clearCart } from "@/features/cart/cartSlice";
import { selectCartItems, selectCartTotal } from "@/features/cart/selectors";
import { useCreateOrderMutation } from "@/features/orders/ordersApi";
import { getErrorMessage } from "@/lib/errors";
import { formatPrice } from "@/lib/format";

const schema = z.object({
  address: z.string().trim().min(5, "Ünvanı yazın"),
  phone: z.string().trim().min(7, "Telefon nömrəsini yazın"),
  note: z.string().max(300, "Qeyd 300 simvoldan çox ola bilməz").optional(),
  paymentMethod: z.enum(["CASH", "CARD"]),
});
type FormValues = z.infer<typeof schema>;

const DELIVERY_FEE = 2; // yalnız göstərmək üçün, əsl məbləği server hesablayır

const inputClass =
  "w-full rounded-lg border border-cream bg-paper px-3 py-2.5 text-russet outline-none focus:border-fire";
const labelClass = "mb-1 block text-sm font-bold text-russet";
const payClass =
  "flex cursor-pointer items-center gap-3 rounded-lg border border-cream bg-paper px-4 py-3 text-sm font-bold text-russet has-[:checked]:border-forest has-[:checked]:bg-cream";

export default function Checkout() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const items = useAppSelector(selectCartItems);
  const subtotal = useAppSelector(selectCartTotal);
  const user = useAppSelector((s) => s.auth.user);
  const [placed, setPlaced] = useState(false);
  const [createOrder, { isLoading }] = useCreateOrderMutation();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { phone: user?.phone ?? "", paymentMethod: "CASH" },
  });

  if (items.length === 0 && !placed) return <Navigate to="/cart" replace />;

  async function onSubmit(values: FormValues) {
    try {
      const order = await createOrder({
        ...values,
        note: values.note || undefined,
        items: items.map((i) => ({ productId: i.productId, quantity: i.quantity })),
      }).unwrap();

      setPlaced(true); // səbət boşalanda "/cart"-a atmasın
      dispatch(clearCart());
      toast.success("Sifarişiniz qəbul olundu");
      navigate(`/order-success/${order.id}`, { replace: true });
    } catch (err) {
      toast.error(getErrorMessage(err));
    }
  }

  return (
    <>
      <section className="bg-cream">
        <div className="mx-auto max-w-7xl px-6 py-12">
          <p className="mb-3 text-xs font-bold uppercase tracking-widest text-fire">
            Son addım
          </p>
          <h1 className="font-display text-4xl text-russet md:text-6xl">
            Yemək yoldadır.
          </h1>
          <p className="mt-3 text-xs text-russet">Səbət / Sifariş / Zövq alın</p>
        </div>
      </section>

      <div className="mx-auto grid max-w-7xl gap-10 px-6 py-10 lg:grid-cols-[1fr_380px]">
        <form id="checkout-form" onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
          <h2 className="font-display text-3xl text-russet">1. Sizi harada qarşılayaq?</h2>

          <div>
            <label htmlFor="address" className={labelClass}>
              Çatdırılma ünvanı
            </label>
            <textarea id="address" rows={3} className={inputClass} {...register("address")} />
            {errors.address && (
              <p className="mt-1 text-sm text-fire">{errors.address.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="phone" className={labelClass}>
              Telefon
            </label>
            <input id="phone" type="tel" className={inputClass} {...register("phone")} />
            {errors.phone && (
              <p className="mt-1 text-sm text-fire">{errors.phone.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="note" className={labelClass}>
              Qeyd (ixtiyari)
            </label>
            <textarea id="note" rows={2} className={inputClass} {...register("note")} />
            {errors.note && (
              <p className="mt-1 text-sm text-fire">{errors.note.message}</p>
            )}
          </div>

          <h2 className="pt-4 font-display text-3xl text-russet">2. Necə ödəmək istəyirsiniz?</h2>

          <fieldset className="grid gap-3 sm:grid-cols-2">
            <legend className="sr-only">Ödəniş üsulu</legend>
            <label className={payClass}>
              <input type="radio" value="CASH" className="accent-forest" {...register("paymentMethod")} />
              Nağd
            </label>
            <label className={payClass}>
              <input type="radio" value="CARD" className="accent-forest" {...register("paymentMethod")} />
              Kart (simulyasiya)
            </label>
          </fieldset>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full rounded-md bg-fire py-3 text-sm font-bold text-white disabled:opacity-50 lg:hidden"
          >
            {isLoading ? "Göndərilir..." : "Sifarişi təsdiqlə"}
          </button>
        </form>

        <aside className="h-fit rounded-2xl bg-cream p-6">
          <h2 className="font-display text-2xl text-russet">Sifariş xülasəsi</h2>
          <ul className="mt-4 space-y-2 border-b border-russet/20 pb-4 text-sm text-russet">
            {items.map((i) => (
              <li key={i.productId} className="flex justify-between gap-3">
                <span>
                  {i.quantity} × {i.name}
                </span>
                <span>{formatPrice(i.price * i.quantity)}</span>
              </li>
            ))}
          </ul>
          <div className="mt-4 space-y-2 border-b border-russet/20 pb-4 text-sm text-russet">
            <div className="flex justify-between">
              <span>Məhsullar</span>
              <span>{formatPrice(subtotal)}</span>
            </div>
            <div className="flex justify-between">
              <span>Çatdırılma</span>
              <span>{formatPrice(DELIVERY_FEE)}</span>
            </div>
          </div>
          <div className="mt-4 flex items-baseline justify-between text-russet">
            <span className="font-display text-xl">Cəmi</span>
            <span className="font-display text-2xl">
              {formatPrice(subtotal + DELIVERY_FEE)}
            </span>
          </div>

          <button
            type="submit"
            form="checkout-form"
            disabled={isLoading}
            className="mt-6 hidden w-full rounded-md bg-fire py-3 text-sm font-bold text-white disabled:opacity-50 lg:block"
          >
            {isLoading ? "Göndərilir..." : `Sifarişi təsdiqlə · ${formatPrice(subtotal + DELIVERY_FEE)}`}
          </button>
        </aside>
      </div>
    </>
  );
}