import { Link, Outlet } from "react-router";

export default function AdminLayout() {
  return (
    <div className="flex">
      <aside>
        <p>Admin Panel</p>
        <nav>
          <Link to="/admin">Dashboard</Link>
        </nav>
      </aside>
      <main>
        <Outlet />
      </main>
    </div>
  );
}
