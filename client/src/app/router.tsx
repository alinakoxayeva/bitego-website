import { createBrowserRouter } from "react-router";
import PublicLayout from "@/layouts/PublicLayout";
import AdminLayout from "@/layouts/AdminLayout";
import Home from "@/pages/Home";
import Menu from "@/pages/Menu";
import Login from "@/pages/Login";
import Register from "@/pages/Register";
import NotFound from "@/pages/NotFound";
import AdminDashboard from "@/pages/AdminDashboard";

export const router = createBrowserRouter ([
    {
        element: <PublicLayout/>,
        children: [
            {index: true, element: <Home/>},
            {path: 'menu', element: <Menu/>},
            {path: 'login', element: <Login/>},
            {path: 'register', element: <Register/>},
        ],
    },
    {
        path: 'admin',
        element: <AdminLayout/>,
        children: [{ index: true, element: <AdminDashboard/>}],
    },
    {path: '*', element: <NotFound/>},
])