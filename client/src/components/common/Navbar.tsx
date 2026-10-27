import { Link, useNavigate } from "react-router";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { baseApi } from "@/app/api/baseApi";
import { logout } from "../../features/auth/authSlice";
import { selectCartCount } from "@/features/cart/selectors";

export default function Navbar() {
  const user = useAppSelector((s) => s.auth.user);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const cartCount = useAppSelector(selectCartCount);

  function handleLogout() {
    dispatch(logout());
    dispatch(baseApi.util.resetApiState()); // köhnə istifadəçinin cache-i qalmasın
    navigate("/");
  }

  return (
    <header className="border-b bg-white">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <Link to="/" className="text-xl font-bold text-orange-500">
          Dadlı
        </Link>
        <Link to="/cart" className="relative">
          Səbət
          {cartCount > 0 && (
            <span className="ml-1 rounded-full bg-orange-500 px-2 py-0.5 text-xs text-white">
              {cartCount}
            </span>
          )}
        </Link>

        <div className="flex items-center gap-4 text-sm">
          <Link to="/menu">Menyu</Link>
          {user?.role === "ADMIN" && <Link to="/admin">Admin panel</Link>}
          {user ? (
            <>
              <span className="text-gray-600">{user.name}</span>
              <button
                onClick={handleLogout}
                className="rounded-md border px-3 py-1"
              >
                Çıxış
              </button>
            </>
          ) : (
            <>
              <Link to="/login">Daxil ol</Link>
              <Link
                to="/register"
                className="rounded-md bg-orange-500 px-3 py-1 text-white"
              >
                Qeydiyyat
              </Link>
            </>
          )}
        </div>
      </nav>
    </header>
  );
}
