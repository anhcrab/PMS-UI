import { Outlet } from "react-router-dom";
import HeaderAdmin from "../../Components/HeaderAdmin/HeaderAdmin";
import Sidebar from "../../Components/Sidebar/Sidebar";
import "./AdminLayout.scss";
import { authenticate } from "../../Utils/utils";
import { createContext, useEffect, useState } from "react";
import AdminLoading from "../../Components/AdminLoading/AdminLoading";
import Notifycation from "../../Components/Notification/Notifycation";

export const AdminContext = createContext();

const AdminLayout = () => {
  const [loading, setLoading] = useState(true);
  const [notification, setNotification] = useState([
    {
      status: "show",
      type: 'default',
      title: "Terus",
      time: Date.now(),
      content: "Chào mừng quay trở lại.",
    },
  ]);
  useEffect(() => {
    setLoading(false);
  }, []);
  return (
    <>
      {loading && <AdminLoading />}
      {trackingAuth()}
      <AdminContext.Provider value={{ notification, setNotification }}>
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
    </>
  );
};

const trackingAuth = () => {
  authenticate("/Auth", true);
  setInterval(() => {
    authenticate("/Auth", true);
  }, 10 * 60 * 1000);
};

export default AdminLayout;
