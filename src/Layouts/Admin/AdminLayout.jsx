import { Outlet } from "react-router-dom";
import HeaderAdmin from "../../Components/HeaderAdmin/HeaderAdmin";
import Sidebar from "../../Components/Sidebar/Sidebar";
import "./AdminLayout.scss";
import { authenticate } from "../../Utils/utils";
import { createContext, useEffect, useState } from "react";
import AdminLoading from "../../Components/AdminLoading/AdminLoading";
import Notifycation from "../../Components/Notification/Notifycation";
import api from "../../Utils/api";
import { Show } from "../../Components/Show/Show";

export const AdminContext = createContext();

const AdminLayout = () => {
  const [loading, setLoading] = useState(true);
  const [notification, setNotification] = useState([
    {
      status: "show",
      type: "default",
      title: "Hệ thống",
      time: Date.now(),
      content: "Chào mừng bạn đến với Terus.",
    },
  ]);
  const [accessControl, setAccessControl] = useState({
    role: "CLIENT",
  });
  useEffect(() => {
    api
      .get("auth/role")
      .then((res) => {
        setAccessControl({
          ...accessControl,
          role: res.data.toUpperCase(),
        });
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);
  return (
    <>
      {authenticate("/Auth", true)}
      <Show>
        <Show.When isTrue={loading}>
          <AdminLoading />
        </Show.When>
        <Show.Else>
          <AdminContext.Provider
            value={{
              notification,
              setNotification,
              accessControl,
              setAccessControl,
            }}
          >
            <div id="terus-admin">
              <div id="terus-admin__top">
                <HeaderAdmin />
              </div>
              <div id="terus-admin__body">
                <Sidebar />
                <main id="terus-admin__body-main">
                  <Outlet />
                  <Notifycation />
                </main>
              </div>
            </div>
          </AdminContext.Provider>
        </Show.Else>
      </Show>
    </>
  );
};

export default AdminLayout;
