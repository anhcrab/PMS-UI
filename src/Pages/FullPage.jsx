import Auth from "./Authentication/Auth";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import ClientLayout from "../Layouts/Client/ClientLayout";
import HomePage from "./HomePage/HomePage";
import AdminLayout from "../Layouts/Admin/AdminLayout";
import Page404 from "./Page404/Page404";
import Dashboard from "./Dashboard/Dashboard";
import Profile from "./Profile/Profile";
import Settings from "./Settings/Settings";
import Employee from "./Employee/Employee";
import Projects from "./Project/Projects";
import Task from "./Task/Task";

const router = createBrowserRouter([
  {
    path: "/",
    element: <ClientLayout />,
    children: [
      {
        path: "/",
        element: <HomePage />,
      },
      {
        path: "Auth/*",
        element: <Auth />,
        children: [
          {
            path: ':action',
            element: <Auth />
          }
        ],
      },
    ],
  },
  {
    path: "/Admin/*",
    element: <AdminLayout />,
    children: [
      {
        path: "Dashboard",
        element: <Dashboard />,
      },
      {
        path: "Profile",
        element: <Profile />,
      },
      {
        path: "Employees",
        element: <Employee />,
      },
      {
        path: "Projects",
        element: <Projects />,
      },
      {
        path: "Tasks",
        element: <Task />,
      },
      {
        path: "Settings",
        element: <Settings />,
      },
    ],
  },
  {
    path: "*",
    element: <Page404 />,
  },
]);

const FullPage = () => {
  return (
    <>
      <RouterProvider router={router} />
    </>
  );
};
export default FullPage;
