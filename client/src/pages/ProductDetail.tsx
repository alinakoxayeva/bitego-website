import { useState } from "react";
import { Link, useParams } from "react-router";
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
    return <div className="h-80 animate-pulse rounded-xl bg-gray-200" />;
  }

  if (isError || !product) {
    return (
      <div className="py-12 text-center">
        <p className="text-gray-600">Məhsul tapılmadı.</p>
        <Link to="/menu" className="mt-2 inline-block underline">
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
    <div className="grid gap-8 md:grid-cols-2">
      <img
        src={product.imageUrl}
        alt={product.name}
        className="aspect-4/3 w-full rounded-xl object-cover"
      />

      <div>
        <Link to="/menu" className="text-sm text-gray-500 underline">
          ← Menyuya qayıt
        </Link>
        <p className="mt-3 text-sm text-gray-500">{product.category.name}</p>
        <h1 className="text-3xl font-bold">{product.name}</h1>
        <p className="mt-2 text-gray-700">{product.description}</p>
        <p className="mt-4 text-2xl font-bold text-orange-600">
          {formatPrice(product.price)}
        </p>

        {product.isAvailable ? (
          <div className="mt-6 flex items-center gap-4">
            <div className="flex items-center gap-3 rounded-md border px-2 py-1">
              <button
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                className="px-2 text-lg"
                aria-label="Azalt"
              >
                −
              </button>
              <span className="w-6 text-center">{quantity}</span>
              <button
                onClick={() => setQuantity((q) => q + 1)}
                className="px-2 text-lg"
                aria-label="Artır"
              >
                +
              </button>
            </div>
            <button
              onClick={handleAdd}
              className="rounded-md bg-orange-500 px-6 py-2 font-medium text-white"
            >
              Səbətə at
            </button>
          </div>
        ) : (
          <p className="mt-6 font-medium text-red-600">Hazırda mövcud deyil</p>
        )}
      </div>
    </div>
  );
}
