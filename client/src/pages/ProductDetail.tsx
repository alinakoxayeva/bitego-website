import { useState } from "react";
import { Link, useParams } from "react-router";
import { ArrowLeft, Minus, Plus } from "lucide-react";
import { toast } from "sonner";
import { useAppDispatch } from "@/app/hooks";
import { useGetProductByIdQuery } from "@/features/products/productsApi";
import { addItem } from "@/features/cart/cartSlice";
import { formatPrice } from "@/lib/format";

export default function ProductDetail() {
  const { id } = useParams();
  const dispatch = useAppDispatch();
  const [quantity, setQuantity] = useState(1);

  const {
    data: product,
    isLoading,
    isError,
  } = useGetProductByIdQuery(id ?? "", {
    skip: !id,
  });

  if (isLoading) {
    return (
      <div className="mx-auto grid max-w-7xl gap-10 px-6 py-10 md:grid-cols-2">
        <div className="aspect-4/3 animate-pulse rounded-3xl bg-cream" />
        <div className="space-y-4">
          <div className="h-4 w-24 animate-pulse rounded bg-cream" />
          <div className="h-10 w-2/3 animate-pulse rounded bg-cream" />
          <div className="h-20 animate-pulse rounded bg-cream" />
        </div>
      </div>
    );
  }

  if (isError || !product) {
    return (
      <div className="py-20 text-center text-russet">
        <p>Məhsul tapılmadı.</p>
        <Link to="/menu" className="mt-2 inline-block font-bold text-fire underline">
          Menyuya qayıt
        </Link>
      </div>
    );
  }

  function handleAdd() {
    if (!product) return;
    dispatch(
      addItem({
        productId: product.id,
        name: product.name,
        price: Number(product.price),
        imageUrl: product.imageUrl,
        quantity,
      }),
    );
    toast.success(`${product.name} səbətə əlavə olundu`);
  }

  return (
    <section className="mx-auto max-w-7xl px-6 py-10">
      <Link
        to="/menu"
        className="mb-6 inline-flex items-center gap-2 text-sm font-bold text-fire"
      >
        <ArrowLeft size={14} /> Menyuya qayıt
      </Link>

      <div className="grid items-start gap-10 md:grid-cols-2">
        <div className="relative">
          <img
            src={product.imageUrl}
            alt={product.name}
            className={`aspect-4/3 w-full rounded-3xl object-cover ${
              !product.isAvailable ? "opacity-60 grayscale" : ""
            }`}
          />
        </div>

        <div>
          <span className="inline-block rounded-md bg-cream px-3 py-1 text-xs font-bold text-forest">
            {product.category.name}
          </span>
          <h1 className="mt-4 font-display text-4xl leading-tight text-russet md:text-5xl">
            {product.name}
          </h1>
          <p className="mt-4 max-w-md text-russet/80">{product.description}</p>
          <p className="mt-6 font-display text-3xl text-russet">
            {formatPrice(product.price)}
          </p>

          {product.isAvailable ? (
            <div className="mt-8 flex flex-wrap items-center gap-4">
              <div className="flex items-center gap-4 rounded-md bg-cream px-3 py-3">
                <button
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  className="text-russet"
                  aria-label="Azalt"
                >
                  <Minus size={16} />
                </button>
                <span className="w-6 text-center font-bold text-russet">{quantity}</span>
                <button
                  onClick={() => setQuantity((q) => q + 1)}
                  className="text-russet"
                  aria-label="Artır"
                >
                  <Plus size={16} />
                </button>
              </div>
              <button
                onClick={handleAdd}
                className="rounded-md bg-fire px-8 py-3 text-sm font-bold text-white transition hover:opacity-90"
              >
                Səbətə at
              </button>
            </div>
          ) : (
            <p className="mt-8 rounded-md bg-russet/10 px-4 py-3 text-sm font-bold text-russet">
              Hazırda mövcud deyil
            </p>
          )}

          <p className="mt-8 text-xs text-russet/70">
            Qida allergiyanız var? Sifarişdən əvvəl bizə bildirin.
          </p>
        </div>
      </div>
    </section>
  );
}