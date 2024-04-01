import { Outlet } from "react-router-dom";
import HeaderAdmin from "../../Components/HeaderAdmin/HeaderAdmin";
import Sidebar from "../../Components/Sidebar/Sidebar";
import "./AdminLayout.scss";
import { authenticate, isOnMobile } from "../../Utils/utils";
import { createContext, useEffect, useState } from "react";
import AdminLoading from "../../Components/AdminLoading/AdminLoading";
// import Notification from "../../Components/Notification/Notification";
import api from "../../Utils/api";
import { Show } from "../../Components/Show/Show";

export const AdminContext = createContext();

const AdminLayout = () => {
  const [loading, setLoading] = useState(true);
  const  [minimize, setMinimize] = useState(isOnMobile());
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
              minimize,
              setMinimize
            }}
          >
            <div id="terus-admin">
              <div onClick={() => {
                setMinimize(!minimize)
              }} className={`terus-sidebar-backdrop ${minimize ? 'minimized' : ''}`}></div>
              <Sidebar />
              <div id="terus-admin__body" className={minimize ? 'minimized' : ''}>
                <div id="terus-admin__body-top">
                  <HeaderAdmin />
                </div>
                <main id="terus-admin__body-main">
                  <Outlet />
                  <div
                    className="w-100 text-end px-4"
                    style={{ height: "50px" }}
                  >
                    © 2024, Made by{" "}
                    <a
                      href="https://terusvn.com"
                      style={{ color: "var(--gradient-gold)" }}
                    >
                      Terus
                    </a>
                  </div>
                </main>
                {/* <Notification /> */}
              </div>
            </div>
          </AdminContext.Provider>
        </Show.Else>
      </Show>
    </>
  );
};

export default AdminLayout;
