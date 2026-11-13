import Navbar from "@/components/common/Navbar";
import { Outlet } from "react-router";
import Footer from "@/components/common/Footer";

export default function PublicLayout() {
  return (
    <>
      <Navbar />
      <main>
        <Outlet />
      </main>
      <Footer/>
    </>
  );
}