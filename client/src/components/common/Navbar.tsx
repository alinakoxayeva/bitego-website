import { Link, useNavigate } from "react-router";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { baseApi } from "@/app/api/baseApi";
import { logout } from "../../features/auth/authSlice";
import { selectCartCount } from "@/features/cart/selectors";
import { useAuthStatus } from "@/features/auth/useAuthStatus";

export default function Navbar() {
  useAuthStatus();
  const user = useAppSelector((s) => s.auth.user);
  console.log("auth state:", useAppSelector((s) => s.auth));
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const cartCount = useAppSelector(selectCartCount);

  function handleLogout() {
    dispatch(logout());
    dispatch(baseApi.util.resetApiState()); 
    navigate("/");
  }

  return (
    <header className="border-b bg-white">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <Link to="/" className="text-xl font-bold text-orange-500">
          BiteGo
        </Link>

        <Link to="/menu">Menyu</Link>
        <div className="flex items-center gap-5 text-sm">
          <Link to="/cart" className="relative">
            <img
              src="https://static.vecteezy.com/system/resources/previews/019/787/018/non_2x/shopping-cart-icon-shopping-basket-on-transparent-background-free-png.png"
              className="w-9 inline-block "
            />
            {cartCount > 0 && (
              <span className="ml-1 rounded-full bg-orange-500 px-2 py-0.5 text-xs text-white">
                {cartCount}
              </span>
            )}
          </Link>
          {user?.role === "ADMIN" && <Link to="/admin">Admin panel</Link>}
          {user ? (
            <>
              <span className="text-gray-600">{user.name}</span>
              <Link to="/orders">Sifarişlərim</Link>
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
