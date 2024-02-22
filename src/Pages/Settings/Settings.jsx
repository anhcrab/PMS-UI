import { useContext, useEffect, useState } from "react";
import "./Settings.scss";
import Loading from "../../Components/Loading/Loading";
import SettingGeneral from "../../Components/SettingGeneral/SettingGeneral";
import { Navigate, useSearchParams } from "react-router-dom";
import { Show } from "../../Components/Show/Show";
import List from "../../Components/List/List";
import { AdminContext } from "../../Layouts/Admin/AdminLayout";

const Settings = () => {
  const { accessControl } = useContext(AdminContext)
  const userCols = [
    {
      key: "userName",
      name: "Tên tài khoản",
    },
    {
      key: "email",
      name: "Email",
    },
    {
      key: "id",
      name: "UUID",
    },
  ];
  const userEndpoint = "users";
  const userActions = {
    watch: {
      isAllowed: false,
    },
    edit: {
      isAllowed: false,
    },
    delete: {
      isAllowed: true,
    },
  };
  const roleCols = [
    {
      key: "name",
      name: "Tên",
    },
    {
      key: "id",
      name: "Mã số Role",
    },
  ];
  const roleEndpoint = "roles";
  const roleActions = {
    turnOn: false,
    watch: {
      isAllowed: false,
    },
    edit: {
      isAllowed: true,
    },
    delete: {
      isAllowed: false,
    },
  };
  const [urlParams, setUrlParams] = useSearchParams();
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 1 * 1000);
  }, [urlParams]);
  return (
    <>
      <Show>
        <Show.When isTrue={accessControl.role === 'ADMIN'}>
          {loading && <Loading />}
          <div id="terus-settings" data-bs-theme="dark">
            <nav className="terus-content__nav">
              <div className="row">
                <div className="col-lg-12">
                  <ul className="terus-settings__navigation">
                    <li
                      className={`terus-settings__nav-items${
                        urlParams.get("Page") === "General" ? " active" : ""
                      }`}
                      onClick={() => {
                        setUrlParams({ Page: "General" });
                      }}
                    >
                      <i className="bi bi-sliders"></i> Cài đặt chung
                    </li>
                    <li
                      className={`terus-settings__nav-items ${
                        urlParams.get("Page") === "Users" ? " active" : ""
                      }`}
                      onClick={() => {
                        setUrlParams({ Page: "Users" });
                      }}
                    >
                      <i className="bi bi-person-gear"></i> Tài khoản
                    </li>
                    <li
                      className={`terus-settings__nav-items${
                        urlParams.get("Page") === "Roles" ? " active" : ""
                      }`}
                      onClick={() => {
                        setUrlParams({ Page: "Roles" });
                      }}
                    >
                      <i className="bi bi-person-vcard-fill"></i> Vai trò
                    </li>
                    <li
                      className={`terus-settings__nav-items${
                        urlParams.get("Page") === "More" ? " active" : ""
                      }`}
                      onClick={() => {
                        setUrlParams({ Page: "More" });
                      }}
                    >
                      <i className="bi bi-usb-symbol"></i> Cài đặt thêm
                    </li>
                  </ul>
                </div>
              </div>
            </nav>
            <Show>
              <Show.When isTrue={urlParams.get("Page") === "General"}>
                <SettingGeneral />
              </Show.When>
              <Show.When isTrue={urlParams.get("Page") === "Users"}>
                <List
                  cols={userCols}
                  endpoint={userEndpoint}
                  actions={userActions}
                />
              </Show.When>
              <Show.When isTrue={urlParams.get("Page") === "Roles"}>
                <List
                  cols={roleCols}
                  endpoint={roleEndpoint}
                  actions={roleActions}
                  config={{ export: false, pagination: false }}
                />
              </Show.When>
              <Show.Else>Cai dat them</Show.Else>
            </Show>
          </div>
        </Show.When>
        <Show.Else>
          <Navigate to={'/PageNotFound'} />
          {accessControl.role}
        </Show.Else>
      </Show>
    </>
  );
};

export default Settings;
