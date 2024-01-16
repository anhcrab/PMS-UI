import { Outlet } from "react-router-dom";
import HeaderAdmin from "../../Components/HeaderAdmin/HeaderAdmin";
import Sidebar from "../../Components/Sidebar/Sidebar";
import "./AdminLayout.scss";
import { authenticate } from "../../Utils/utils";
import { createContext, useEffect, useState } from "react";

export const AdminContext = createContext();

const AdminLayout = () => {
  const [modules, setModules] = useState([]);
  useEffect(() => {
    // Fetch api lấy thông tin về các modules.
    const fakeData = [
      {
        name: "Nhân sự",
        iconClass: "bi bi-people",
        slug: "Employment",
        component: "vị trí đến file js, css, img, ...",
      },
      {
        name: "Dự án",
        iconClass: "bi bi-suitcase-lg",
        slug: "Project",
        component: "",
      },
    ];
    setModules(fakeData);
  }, []);
  return (
    <>
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
