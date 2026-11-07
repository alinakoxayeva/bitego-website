import { baseApi } from "@/app/api/baseApi";
import type { OrderStatus } from "@/features/orders/types";

export interface StatsSummary {
  ordersToday: number;
  revenueToday: number;
  pendingOrders: number;
  totalUsers: number;
  newUsersThisWeek: number;
}

export interface RevenuePoint {
  date: string;
  revenue: number;
  orders: number;
}

export interface TopProduct {
  productId: string;
  name: string;
  quantity: number;
}

export interface StatusCount {
  status: OrderStatus;
  count: number;
}

export const statsApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getStatsSummary: build.query<StatsSummary, void>({
      query: () => "/admin/stats/summary",
      providesTags: [{ type: "Stats", id: "LIST" }],
    }),
    getRevenueStats: build.query<RevenuePoint[], number>({
      query: (days) => ({ url: "/admin/stats/revenue", params: { days } }),
      providesTags: [{ type: "Stats", id: "LIST" }],
    }),
    getTopProducts: build.query<TopProduct[], void>({
      query: () => "/admin/stats/top-products",
      providesTags: [{ type: "Stats", id: "LIST" }],
    }),
    getStatusBreakdown: build.query<StatusCount[], void>({
      query: () => "/admin/stats/status-breakdown",
      providesTags: [{ type: "Stats", id: "LIST" }],
    }),
  }),
});

export const {
  useGetStatsSummaryQuery,
  useGetRevenueStatsQuery,
  useGetTopProductsQuery,
  useGetStatusBreakdownQuery,
} = statsApi;