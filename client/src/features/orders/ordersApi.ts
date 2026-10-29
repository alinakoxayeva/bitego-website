import { baseApi } from "@/app/api/baseApi";
import type { CreateOrderBody, Order } from "./types";

export const ordersApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    createOrder: build.mutation<Order, CreateOrderBody>({
      query: (body) => ({ url: "/orders", method: "POST", body }),
      invalidatesTags: [{ type: "Order", id: "LIST" }],
    }),
    getMyOrders: build.query<Order[], void>({
      query: () => "/orders/my",
      providesTags: (result) => [
        ...(result ?? []).map(({ id }) => ({ type: "Order" as const, id })),
        { type: "Order", id: "LIST" },
      ],
    }),
    getOrderById: build.query<Order, string>({
      query: (id) => `/orders/${id}`,
      providesTags: (_result, _error, id) => [{ type: "Order", id }],
    }),
    cancelOrder: build.mutation<Order, { id: string; reason?: string }>({
      query: ({ id, reason }) => ({
        url: `/orders/${id}/cancel`,
        method: "PATCH",
        body: { reason },
      }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: "Order", id },
        { type: "Order", id: "LIST" },
      ],
    }),
  }),
});

export const {
  useCreateOrderMutation,
  useGetMyOrdersQuery,
  useGetOrderByIdQuery,
  useCancelOrderMutation,
} = ordersApi;