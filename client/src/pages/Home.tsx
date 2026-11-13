import { Link } from "react-router";
import ProductCard from "@/components/common/ProductCard";
import {
  useGetCategoriesQuery,
  useGetProductsQuery,
} from "@/features/products/productsApi";
import Hero from "@/components/common/home/Hero";
import Band from "@/components/common/home/Band";

const steps = [
  { title: "Seç", text: "Menyudan istədiyin yeməyi tap və səbətə at." },
  {
    title: "Sifariş ver",
    text: "Ünvanını yaz, ödəniş üsulunu seç və təsdiqlə.",
  },
  { title: "İzlə", text: "Sifarişinin statusunu canlı olaraq izlə." },
];

export default function Home() {
  const { data: categories, isLoading: categoriesLoading } =
    useGetCategoriesQuery();
  const {
    data: featured,
    isLoading: featuredLoading,
    isError: featuredError,
    refetch,
  } = useGetProductsQuery({ featured: true, limit: 8 });

  return (
    <>
      <Hero />
      <Band />

      {/* Kateqoriyalar */}
      <section className="mx-auto max-w-7xl px-6 py-14">
        <p className="mb-8 text-xs font-bold uppercase tracking-widest text-fire">
          Nə yemək istəyirsiniz?
        </p>

        {categoriesLoading && (
          <div className="grid grid-cols-3 gap-6 md:grid-cols-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="text-center">
                <div className="mx-auto size-24 animate-pulse rounded-full bg-cream md:size-28" />
                <div className="mx-auto mt-3 h-3 w-16 animate-pulse rounded bg-cream" />
              </div>
            ))}
          </div>
        )}

        {categories && categories.length > 0 && (
          <div className="grid grid-cols-3 gap-6 md:grid-cols-6">
            {categories.map((c) => (
              <Link
                key={c.id}
                to={`/menu?category=${c.slug}`}
                className="group text-center"
              >
                <div className="mx-auto size-24 overflow-hidden rounded-full bg-cream ring-2 ring-cream transition group-hover:ring-fire md:size-28">
                  {c.imageUrl && (
                    <img
                      src={c.imageUrl}
                      alt={c.name}
                      loading="lazy"
                      className="h-full w-full object-cover transition group-hover:scale-105"
                    />
                  )}
                </div>
                <p className="mt-3 text-sm font-bold text-russet">{c.name}</p>
              </Link>
            ))}
          </div>
        )}
      </section>

      {/* Məşhur yeməklər */}
      <section className="mx-auto max-w-7xl px-6 pb-14">
        <p className="mb-2 text-xs font-bold uppercase tracking-widest text-fire">
          Ən çox sevilənlər
        </p>
        <div className="mb-8 flex items-end justify-between">
          <h2 className="font-display text-4xl text-russet md:text-5xl">
            İlk tikədən sevgi.
          </h2>
          <Link to="/menu" className="text-sm font-bold text-fire">
            Hamısına bax ↗
          </Link>
        </div>

        {featuredLoading && (
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="h-72 animate-pulse rounded-2xl bg-cream" />
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
          <p className="py-8 text-center text-russet/70">
            Hələ seçilmiş məhsul yoxdur.
          </p>
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
      <section className="mx-auto max-w-7xl px-6 pb-20">
        <p className="mb-2 text-xs font-bold uppercase tracking-widest text-fire">
          Mətbəximizdən sizə
        </p>
        <h2 className="mb-8 font-display text-4xl text-russet md:text-5xl">
          Hər şey çox asandır.
        </h2>
        <div className="grid gap-8 md:grid-cols-3">
          {steps.map((s, i) => (
            <div key={s.title} className="flex items-start gap-4">
              <span className="flex size-10 shrink-0 items-center justify-center rounded-md bg-cream text-sm font-bold text-russet">
                0{i + 1}
              </span>
              <div>
                <h3 className="font-bold text-russet">{s.title}</h3>
                <p className="mt-1 text-sm text-russet/80">{s.text}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}