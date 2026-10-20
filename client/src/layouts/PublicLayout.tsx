import { Link, Outlet } from "react-router";

export default function PublicLayout() {
  return (
    <div>
      <header>
        <nav>
            <Link to="/">BiteGo</Link>
            <Link to="/menu">Menyu</Link>
            <Link to="/login">Giriş</Link>
        </nav>
      </header>
      <main>
        <Outlet/>
      </main>
    </div>
  );
}
