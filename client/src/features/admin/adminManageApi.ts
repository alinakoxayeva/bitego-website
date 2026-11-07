import { baseApi } from "@/app/api/baseApi";
import type {
  AdminCategory,
  AdminUser,
  AdminUsersQuery,
  CategoryFormBody,
  Paginated,
  UserRole,
} from "./types";

export const adminManageApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    // ---- Kateqoriyalar ----
    createCategory: build.mutation<Omit<AdminCategory, "_count">, CategoryFormBody>({
      query: (body) => ({ url: "/admin/categories", method: "POST", body }),
      invalidatesTags: [{ type: "Category", id: "LIST" }],
    }),
    updateCategory: build.mutation<
      Omit<AdminCategory, "_count">,
      { id: string; body: Partial<CategoryFormBody> }
    >({
      query: ({ id, body }) => ({ url: `/admin/categories/${id}`, method: "PATCH", body }),
      invalidatesTags: [{ type: "Category", id: "LIST" }],
    }),
    deleteCategory: build.mutation<{ deleted: boolean }, string>({
      query: (id) => ({ url: `/admin/categories/${id}`, method: "DELETE" }),
      invalidatesTags: [{ type: "Category", id: "LIST" }],
    }),

    // ---- İstifadəçilər ----
    getAdminUsers: build.query<Paginated<AdminUser>, AdminUsersQuery>({
      query: (params) => ({ url: "/admin/users", params }),
      providesTags: (result) => [
        ...(result?.items ?? []).map(({ id }) => ({ type: "User" as const, id })),
        { type: "User", id: "LIST" },
      ],
    }),
    updateUserRole: build.mutation<AdminUser, { id: string; role: UserRole }>({
      query: ({ id, role }) => ({
        url: `/admin/users/${id}/role`,
        method: "PATCH",
        body: { role },
      }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: "User", id },
        { type: "User", id: "LIST" },
      ],
    }),
    setUserBlocked: build.mutation<AdminUser, { id: string; isBlocked: boolean }>({
      query: ({ id, isBlocked }) => ({
        url: `/admin/users/${id}/block`,
        method: "PATCH",
        body: { isBlocked },
      }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: "User", id },
        { type: "User", id: "LIST" },
      ],
    }),
  }),
});

export const {
  useCreateCategoryMutation,
  useUpdateCategoryMutation,
  useDeleteCategoryMutation,
  useGetAdminUsersQuery,
  useUpdateUserRoleMutation,
  useSetUserBlockedMutation,
} = adminManageApi;