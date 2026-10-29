import { Navigate, Outlet, useLocation } from "react-router";
import { useAuthStatus } from "@/features/auth/useAuthStatus";

export default function AdminRoute() {
  const { user, isLoading } = useAuthStatus();
  const location = useLocation();

  if (isLoading) return <div className="p-8 text-center">Yüklənir...</div>;
  if (!user) return <Navigate to="/login" replace state={{ from: location }} />;
  if (user.role !== "ADMIN") return <Navigate to="/403" replace />;

  return <Outlet />;
}