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
    <div className="grid gap-8 md:grid-cols-2">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
        <h1 className="text-2xl font-bold">Sifarişin rəsmiləşdirilməsi</h1>

        <div>
          <label htmlFor="address" className="mb-1 block text-sm font-medium">
            Çatdırılma ünvanı
          </label>
          <textarea
            id="address"
            rows={3}
            className="w-full rounded-md border px-3 py-2"
            {...register("address")}
          />
          {errors.address && <p className="mt-1 text-sm text-red-600">{errors.address.message}</p>}
        </div>

        <div>
          <label htmlFor="phone" className="mb-1 block text-sm font-medium">
            Telefon
          </label>
          <input
            id="phone"
            type="tel"
            className="w-full rounded-md border px-3 py-2"
            {...register("phone")}
          />
          {errors.phone && <p className="mt-1 text-sm text-red-600">{errors.phone.message}</p>}
        </div>

        <div>
          <label htmlFor="note" className="mb-1 block text-sm font-medium">
            Qeyd (ixtiyari)
          </label>
          <textarea
            id="note"
            rows={2}
            className="w-full rounded-md border px-3 py-2"
            {...register("note")}
          />
          {errors.note && <p className="mt-1 text-sm text-red-600">{errors.note.message}</p>}
        </div>

        <fieldset>
          <legend className="mb-1 text-sm font-medium">Ödəniş üsulu</legend>
          <label className="mr-6 inline-flex items-center gap-2">
            <input type="radio" value="CASH" {...register("paymentMethod")} /> Nağd
          </label>
          <label className="inline-flex items-center gap-2">
            <input type="radio" value="CARD" {...register("paymentMethod")} /> Kart (simulyasiya)
          </label>
        </fieldset>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full rounded-md bg-orange-500 py-2 font-medium text-white disabled:opacity-50"
        >
          {isLoading ? "Göndərilir..." : "Sifarişi təsdiqlə"}
        </button>
      </form>

      <aside className="h-fit rounded-xl border bg-white p-4">
        <h2 className="mb-3 text-lg font-semibold">Sifariş xülasəsi</h2>
        <ul className="space-y-2 text-sm">
          {items.map((i) => (
            <li key={i.productId} className="flex justify-between">
              <span>
                {i.name} × {i.quantity}
              </span>
              <span>{formatPrice(i.price * i.quantity)}</span>
            </li>
          ))}
        </ul>
        <div className="mt-3 space-y-1 border-t pt-3 text-sm">
          <div className="flex justify-between">
            <span>Məhsullar</span>
            <span>{formatPrice(subtotal)}</span>
          </div>
          <div className="flex justify-between">
            <span>Çatdırılma</span>
            <span>{formatPrice(DELIVERY_FEE)}</span>
          </div>
          <div className="flex justify-between text-base font-bold">
            <span>Cəmi</span>
            <span>{formatPrice(subtotal + DELIVERY_FEE)}</span>
          </div>
        </div>
      </aside>
    </div>
  );
}