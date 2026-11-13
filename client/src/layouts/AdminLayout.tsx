import { useState } from "react";
import { Link, NavLink, Outlet, useNavigate } from "react-router";
import { baseApi } from "@/app/api/baseApi";
import { useAppDispatch, useAppSelector } from "@/app/hooks";
import { logout } from "@/features/auth/authSlice";

const links = [
  { to: "/admin", label: "Dashboard", end: true },
  { to: "/admin/orders", label: "Sifarişlər" },
  { to: "/admin/products", label: "Məhsullar" },
  { to: "/admin/categories", label: "Kateqoriyalar" },
  { to: "/admin/users", label: "İstifadəçilər" },
];

export default function AdminLayout() {
  const [open, setOpen] = useState(false);
  const user = useAppSelector((s) => s.auth.user);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  function handleLogout() {
    dispatch(logout());
    dispatch(baseApi.util.resetApiState());
    navigate("/login");
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      {open && (
        <div
          className="fixed inset-0 z-20 bg-black/40 md:hidden"
          onClick={() => setOpen(false)}
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-30 w-60 transform border-r bg-white p-4 transition-transform md:static md:translate-x-0 ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <p className="mb-6 text-xl font-bold text-orange-500">Savor Admin</p>
        <nav className="flex flex-col gap-1">
          {links.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              end={l.end}
              onClick={() => setOpen(false)}
              className={({ isActive }) =>
                `rounded-md px-3 py-2 text-sm ${
                  isActive ? "bg-orange-500 font-medium text-white" : "text-gray-700 hover:bg-gray-100"
                }`
              }
            >
              {l.label}
            </NavLink>
          ))}
        </nav>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex items-center justify-between border-b bg-white px-4 py-3">
          <button
            className="rounded-md border px-3 py-1 text-sm md:hidden"
            onClick={() => setOpen(true)}
            aria-label="Menyunu aç"
          >
            ☰ Menyu
          </button>
          <div className="ml-auto flex items-center gap-4 text-sm">
            <Link to="/" className="underline">
              Sayta qayıt
            </Link>
            <span className="text-gray-600">{user?.name}</span>
            <button onClick={handleLogout} className="rounded-md border px-3 py-1">
              Çıxış
            </button>
          </div>
        </header>

        <main className="flex-1 p-4 md:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}