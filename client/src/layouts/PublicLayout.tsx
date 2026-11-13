import Navbar from "@/components/common/Navbar";
import { Outlet } from "react-router";
import Footer from "@/components/common/Footer";

export default function PublicLayout() {
  return (
    <>
      <Navbar />
      <main className="mx-auto max-w-6xl px-4 py-6">
        <Outlet />
      </main>
      <Footer/>
    </>
  );
}