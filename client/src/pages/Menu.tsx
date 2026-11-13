import { useEffect, useState } from "react";
import { useSearchParams } from "react-router";
import { Search } from "lucide-react";
import { useGetCategoriesQuery, useGetProductsQuery } from "../features/products/productsApi";
import ProductCard from "../components/common/ProductCard";
import { useDebounce } from "../hooks/useDebounce";

export default function Menu() {
  const [params, setParams] = useSearchParams();
  const category = params.get("category") ?? "";
  const sort = params.get("sort") ?? "newest";
  const page = Number(params.get("page") ?? 1);
  const urlSearch = params.get("search") ?? "";

  const [searchText, setSearchText] = useState(urlSearch);
  const debouncedSearch = useDebounce(searchText, 400);

  function update(changes: Record<string, string>) {
    setParams(
      (prev) => {
        const next = new URLSearchParams(prev);
        for (const [key, value] of Object.entries(changes)) {
          if (value) next.set(key, value);
          else next.delete(key);
        }
        return next;
      },
      { replace: true },
    );
  }

  useEffect(() => {
    if (debouncedSearch === urlSearch) return;
    update({ search: debouncedSearch, page: "" });
  }, [debouncedSearch]);

  const { data: categories } = useGetCategoriesQuery();
  const { data, isLoading, isFetching, isError, refetch } = useGetProductsQuery({
    search: urlSearch || undefined,
    category: category || undefined,
    sort,
    page,
    limit: 12,
  });

  const pillBase =
    "rounded-lg px-5 py-2.5 text-sm font-bold transition";
  const pillActive = "bg-forest text-cream";
  const pillIdle = "bg-cream text-russet hover:bg-saffron/40";

  return (
    <>
      {/* Başlıq bölməsi */}
      <section className="bg-cream">
        <div className="mx-auto max-w-7xl px-6 py-12">
          <p className="mb-3 text-xs font-bold uppercase tracking-widest text-fire">
            Mətbəxdən təzə-təzə
          </p>
          <h1 className="font-display text-4xl text-russet md:text-6xl">
            Növbəti favoritini tap.
          </h1>
          <p className="mt-3 text-russet">
            Sifarişlə hazırlanır. Əhvalınızı düzəltmək üçün.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-10">
        {/* Axtarış və çeşidləmə */}
        <div className="mb-5 flex flex-col gap-3 sm:flex-row">
          <div className="relative w-full sm:max-w-sm">
            <Search
              size={16}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-russet/50"
            />
            <input
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              placeholder="Yemək və ya tərkib axtar..."
              className="w-full rounded-lg border border-cream bg-paper py-2.5 pl-9 pr-3 text-sm text-russet outline-none focus:border-fire"
            />
          </div>
          <select
            value={sort}
            onChange={(e) => update({ sort: e.target.value, page: "" })}
            className="rounded-lg border border-cream bg-paper px-3 py-2.5 text-sm text-russet outline-none focus:border-fire"
          >
            <option value="newest">Ən yenilər</option>
            <option value="price_asc">Qiymət: ucuzdan bahaya</option>
            <option value="price_desc">Qiymət: bahadan ucuza</option>
            <option value="name">Ada görə</option>
          </select>
        </div>

        {/* Kateqoriyalar */}
        <div className="mb-8 flex flex-wrap gap-3">
          <button
            onClick={() => update({ category: "", page: "" })}
            className={`${pillBase} ${!category ? pillActive : pillIdle}`}
          >
            Hamısı
          </button>
          {categories?.map((c) => (
            <button
              key={c.id}
              onClick={() => update({ category: c.slug, page: "" })}
              className={`${pillBase} ${category === c.slug ? pillActive : pillIdle}`}
            >
              {c.name}
            </button>
          ))}
        </div>

        {isLoading && (
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="h-72 animate-pulse rounded-2xl bg-cream" />
            ))}
          </div>
        )}

        {isError && (
          <div className="rounded-md border border-red-200 bg-red-50 p-4">
            <p className="text-red-700">Məhsulları yükləmək mümkün olmadı.</p>
            <button onClick={() => refetch()} className="mt-2 underline">
              Yenidən cəhd et
            </button>
          </div>
        )}

        {data && data.items.length === 0 && (
          <p className="py-12 text-center text-russet/70">Heç nə tapılmadı.</p>
        )}

        {data && data.items.length > 0 && (
          <>
            <div
              className={`grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4 ${
                isFetching ? "opacity-60" : ""
              }`}
            >
              {data.items.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>

            <div className="mt-10 flex items-center justify-center gap-4">
              <button
                disabled={page <= 1}
                onClick={() => update({ page: String(page - 1) })}
                className="rounded-lg bg-cream px-4 py-2 text-sm font-bold text-russet disabled:opacity-40"
              >
                Əvvəlki
              </button>
              <span className="text-sm text-russet">
                {data.page} / {data.totalPages}
              </span>
              <button
                disabled={page >= data.totalPages}
                onClick={() => update({ page: String(page + 1) })}
                className="rounded-lg bg-cream px-4 py-2 text-sm font-bold text-russet disabled:opacity-40"
              >
                Növbəti
              </button>
            </div>
          </>
        )}

        <p className="mt-10 text-center text-xs text-russet/70">
          Qida allergiyanız var? Sifarişdən əvvəl bizə bildirin.
        </p>
      </section>
    </>
  );
}