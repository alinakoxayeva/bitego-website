import { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router";
import { Menu, ShoppingCart, X } from "lucide-react";
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
  const [open, setOpen] = useState(false);

  function handleLogout() {
    dispatch(logout());
    dispatch(baseApi.util.resetApiState());
    setOpen(false);
    navigate("/");
  }

  const linkClass = ({ isActive }: { isActive: boolean }) =>
    `border-b-2 pb-1 text-sm ${
      isActive ? "border-fire text-fire" : "border-transparent text-russet"
    }`;

  const mobileLinkClass = ({ isActive }: { isActive: boolean }) =>
    `block py-3 text-base font-bold ${isActive ? "text-fire" : "text-russet"}`;

  const links = (
    <>
      <NavLink to="/" end className={open ? mobileLinkClass : linkClass} onClick={() => setOpen(false)}>
        Ana səhifə
      </NavLink>
      <NavLink to="/menu" className={open ? mobileLinkClass : linkClass} onClick={() => setOpen(false)}>
        Menyu
      </NavLink>
      <NavLink to="/about" className={open ? mobileLinkClass : linkClass} onClick={() => setOpen(false)}>
        Haqqımızda
      </NavLink>
      {user && (
        <NavLink to="/orders" className={open ? mobileLinkClass : linkClass} onClick={() => setOpen(false)}>
          Sifarişlərim
        </NavLink>
      )}
      {user?.role === "ADMIN" && (
        <NavLink to="/admin" className={open ? mobileLinkClass : linkClass} onClick={() => setOpen(false)}>
          Admin panel
        </NavLink>
      )}
    </>
  );

  return (
    <header>
      <div className="bg-forest py-1.5 text-center text-xs text-cream">
        Hər gün təzə hazırlanır • İlk sifarişdə çatdırılma pulsuz
      </div>

      <nav className="relative border-b border-cream bg-paper">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <Link to="/" className="font-display text-3xl text-fire">
            savor.
          </Link>

          {/* Masaüstü linkləri */}
          <div className="hidden gap-10 md:flex">{!open && links}</div>

          <div className="flex items-center gap-4 text-sm">
            {/* Masaüstü giriş/çıxış */}
            <div className="hidden items-center gap-4 md:flex">
              {user ? (
                <>
                  <span className="font-bold text-russet">{user.name}</span>
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
                    className="rounded-md border border-russet px-4 py-2 font-bold text-russet"
                  >
                    Qeydiyyat
                  </Link>
                </>
              )}
            </div>

            <Link
              to="/cart"
              className="flex items-center gap-2 rounded-md bg-fire px-4 py-2.5 font-bold text-white"
            >
              <ShoppingCart size={16} />
              <span className="hidden sm:inline">Səbət</span> ({cartCount})
            </Link>

            {/* Hamburger */}
            <button
              onClick={() => setOpen((v) => !v)}
              aria-label="Menyunu aç"
              className="text-russet md:hidden"
            >
              {open ? <X size={26} /> : <Menu size={26} />}
            </button>
          </div>
        </div>

        {/* Mobil açılan menyu */}
        {open && (
          <div className="border-t border-cream bg-paper px-6 pb-5 md:hidden">
            {links}
            <div className="mt-3 border-t border-cream pt-3">
              {user ? (
                <>
                  <p className="py-2 text-sm text-russet/70">{user.name}</p>
                  <button
                    onClick={handleLogout}
                    className="py-2 text-base font-bold text-fire"
                  >
                    Çıxış
                  </button>
                </>
              ) : (
                <div className="flex gap-3">
                  <Link
                    to="/login"
                    onClick={() => setOpen(false)}
                    className="flex-1 rounded-md border border-russet py-2.5 text-center text-sm font-bold text-russet"
                  >
                    Daxil ol
                  </Link>
                  <Link
                    to="/register"
                    onClick={() => setOpen(false)}
                    className="flex-1 rounded-md bg-fire py-2.5 text-center text-sm font-bold text-white"
                  >
                    Qeydiyyat
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}