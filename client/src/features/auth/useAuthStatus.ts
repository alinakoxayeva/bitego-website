import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/app/hooks";
import { useGetMeQuery } from "./authApi";
import { logout } from "./authSlice";

export function useAuthStatus() {
  const dispatch = useAppDispatch();
  const token = useAppSelector((s) => s.auth.token);
  const user = useAppSelector((s) => s.auth.user);

  const { isError } = useGetMeQuery(undefined, { skip: !token || !!user });

  useEffect(() => {
    if (isError) dispatch(logout());
  }, [isError, dispatch]);

  const isLoading = !!token && !user && !isError;
  return { user, isLoading };
}