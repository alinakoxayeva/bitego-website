import { Link } from "react-router";
import { Plus } from "lucide-react";
import type { Product } from "../../features/products/types";
import { formatPrice } from "../../lib/format";

export default function ProductCard({ product }: { product: Product }) {
  return (
    <Link
      to={`/menu/${product.id}`}
      className="group block rounded-2xl border border-cream bg-paper p-3 transition hover:shadow-md"
    >
      <div className="relative overflow-hidden rounded-xl">
        <img
          src={product.imageUrl}
          alt={product.name}
          loading="lazy"
          className={`aspect-4/3 w-full object-cover transition group-hover:scale-105 ${
            !product.isAvailable ? "opacity-50 grayscale" : ""
          }`}
        />
        <span className="absolute left-3 top-3 rounded-md bg-cream px-3 py-1 text-xs font-bold text-forest">
          {product.category.name}
        </span>
        {!product.isAvailable && (
          <span className="absolute right-3 top-3 rounded-md bg-russet px-3 py-1 text-xs font-bold text-white">
            Bitib
          </span>
        )}
      </div>

      <div className="px-1 pt-3">
        <h3 className="font-display text-lg leading-snug text-russet">
          {product.name}
        </h3>
        {product.description && (
          <p className="mt-1 line-clamp-1 text-sm text-russet/70">
            {product.description}
          </p>
        )}

        <div className="mt-3 flex items-center justify-between">
          <span className="font-bold text-russet">
            {formatPrice(product.price)}
          </span>
          <span
            className={`flex size-8 items-center justify-center rounded-md text-white ${
              product.isAvailable ? "bg-fire" : "bg-russet/40"
            }`}
          >
            <Plus size={16} />
          </span>
        </div>
      </div>
    </Link>
  );
}
