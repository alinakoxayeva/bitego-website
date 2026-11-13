import { useState } from "react";
import { Link } from "react-router";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { useGetAdminOrdersQuery } from "@/features/admin/adminApi";
import {
  useGetRevenueStatsQuery,
  useGetStatsSummaryQuery,
  useGetStatusBreakdownQuery,
  useGetTopProductsQuery,
} from "@/features/admin/statsApi";
import type { OrderStatus } from "@/features/orders/types";
import StatusBadge from "@/components/common/StatusBadge";
import { STATUS_LABELS } from "@/lib/orderStatus";
import { formatDate, formatPrice } from "@/lib/format";

const POLL = 30000; // 30 saniyədən bir yenilənir

const STATUS_CHART_COLORS: Record<OrderStatus, string> = {
  PENDING: "#F5C065",
  CONFIRMED: "#A9776F",
  PREPARING: "#C9852B",
  ON_THE_WAY: "#6E433D",
  DELIVERED: "#31603D",
  CANCELLED: "#D23D2D",
};

function StatCard({ label, value, hint }: { label: string; value: string; hint?: string }) {
  return (
    <div className="rounded-xl border bg-white p-4">
      <p className="text-sm text-gray-500">{label}</p>
      <p className="mt-1 text-2xl font-bold">{value}</p>
      {hint && <p className="mt-1 text-xs text-gray-500">{hint}</p>}
    </div>
  );
}

function ChartCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="rounded-xl border bg-white p-4">
      <h2 className="mb-3 font-semibold">{title}</h2>
      {children}
    </section>
  );
}

const shortDate = (iso: string) => iso.slice(5).split("-").reverse().join(".");

export default function AdminDashboard() {
  const [days, setDays] = useState<7 | 30>(7);

  const { data: summary, isLoading: summaryLoading, isError: summaryError } =
    useGetStatsSummaryQuery(undefined, { pollingInterval: POLL });
  const { data: revenue } = useGetRevenueStatsQuery(days, { pollingInterval: POLL });
  const { data: topProducts } = useGetTopProductsQuery(undefined, { pollingInterval: POLL });
  const { data: breakdown } = useGetStatusBreakdownQuery(undefined, { pollingInterval: POLL });
  const { data: recent } = useGetAdminOrdersQuery({ page: 1, limit: 5 }, { pollingInterval: POLL });

  const pieData = (breakdown ?? []).map((b) => ({
    name: STATUS_LABELS[b.status],
    value: b.count,
    status: b.status,
  }));

  if (summaryError) {
    return (
      <div className="rounded-md border border-red-200 bg-red-50 p-4 text-red-700">
        Statistikanı yükləmək mümkün olmadı.
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Dashboard</h1>

      {summaryLoading && (
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-24 animate-pulse rounded-xl bg-gray-200" />
          ))}
        </div>
      )}

      {summary && (
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          <StatCard label="Bu gün sifariş" value={String(summary.ordersToday)} />
          <StatCard label="Bu gün gəlir" value={formatPrice(summary.revenueToday)} />
          <StatCard
            label="Gözləyən sifarişlər"
            value={String(summary.pendingOrders)}
            hint="Status: Gözləyir"
          />
          <StatCard
            label="İstifadəçilər"
            value={String(summary.totalUsers)}
            hint={`Bu həftə yeni: ${summary.newUsersThisWeek}`}
          />
        </div>
      )}

      <ChartCard title="Gəlir">
        <div className="mb-3 flex gap-2">
          {([7, 30] as const).map((d) => (
            <button
              key={d}
              onClick={() => setDays(d)}
              className={`rounded-full border px-3 py-1 text-sm ${
                days === d ? "bg-orange-500 text-white" : ""
              }`}
            >
              Son {d} gün
            </button>
          ))}
        </div>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={revenue ?? []}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" tickFormatter={shortDate} fontSize={12} />
              <YAxis fontSize={12} />
              <Tooltip
                labelFormatter={(label) => shortDate(String(label))}
                formatter={(value) => [formatPrice(Number(value)), "Gəlir"]}
              />
              <Line type="monotone" dataKey="revenue" stroke="#f97316" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </ChartCard>

      <div className="grid gap-6 lg:grid-cols-2">
        <ChartCard title="Sifarişlərin status paylanması">
          {pieData.length === 0 ? (
            <p className="py-12 text-center text-sm text-gray-500">Hələ məlumat yoxdur.</p>
          ) : (
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={pieData} dataKey="value" nameKey="name" innerRadius={50} outerRadius={85}>
                    {pieData.map((p) => (
                      <Cell key={p.status} fill={STATUS_CHART_COLORS[p.status]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          )}
        </ChartCard>

        <ChartCard title="Ən çox satılan 5 məhsul">
          {!topProducts || topProducts.length === 0 ? (
            <p className="py-12 text-center text-sm text-gray-500">Hələ məlumat yoxdur.</p>
          ) : (
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={topProducts} layout="vertical" margin={{ left: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" allowDecimals={false} fontSize={12} />
                  <YAxis type="category" dataKey="name" width={110} fontSize={12} />
                  <Tooltip formatter={(value) => [String(value), "Satış (ədəd)"]} />
                  <Bar dataKey="quantity" fill="#f97316" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
        </ChartCard>
      </div>

      <ChartCard title="Son sifarişlər">
        {!recent || recent.items.length === 0 ? (
          <p className="py-6 text-center text-sm text-gray-500">Hələ sifariş yoxdur.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="border-b text-gray-600">
                <tr>
                  <th className="py-2 pr-4">№</th>
                  <th className="py-2 pr-4">Müştəri</th>
                  <th className="py-2 pr-4">Məbləğ</th>
                  <th className="py-2 pr-4">Status</th>
                  <th className="py-2 pr-4">Tarix</th>
                  <th className="py-2" />
                </tr>
              </thead>
              <tbody>
                {recent.items.map((o) => (
                  <tr key={o.id} className="border-b last:border-0">
                    <td className="py-2 pr-4 font-medium">#{o.orderNumber}</td>
                    <td className="py-2 pr-4">{o.user.name}</td>
                    <td className="py-2 pr-4">{formatPrice(o.total)}</td>
                    <td className="py-2 pr-4">
                      <StatusBadge status={o.status} />
                    </td>
                    <td className="py-2 pr-4 text-gray-600">{formatDate(o.createdAt)}</td>
                    <td className="py-2 text-right">
                      <Link to={`/admin/orders/${o.id}`} className="text-orange-600 underline">
                        Bax
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </ChartCard>
    </div>
  );
}