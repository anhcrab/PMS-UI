import { useEffect, useState } from "react";
import "./Settings.scss";
import Loading from "../../Components/Loading/Loading";
import SettingModules from "../../Components/SettingModules/SettingModules";
import SettingGeneral from "../../Components/SettingGeneral/SettingGeneral";
import { useSearchParams } from "react-router-dom";

const Settings = () => {
  const [urlParams, setUrlParams] = useSearchParams();
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 1 * 1000);
  }, [urlParams]);
  return (
    <>
      {loading && <Loading />}
      <div id="terus-settings">
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
                  className={`terus-settings__nav-items modules${
                    urlParams.get("Page") === "Modules" ? " active" : ""
                  }`}
                  onClick={() => {
                    setUrlParams({
                      Page: "Modules",
                      Action: "List",
                    });
                  }}
                >
                  <i className="bi bi-plugin"></i> Modules
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
        {urlParams.get("Page") === "General" && <SettingGeneral />}
        {urlParams.get("Page") === "Modules" && (
          <SettingModules />
        )}
      </div>
    </>
  );
};

export default Settings;
