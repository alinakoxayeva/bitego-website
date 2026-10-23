import { Link, Outlet } from "react-router";

export default function PublicLayout() {
  return (
    <div>
      <header className="flex items-center justify-center gap-5 p-3 bg-[#FCEEC9]">
        <nav className="flex gap-3 p-3 no-underline">
            <Link to="/" className="focus:bg-[#FFBD52] px-4 py-2 rounded-lg">Home</Link>
            <Link to="/menu" className="focus:bg-[#FFBD52] px-4 py-2 rounded-lg">Menyu</Link>
            <Link to="/login" className="focus:bg-[#FFBD52] px-4 py-2 rounded-lg">Giriş</Link>
        </nav>
      </header>
      <main>
        <Outlet/>
      </main>
    </div>
  );
}
