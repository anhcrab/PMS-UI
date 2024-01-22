// import { Route, Router, Routes } from "react-router-dom"
import Auth from "./Authentication/Auth";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import ClientLayout from "../Layouts/Client/ClientLayout";
import HomePage from "./HomePage/HomePage";
import AdminLayout from "../Layouts/Admin/AdminLayout";
import Page404 from "./Page404/Page404";
import Dashboard from "./Dashboard/Dashboard";
import Profile from "./Profile/Profile";
import Logout from "../Components/Logout/Logout";
import Modules from "../Layouts/Modules/Modules";
import Settings from "./Settings/Settings";

const router = createBrowserRouter([
  {
    path: "/",
    element: <ClientLayout />,
    children: [
      {
        path: '/',
        element: <HomePage />
      },
      {
        path: "Auth/*",
        element: <Auth />,
        children: [{
          path: 'Logout',
          element: <Logout />
        }]
      },
    ],
  },
  {
    path: '/Admin/*',
    element: <AdminLayout />,
    children: [
      {
        path: 'Dashboard',
        element: <Dashboard />
      },
      {
        path: 'Profile',
        element: <Profile />
      },
      {
        path: 'Modules/:slug',
        element: <Modules />
      },
      {
        path: 'Settings',
        element: <Settings />
      }
    ]
  },
  {
    path: '*',
    element: <Page404 />
  }
]);

const FullPage = () => {
  return (
    <>
      <RouterProvider router={router} />
    </>
  );
};
export default FullPage;
