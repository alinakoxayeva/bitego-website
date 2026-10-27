import { createBrowserRouter } from "react-router";
import PublicLayout from "@/layouts/PublicLayout";
import AdminLayout from "@/layouts/AdminLayout";
import Home from "@/pages/Home";
import Menu from "@/pages/Menu";
import Login from "@/pages/Login";
import Register from "@/pages/Register";
import NotFound from "@/pages/NotFound";
import AdminDashboard from "@/pages/AdminDashboard";
import ProductDetail from "@/pages/ProductDetail";
import Cart from "@/pages/Cart";

export const router = createBrowserRouter([
  {
    element: <PublicLayout />,
    children: [
      { index: true, element: <Home /> },
      { path: "menu", element: <Menu /> },
      { path: "login", element: <Login /> },
      { path: "register", element: <Register /> },
      { path: "/menu/:id", element: <ProductDetail /> },
      { path: "/cart", element: <Cart /> },
    ],
  },
  {
    path: "admin",
    element: <AdminLayout />,
    children: [{ index: true, element: <AdminDashboard /> }],
  },
  { path: "*", element: <NotFound /> },
]);
