import { Outlet } from "react-router-dom";
import HeaderAdmin from "../../Components/HeaderAdmin/HeaderAdmin";
import Sidebar from "../../Components/Sidebar/Sidebar";
import "./AdminLayout.scss";
import { authenticate } from "../../Utils/utils";
import { createContext, useEffect, useState } from "react";
import AdminLoading from "../../Components/AdminLoading/AdminLoading";
import Notification from "../../Components/Notification/Notification";
import api from "../../Utils/api";
import { Show } from "../../Components/Show/Show";
// import Avatar1 from '../../assets/imgs/Avatar1.svg';
// import Avatar2 from '../../assets/imgs/Avatar2.svg';
// import Avatar3 from '../../assets/imgs/Avatar3.svg';
// import Avatar4 from '../../assets/imgs/Avatar4.svg';
// import Avatar5 from '../../assets/imgs/Avatar5.svg';
// import Avatar6 from '../../assets/imgs/Avatar6.svg';

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
  const [heading, setHeading] = useState();
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
      {authenticate("/Auth/Login", true)}
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
              heading,
              setHeading,
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
                  <div className="w-100 text-end px-4" style={{ height: "50px" }}>
                    © 2024, Made by{" "}
                    <a
                      href="https://terusvn.com"
                      style={{ color: "var(--gradient-gold)" }}
                    >
                      Terus
                    </a>
                  </div>
                </main>
                <Notification />
              </div>
            </div>
          </AdminContext.Provider>
        </Show.Else>
      </Show>
    </>
  );
};

export default AdminLayout;
