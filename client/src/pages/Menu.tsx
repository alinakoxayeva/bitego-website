import { useEffect, useState } from "react";
import { useSearchParams } from "react-router";
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

  return (
    <div>
      <h1 className="mb-4 text-2xl font-bold">Menyu</h1>

      <div className="mb-4 flex flex-col gap-3 sm:flex-row">
        <input
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          placeholder="Yemək axtar..."
          className="w-full rounded-md border px-3 py-2 sm:max-w-xs"
        />
        <select
          value={sort}
          onChange={(e) => update({ sort: e.target.value, page: "" })}
          className="rounded-md border px-3 py-2"
        >
          <option value="newest">Ən yenilər</option>
          <option value="price_asc">Qiymət: ucuzdan bahaya</option>
          <option value="price_desc">Qiymət: bahadan ucuza</option>
          <option value="name">Ada görə</option>
        </select>
      </div>

      <div className="mb-6 flex flex-wrap gap-2">
        <button
          onClick={() => update({ category: "", page: "" })}
          className={`rounded-full border px-3 py-1 text-sm ${!category ? "bg-orange-500 text-white" : ""}`}
        >
          Hamısı
        </button>
        {categories?.map((c) => (
          <button
            key={c.id}
            onClick={() => update({ category: c.slug, page: "" })}
            className={`rounded-full border px-3 py-1 text-sm ${category === c.slug ? "bg-orange-500 text-white" : ""}`}
          >
            {c.name}
          </button>
        ))}
      </div>

      {isLoading && (
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="h-60 animate-pulse rounded-xl bg-gray-200" />
          ))}
        </div>
      )}

      {isError && (
        <div className="rounded-md border border-red-200 bg-red-50 p-4">
          <p className="text-red-700">Məhsulları yükləmək mümkün olmadı.</p>
          <button onClick={refetch} className="mt-2 underline">
            Yenidən cəhd et
          </button>
        </div>
      )}

      {data && data.items.length === 0 && (
        <p className="py-12 text-center text-gray-500">Heç nə tapılmadı.</p>
      )}

      {data && data.items.length > 0 && (
        <>
          <div
            className={`grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4 ${isFetching ? "opacity-60" : ""}`}
          >
            {data.items.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>

          <div className="mt-8 flex items-center justify-center gap-4">
            <button
              disabled={page <= 1}
              onClick={() => update({ page: String(page - 1) })}
              className="rounded-md border px-3 py-1 disabled:opacity-40"
            >
              Əvvəlki
            </button>
            <span className="text-sm">
              {data.page} / {data.totalPages}
            </span>
            <button
              disabled={page >= data.totalPages}
              onClick={() => update({ page: String(page + 1) })}
              className="rounded-md border px-3 py-1 disabled:opacity-40"
            >
              Növbəti
            </button>
          </div>
        </>
      )}
    </div>
  );
}