import { Outlet } from "react-router-dom";
import HeaderAdmin from "../../Components/HeaderAdmin/HeaderAdmin";
import Sidebar from "../../Components/Sidebar/Sidebar";
import "./AdminLayout.scss";
import { authenticate } from "../../Utils/utils";
import { createContext, useEffect, useState } from "react";
import api from "../../Utils/api";
import AdminLoading from "../../Components/AdminLoading/AdminLoading";

export const AdminContext = createContext();

const AdminLayout = () => {
  const [modules, setModules] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    // Fetch api lấy thông tin về các modules.
    api.get("modules").then((response) => {
      const { data } = response;
      console.log(data);
      const list = [];
      data.forEach((item) => {
        list.push(item);
      });
      setModules(list);
      setLoading(false);
    });
  }, []);
  return (
    <>
      {loading && <AdminLoading />}
      {authenticate("/Auth", true)}
      <AdminContext.Provider value={modules}>
        <div id="terus-admin">
          <div id="terus-admin__top">
            <HeaderAdmin />
          </div>
          <div id="terus-admin__body">
            <Sidebar />
            <main id="terus-admin__body-main">
              <Outlet />
            </main>
          </div>
        </div>
      </AdminContext.Provider>
    </>
  );
};

export default AdminLayout;
