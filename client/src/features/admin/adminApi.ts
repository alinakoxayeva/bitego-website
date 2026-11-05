import { baseApi } from "@/app/api/baseApi";
import type { OrderStatus } from "@/features/orders/types";
import type { AdminOrder, AdminOrdersQuery, Paginated } from "./types";

export const adminApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getAdminOrders: build.query<Paginated<AdminOrder>, AdminOrdersQuery>({
      query: (params) => ({ url: "/admin/orders", params }),
      providesTags: (result) => [
        ...(result?.items ?? []).map(({ id }) => ({ type: "Order" as const, id })),
        { type: "Order", id: "LIST" },
      ],
    }),
    getAdminOrderById: build.query<AdminOrder, string>({
      query: (id) => `/admin/orders/${id}`,
      providesTags: (_result, _error, id) => [{ type: "Order", id }],
    }),
    updateOrderStatus: build.mutation<
      AdminOrder,
      { id: string; status: OrderStatus; cancelReason?: string }
    >({
      query: ({ id, ...body }) => ({
        url: `/admin/orders/${id}/status`,
        method: "PATCH",
        body,
      }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: "Order", id },
        { type: "Order", id: "LIST" },
      ],
    }),
  }),
});

export const {
  useGetAdminOrdersQuery,
  useGetAdminOrderByIdQuery,
  useUpdateOrderStatusMutation,
} = adminApi;