import { baseApi } from "@/app/api/baseApi";
import type { Category, Product, ProductsQuery, ProductsResponse } from "./types";

export const productsApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getCategories: build.query<Category[], void>({
      query: () => "/categories",
      providesTags: [{ type: "Category", id: "LIST" }],
    }),
    getProducts: build.query<ProductsResponse, ProductsQuery>({
      query: (params) => ({ url: "/products", params }),
      providesTags: (result) => [
        ...(result?.items ?? []).map(({ id }) => ({ type: "Product" as const, id })),
        { type: "Product", id: "LIST" },
      ],
    }),
    getProductById: build.query<Product, string>({
      query: (id) => `/products/${id}`,
      providesTags: (_result, _error, id) => [{ type: "Product", id }],
    }),
  }),
});

export const { useGetCategoriesQuery, useGetProductsQuery, useGetProductByIdQuery } =
  productsApi;