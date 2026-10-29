import { baseApi } from "@/app/api/baseApi";
import type { User } from "./authSlice";

interface AuthResponse {
  token: string;
  user: User;
}

export const authApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    login: build.mutation<AuthResponse, { email: string; password: string }>({
      query: (body) => ({ url: "/auth/login", method: "POST", body }),
    }),
    register: build.mutation<
      AuthResponse,
      { name: string; email: string; phone?: string; password: string }
    >({
      query: (body) => ({ url: "/auth/register", method: "POST", body }),
    }),
    getMe: build.query<{ user: User }, void>({
      query: () => "/auth/me",
      providesTags: ["User"],
    }),
  }),
});

export const { useLoginMutation, useRegisterMutation, useGetMeQuery } = authApi;