import { useContext, useEffect } from "react";
import "./Settings.scss";
// import Loading from "../../Components/Loading/Loading";
import SettingGeneral from "../../Components/SettingGeneral/SettingGeneral";
import { Navigate, useSearchParams } from "react-router-dom";
import { Show } from "../../Components/Show/Show";
import { AdminContext } from "../../Layouts/Admin/AdminLayout";
import SettingRoles from "../../Components/SettingRoles/SettingRoles";
import SettingUsers from "../../Components/SettingUsers/SettingUsers";
import SettingProjectTypes from "../../Components/SettingProjectTypes/SettingProjectTypes";

const Settings = () => {
  const { accessControl, setHeading } = useContext(AdminContext);
  const [urlParams, setUrlParams] = useSearchParams();
  // const [loading, setLoading] = useState(true);

  useEffect(() => {
    setHeading("Cài đặt");
    if (!urlParams.has("Page")) {
      setUrlParams({ Page: "General" });
    }
  }, []);

  return (
    <>
      <Show>
        <Show.When isTrue={accessControl.role === "ADMIN"}>
          {/* {loading && <Loading />} */}
          <div id="terus-settings" className="p-4" data-bs-theme="dark">
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
                        urlParams.get("Page") === "Project-Types"
                          ? " active"
                          : ""
                      }`}
                      onClick={() => {
                        setUrlParams({ Page: "Project-Types" });
                      }}
                    >
                      <i className="bi bi-archive-fill"></i> Loại dự án
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
                <SettingUsers />
              </Show.When>
              <Show.When isTrue={urlParams.get("Page") === "Roles"}>
                <SettingRoles />
              </Show.When>
              <Show.When
                isTrue={urlParams.get("Page") === "Project-Types"}
              >
                <SettingProjectTypes />
              </Show.When>
              <Show.Else>Cai dat them</Show.Else>
            </Show>
          </div>
        </Show.When>
        <Show.Else>
          <Navigate to={"/PageNotFound"} />
          {accessControl.role}
        </Show.Else>
      </Show>
    </>
  );
};

// const DEPARTMENT = {
//   [0]: "Không có",
//   [1]: "Phòng kinh doanh",
//   [2]: "Phòng marketing",
//   [3]: "Phòng hành chính",
//   [4]: "Phòng nhân sự",
//   [5]: "Phòng kế toán",
// };

// const EMPLOYEESTATUS = {
//   [0]: "FREE",
//   [1]: "EMPLOYED",
//   [2]: "FIRED",
//   [3]: "RETIRED",
// };

export default Settings;
