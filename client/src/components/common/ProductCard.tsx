import { Link } from "react-router";
import type { Product } from "../../features/products/types";
import { formatPrice } from "../../lib/format";

export default function ProductCard({ product }: { product: Product }) {
  return (
    <Link
      to={`/menu/${product.id}`}
      className="block overflow-hidden rounded-xl border bg-white shadow-sm transition hover:shadow-md"
    >
      <img
        src={product.imageUrl}
        alt={product.name}
        loading="lazy"
        className="aspect-4/3 w-full object-cover"
      />
      <div className="p-3">
        <p className="text-xs text-gray-500">{product.category.name}</p>
        <h3 className="font-semibold">{product.name}</h3>
        <div className="mt-2 flex items-center justify-between">
          <span className="font-bold text-orange-600">{formatPrice(product.price)}</span>
          {!product.isAvailable && <span className="text-xs text-red-600">Bitib</span>}
        </div>
      </div>
    </Link>
  );
}