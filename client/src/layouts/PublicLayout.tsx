import Navbar from "@/components/common/Navbar";
import { Outlet } from "react-router";

export default function PublicLayout() {
  return (
    <>
      <Navbar />
      <main className="mx-auto max-w-6xl px-4 py-6">
        <Outlet />
      </main>
    </>
  );
}