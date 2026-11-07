import { baseApi } from "@/app/api/baseApi";
import type { OrderStatus } from "@/features/orders/types";
import type {
  AdminCategory,
  AdminOrder,
  AdminOrdersQuery,
  AdminProduct,
  AdminProductsQuery,
  Paginated,
  ProductFormBody,
} from "./types";

export const adminApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    // ---- Sifarişlər ----
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

    // ---- Kateqoriyalar ----
    getAdminCategories: build.query<AdminCategory[], void>({
      query: () => "/admin/categories",
      providesTags: [{ type: "Category", id: "LIST" }],
    }),

    // ---- Məhsullar ----
    getAdminProducts: build.query<Paginated<AdminProduct>, AdminProductsQuery>({
      query: (params) => ({ url: "/admin/products", params }),
      providesTags: (result) => [
        ...(result?.items ?? []).map(({ id }) => ({ type: "Product" as const, id })),
        { type: "Product", id: "LIST" },
      ],
    }),
    getAdminProductById: build.query<AdminProduct, string>({
      query: (id) => `/admin/products/${id}`,
      providesTags: (_result, _error, id) => [{ type: "Product", id }],
    }),
    createProduct: build.mutation<AdminProduct, ProductFormBody>({
      query: (body) => ({ url: "/admin/products", method: "POST", body }),
      invalidatesTags: [
        { type: "Product", id: "LIST" },
        { type: "Category", id: "LIST" },
      ],
    }),
    updateProduct: build.mutation<AdminProduct, { id: string; body: ProductFormBody }>({
      query: ({ id, body }) => ({ url: `/admin/products/${id}`, method: "PATCH", body }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: "Product", id },
        { type: "Product", id: "LIST" },
        { type: "Category", id: "LIST" },
      ],
    }),
    toggleProductAvailability: build.mutation<
      AdminProduct,
      { id: string; isAvailable: boolean }
    >({
      query: ({ id, isAvailable }) => ({
        url: `/admin/products/${id}`,
        method: "PATCH",
        body: { isAvailable },
      }),
      invalidatesTags: (_result, _error, { id }) => [{ type: "Product", id }],
    }),
    deleteProduct: build.mutation<{ deleted?: boolean; deactivated?: boolean }, string>({
      query: (id) => ({ url: `/admin/products/${id}`, method: "DELETE" }),
      invalidatesTags: [
        { type: "Product", id: "LIST" },
        { type: "Category", id: "LIST" },
      ],
    }),
  }),
});

export const {
  useGetAdminOrdersQuery,
  useGetAdminOrderByIdQuery,
  useUpdateOrderStatusMutation,
  useGetAdminCategoriesQuery,
  useGetAdminProductsQuery,
  useGetAdminProductByIdQuery,
  useCreateProductMutation,
  useUpdateProductMutation,
  useToggleProductAvailabilityMutation,
  useDeleteProductMutation,
} = adminApi;