import { Link, NavLink, useNavigate } from "react-router";
import { ShoppingCart } from "lucide-react";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { baseApi } from "@/app/api/baseApi";
import { logout } from "../../features/auth/authSlice";
import { selectCartCount } from "@/features/cart/selectors";
import { useAuthStatus } from "@/features/auth/useAuthStatus";

export default function Navbar() {
  useAuthStatus();
  const user = useAppSelector((s) => s.auth.user);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const cartCount = useAppSelector(selectCartCount);

  function handleLogout() {
    dispatch(logout());
    dispatch(baseApi.util.resetApiState());
    navigate("/");
  }

  const linkClass = ({ isActive }: { isActive: boolean }) =>
    `border-b-2 pb-1 text-sm ${
      isActive ? "border-fire text-fire" : "border-transparent text-russet"
    }`;

  return (
    <header>
      <div className="bg-forest py-1.5 text-center text-xs text-cream">
        A little joy, delivered. • Free delivery on your first order over $30
      </div>

      <nav className="border-b border-cream bg-paper">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <Link to="/" className="font-display text-3xl text-fire">
            savor.
          </Link>

          <div className="hidden gap-10 md:flex">
            <NavLink to="/" end className={linkClass}>Ana səhifə</NavLink>
            <NavLink to="/menu" className={linkClass}>Menyu</NavLink>
            <NavLink to="/about" className={linkClass}>Haqqımızda</NavLink>
            {user && <NavLink to="/orders" className={linkClass}>Sifarişlərim</NavLink>}
            {user?.role === "ADMIN" && (
              <NavLink to="/admin" className={linkClass}>Admin panel</NavLink>
            )}
          </div>

          <div className="flex items-center gap-4 text-sm">
            {user ? (
              <>
                <span className="hidden font-bold text-russet sm:inline">{user.name}</span>
                <button
                  onClick={handleLogout}
                  className="font-bold text-russet hover:text-fire"
                >
                  Çıxış
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="font-bold text-russet hover:text-fire">
                  Daxil ol
                </Link>
                <Link
                  to="/register"
                  className="hidden rounded-md border border-russet px-4 py-2 font-bold text-russet sm:inline"
                >
                  Qeydiyyat
                </Link>
              </>
            )}

            <Link
              to="/cart"
              className="flex items-center gap-2 rounded-md bg-fire px-5 py-2.5 font-bold text-white"
            >
              <ShoppingCart size={16} />
              Səbət ({cartCount})
            </Link>
          </div>
        </div>
      </nav>
    </header>
  );
}