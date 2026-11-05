import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router";
import { useGetAdminOrdersQuery } from "@/features/admin/adminApi";
import type { OrderStatus } from "@/features/orders/types";
import StatusBadge from "@/components/common/StatusBadge";
import { useDebounce } from "@/hooks/useDebounce";
import { STATUS_LABELS } from "@/lib/orderStatus";
import { formatDate, formatPrice } from "@/lib/format";

export default function AdminOrders() {
  const [params, setParams] = useSearchParams();
  const status = (params.get("status") ?? "") as OrderStatus | "";
  const from = params.get("from") ?? "";
  const to = params.get("to") ?? "";
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

  const { data, isLoading, isFetching, isError, refetch } = useGetAdminOrdersQuery(
    {
      status: status || undefined,
      search: urlSearch || undefined,
      from: from || undefined,
      to: to || undefined,
      page,
      limit: 10,
    },
    { pollingInterval: 20000 },
  );

  return (
    <div>
      <h1 className="mb-4 text-2xl font-bold">Sifarişlər</h1>

      <div className="mb-4 flex flex-col gap-3 md:flex-row md:flex-wrap">
        <input
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          placeholder="Nömrə, ad və ya email..."
          className="rounded-md border px-3 py-2 md:w-64"
        />
        <select
          value={status}
          onChange={(e) => update({ status: e.target.value, page: "" })}
          className="rounded-md border px-3 py-2"
        >
          <option value="">Bütün statuslar</option>
          {(Object.keys(STATUS_LABELS) as OrderStatus[]).map((s) => (
            <option key={s} value={s}>
              {STATUS_LABELS[s]}
            </option>
          ))}
        </select>
        <input
          type="date"
          value={from}
          onChange={(e) => update({ from: e.target.value, page: "" })}
          className="rounded-md border px-3 py-2"
          aria-label="Başlanğıc tarix"
        />
        <input
          type="date"
          value={to}
          onChange={(e) => update({ to: e.target.value, page: "" })}
          className="rounded-md border px-3 py-2"
          aria-label="Son tarix"
        />
      </div>

      {isLoading && <div className="h-60 animate-pulse rounded-xl bg-gray-200" />}

      {isError && (
        <div className="rounded-md border border-red-200 bg-red-50 p-4">
          <p className="text-red-700">Sifarişləri yükləmək mümkün olmadı.</p>
          <button onClick={refetch} className="mt-2 underline">
            Yenidən cəhd et
          </button>
        </div>
      )}

      {data && data.items.length === 0 && (
        <p className="py-12 text-center text-gray-500">Sifariş tapılmadı.</p>
      )}

      {data && data.items.length > 0 && (
        <>
          <div
            className={`overflow-x-auto rounded-xl border bg-white ${isFetching ? "opacity-60" : ""}`}
          >
            <table className="w-full text-left text-sm">
              <thead className="border-b bg-gray-50 text-gray-600">
                <tr>
                  <th className="px-4 py-3">№</th>
                  <th className="px-4 py-3">Müştəri</th>
                  <th className="px-4 py-3">Məbləğ</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Ödəniş</th>
                  <th className="px-4 py-3">Tarix</th>
                  <th className="px-4 py-3" />
                </tr>
              </thead>
              <tbody>
                {data.items.map((o) => (
                  <tr key={o.id} className="border-b last:border-0">
                    <td className="px-4 py-3 font-medium">#{o.orderNumber}</td>
                    <td className="px-4 py-3">
                      <p>{o.user.name}</p>
                      <p className="text-xs text-gray-500">{o.user.email}</p>
                    </td>
                    <td className="px-4 py-3">{formatPrice(o.total)}</td>
                    <td className="px-4 py-3">
                      <StatusBadge status={o.status} />
                    </td>
                    <td className="px-4 py-3">{o.paymentMethod === "CASH" ? "Nağd" : "Kart"}</td>
                    <td className="px-4 py-3 text-gray-600">{formatDate(o.createdAt)}</td>
                    <td className="px-4 py-3 text-right">
                      <Link to={`/admin/orders/${o.id}`} className="text-orange-600 underline">
                        Bax
                      </Link>
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
              {data.page} / {data.totalPages} ({data.total} sifariş)
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