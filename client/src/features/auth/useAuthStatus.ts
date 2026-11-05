import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/app/hooks";
import { useGetMeQuery } from "./authApi";
import { logout, setUser } from "./authSlice";

export function useAuthStatus() {
  const dispatch = useAppDispatch();
  const token = useAppSelector((s) => s.auth.token);
  const user = useAppSelector((s) => s.auth.user);

  const { data, isError } = useGetMeQuery(undefined, { skip: !token || !!user });

  useEffect(() => {
    if (data?.user) dispatch(setUser(data.user));
  }, [data, dispatch]);

  useEffect(() => {
    if (isError) dispatch(logout());
  }, [isError, dispatch]);

  const isLoading = !!token && !user && !isError;
  return { user, isLoading };
}