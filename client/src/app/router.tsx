import { createBrowserRouter } from "react-router";
import PublicLayout from "@/layouts/PublicLayout";
import AdminLayout from "@/layouts/AdminLayout";
import ProtectedRoute from "@/routes/ProtectedRoute";
import AdminRoute from "@/routes/AdminRoute";
import Home from "@/pages/Home";
import Menu from "@/pages/Menu";
import Login from "@/pages/Login";
import Register from "@/pages/Register";
import NotFound from "@/pages/NotFound";
import Forbidden from "@/pages/Forbidden";
import AdminDashboard from "@/pages/AdminDashboard";
import ProductDetail from "@/pages/ProductDetail";
import Cart from "@/pages/Cart";
import Checkout from "@/pages/Checkout";
import OrderSuccess from "@/pages/OrderSuccess";

export const router = createBrowserRouter([
  {
    element: <PublicLayout />,
    children: [
      { index: true, element: <Home /> },
      { path: "menu", element: <Menu /> },
      { path: "menu/:id", element: <ProductDetail /> },
      { path: "cart", element: <Cart /> },
      { path: "login", element: <Login /> },
      { path: "register", element: <Register /> },
      { path: "403", element: <Forbidden /> },
      {
        element: <ProtectedRoute />,
        children: [
          { path: "checkout", element: <Checkout /> },
          { path: "order-success/:id", element: <OrderSuccess /> },
        ],
      },
    ],
  },
  {
    path: "admin",
    element: <AdminRoute />,
    children: [
      {
        element: <AdminLayout />,
        children: [{ index: true, element: <AdminDashboard /> }],
      },
    ],
  },
  { path: "*", element: <NotFound /> },
]);
