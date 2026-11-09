import { Link } from "react-router";
import ProductCard from "@/components/common/ProductCard";
import {
  useGetCategoriesQuery,
  useGetProductsQuery,
} from "@/features/products/productsApi";

const steps = [
  { title: "Seç", text: "Menyudan istədiyin yeməyi tap və səbətə at." },
  { title: "Sifariş ver", text: "Ünvanını yaz, ödəniş üsulunu seç və təsdiqlə." },
  { title: "İzlə", text: "Sifarişinin statusunu canlı olaraq izlə." },
];

export default function Home() {
  const { data: categories, isLoading: categoriesLoading } = useGetCategoriesQuery();
  const {
    data: featured,
    isLoading: featuredLoading,
    isError: featuredError,
    refetch,
  } = useGetProductsQuery({ featured: true, limit: 8 });

  return (
    <div className="space-y-12">
      {/* Hero */}
      <section className="rounded-2xl bg-gradient-to-br from-orange-500 to-orange-400 px-6 py-12 text-white md:px-12 md:py-16">
        <h1 className="max-w-xl text-3xl font-bold md:text-5xl">
          Dadlı yeməklər, qapına qədər
        </h1>
        <p className="mt-3 max-w-lg text-orange-50 md:text-lg">
          BiteGo ilə sevdiyin yeməyi bir neçə kliklə sifariş et və statusunu canlı izlə.
        </p>
        <Link
          to="/menu"
          className="mt-6 inline-block rounded-md bg-white px-6 py-3 font-semibold text-orange-600"
        >
          Menyuya bax
        </Link>
      </section>

      {/* Kateqoriyalar */}
      <section>
        <h2 className="mb-4 text-2xl font-bold">Kateqoriyalar</h2>

        {categoriesLoading && (
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="h-28 animate-pulse rounded-xl bg-gray-200" />
            ))}
          </div>
        )}

        {categories && categories.length > 0 && (
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-6">
            {categories.map((c) => (
              <Link
                key={c.id}
                to={`/menu?category=${c.slug}`}
                className="group relative h-28 overflow-hidden rounded-xl bg-gray-200"
              >
                {c.imageUrl && (
                  <img
                    src={c.imageUrl}
                    alt={c.name}
                    loading="lazy"
                    className="h-full w-full object-cover transition group-hover:scale-105"
                  />
                )}
                <span className="absolute inset-0 flex items-end bg-gradient-to-t from-black/60 to-transparent p-3 font-semibold text-white">
                  {c.name}
                </span>
              </Link>
            ))}
          </div>
        )}
      </section>

      {/* Məşhur yeməklər */}
      <section>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-2xl font-bold">Məşhur yeməklər</h2>
          <Link to="/menu" className="text-sm text-orange-600 underline">
            Hamısına bax
          </Link>
        </div>

        {featuredLoading && (
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="h-60 animate-pulse rounded-xl bg-gray-200" />
            ))}
          </div>
        )}

        {featuredError && (
          <div className="rounded-md border border-red-200 bg-red-50 p-4">
            <p className="text-red-700">Məhsulları yükləmək mümkün olmadı.</p>
            <button onClick={() => refetch()} className="mt-2 underline">
              Yenidən cəhd et
            </button>
          </div>
        )}

        {featured && featured.items.length === 0 && (
          <p className="py-8 text-center text-gray-500">Hələ seçilmiş məhsul yoxdur.</p>
        )}

        {featured && featured.items.length > 0 && (
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
            {featured.items.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        )}
      </section>

      {/* Necə işləyir */}
      <section>
        <h2 className="mb-4 text-2xl font-bold">Necə işləyir?</h2>
        <div className="grid gap-4 md:grid-cols-3">
          {steps.map((s, i) => (
            <div key={s.title} className="rounded-xl border bg-white p-5">
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-orange-500 font-bold text-white">
                {i + 1}
              </span>
              <h3 className="mt-3 font-semibold">{s.title}</h3>
              <p className="mt-1 text-sm text-gray-600">{s.text}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}