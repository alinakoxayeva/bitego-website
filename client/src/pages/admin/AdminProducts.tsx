import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router";
import { toast } from "sonner";
import { useAppDispatch } from "@/app/hooks";
import {
  adminApi,
  useDeleteProductMutation,
  useGetAdminCategoriesQuery,
  useGetAdminProductsQuery,
  useToggleProductAvailabilityMutation,
} from "@/features/admin/adminApi";
import { useDebounce } from "@/hooks/useDebounce";
import { getErrorMessage } from "@/lib/errors";
import { formatPrice } from "@/lib/format";

export default function AdminProducts() {
  const dispatch = useAppDispatch();
  const [params, setParams] = useSearchParams();
  const category = params.get("category") ?? "";
  const page = Number(params.get("page") ?? 1);
  const urlSearch = params.get("search") ?? "";

  const [searchText, setSearchText] = useState(urlSearch);
  const debounced = useDebounce(searchText, 400);

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
    if (debounced !== urlSearch) update({ search: debounced, page: "" });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debounced]);

  const listArgs = {
    search: urlSearch || undefined,
    category: category || undefined,
    page,
    limit: 10,
  };

  const { data: categories } = useGetAdminCategoriesQuery();
  const { data, isLoading, isFetching, isError, refetch } = useGetAdminProductsQuery(listArgs);
  const [toggle] = useToggleProductAvailabilityMutation();
  const [deleteProduct, { isLoading: isDeleting }] = useDeleteProductMutation();

  async function handleToggle(id: string, isAvailable: boolean) {
    // Əvvəl ekranı dəyiş (optimistic), sonra serverə göndər
    const patch = dispatch(
      adminApi.util.updateQueryData("getAdminProducts", listArgs, (draft) => {
        const item = draft.items.find((p) => p.id === id);
        if (item) item.isAvailable = isAvailable;
      }),
    );
    try {
      await toggle({ id, isAvailable }).unwrap();
    } catch (err) {
      patch.undo(); // xəta olsa, köhnə vəziyyətə qaytar
      toast.error(getErrorMessage(err));
    }
  }

  async function handleDelete(id: string, name: string) {
    if (!window.confirm(`"${name}" məhsulunu silmək istədiyinizə əminsiniz?`)) return;
    try {
      const result = await deleteProduct(id).unwrap();
      toast.success(
        result.deactivated
          ? "Məhsul sifarişlərdə istifadə olunub, ona görə silinmədi, deaktiv edildi"
          : "Məhsul silindi",
      );
    } catch (err) {
      toast.error(getErrorMessage(err));
    }
  }

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Məhsullar</h1>
        <Link
          to="/admin/products/new"
          className="rounded-md bg-orange-500 px-4 py-2 text-sm font-medium text-white"
        >
          + Yeni məhsul
        </Link>
      </div>

      <div className="mb-4 flex flex-col gap-3 md:flex-row">
        <input
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          placeholder="Məhsul axtar..."
          className="rounded-md border px-3 py-2 md:w-64"
        />
        <select
          value={category}
          onChange={(e) => update({ category: e.target.value, page: "" })}
          className="rounded-md border px-3 py-2"
        >
          <option value="">Bütün kateqoriyalar</option>
          {categories?.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>
      </div>

      {isLoading && <div className="h-60 animate-pulse rounded-xl bg-gray-200" />}

      {isError && (
        <div className="rounded-md border border-red-200 bg-red-50 p-4">
          <p className="text-red-700">Məhsulları yükləmək mümkün olmadı.</p>
          <button onClick={() => refetch()} className="mt-2 underline">
            Yenidən cəhd et
          </button>
        </div>
      )}

      {data && data.items.length === 0 && (
        <p className="py-12 text-center text-gray-500">Məhsul tapılmadı.</p>
      )}

      {data && data.items.length > 0 && (
        <>
          <div
            className={`overflow-x-auto rounded-xl border bg-white ${isFetching ? "opacity-60" : ""}`}
          >
            <table className="w-full text-left text-sm">
              <thead className="border-b bg-gray-50 text-gray-600">
                <tr>
                  <th className="px-4 py-3">Şəkil</th>
                  <th className="px-4 py-3">Ad</th>
                  <th className="px-4 py-3">Kateqoriya</th>
                  <th className="px-4 py-3">Qiymət</th>
                  <th className="px-4 py-3">Mövcuddur</th>
                  <th className="px-4 py-3" />
                </tr>
              </thead>
              <tbody>
                {data.items.map((p) => (
                  <tr key={p.id} className="border-b last:border-0">
                    <td className="px-4 py-3">
                      <img
                        src={p.imageUrl}
                        alt={p.name}
                        loading="lazy"
                        className="h-12 w-16 rounded-md object-cover"
                      />
                    </td>
                    <td className="px-4 py-3 font-medium">{p.name}</td>
                    <td className="px-4 py-3 text-gray-600">{p.category.name}</td>
                    <td className="px-4 py-3">{formatPrice(p.price)}</td>
                    <td className="px-4 py-3">
                      <label className="inline-flex cursor-pointer items-center">
                        <input
                          type="checkbox"
                          checked={p.isAvailable}
                          onChange={(e) => handleToggle(p.id, e.target.checked)}
                          className="h-4 w-4 accent-orange-500"
                        />
                        <span className="ml-2 text-xs text-gray-600">
                          {p.isAvailable ? "Bəli" : "Bitib"}
                        </span>
                      </label>
                    </td>
                    <td className="space-x-3 px-4 py-3 text-right">
                      <Link
                        to={`/admin/products/${p.id}/edit`}
                        className="text-orange-600 underline"
                      >
                        Redaktə
                      </Link>
                      <button
                        onClick={() => handleDelete(p.id, p.name)}
                        disabled={isDeleting}
                        className="text-red-600 underline disabled:opacity-50"
                      >
                        Sil
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-6 flex items-center justify-center gap-4">
            <button
              disabled={page <= 1}
              onClick={() => update({ page: String(page - 1) })}
              className="rounded-md border px-3 py-1 disabled:opacity-40"
            >
              Əvvəlki
            </button>
            <span className="text-sm">
              {data.page} / {data.totalPages} ({data.total} məhsul)
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