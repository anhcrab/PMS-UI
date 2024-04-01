import { useContext, useEffect, useState } from "react";
import "./HeaderAdmin.scss";
import { AdminContext } from "../../Layouts/Admin/AdminLayout";
import { Dropdown } from "rsuite";
import { NavLink } from "react-router-dom";
import { Off } from "@rsuite/icons";

const HeaderAdmin = () => {
  const { heading, minimize, setMinimize } = useContext(AdminContext);
  const [fullscreen, setFullscreen] = useState(false);
  useEffect(() => {
    if (fullscreen) {
      openFullscreen();
    } else {
      closeFullscreen();
    }
  }, [fullscreen]);

  function openFullscreen() {
    if (document.documentElement.requestFullscreen) {
      document.documentElement.requestFullscreen();
    } else if (document.documentElement.webkitRequestFullscreen) {
      document.documentElement.webkitRequestFullscreen();
    } else if (document.documentElement.msRequestFullscreen) {
      document.documentElement.msRequestFullscreen();
    }
  }

  function closeFullscreen() {
    if (document.exitFullscreen) {
      document.exitFullscreen();
    } else if (document.webkitExitFullscreen) {
      document.webkitExitFullscreen();
    } else if (document.msExitFullscreen) {
      document.msExitFullscreen();
    }
  }
  return (
    <header className="terus-header">
      <div className="d-flex justify-content-center align-items-center gap-2">
        <button
          className="bg-transparent btn-subtle p-2"
          onClick={(e) => {
            e.preventDefault();
            setMinimize(!minimize);
          }}
        >
          <i className="bi bi-list text-dark fs-2"></i>
        </button>
        <h2 className="text-dark fs-5 mb-0">{heading}</h2>
      </div>
      <div className="d-flex justify-content-center align-items-center gap-3">
        <i
          className={`bi bi-fullscreen${fullscreen ? '-exit' : ''} fs-6 text-secondary`}
          style={{ cursor: "pointer" }}
          onClick={() => {
            setFullscreen(!fullscreen);
          }}
        ></i>
        <i className="bi bi-bell-fill fs-6 text-secondary"></i>
        <Dropdown
          title={<i className="bi bi-person-fill fs-3 text-secondary"></i>}
          placement="bottomEnd"
          noCaret
        >
          <Dropdown.Item className="d-flex align-items-center">
            <NavLink
              to={"/"}
              className={
                "d-flex gap-2 align-items-center text-secondary text-decoration-none fs-6 fw-normal"
              }
            >
              <i className="bi bi-house-door"></i>
              Về trang chủ
            </NavLink>
          </Dropdown.Item>
          <Dropdown.Separator />
          <Dropdown.Item className="d-flex align-items-center">
            <NavLink
              to={"Profile"}
              className={
                "d-flex gap-2 align-items-center text-secondary text-decoration-none fs-6 fw-normal"
              }
            >
              <i className="bi bi-person"></i>
              Hồ sơ
            </NavLink>
          </Dropdown.Item>
          <Dropdown.Item
            className="d-flex align-items-center text-secondary "
            icon={<Off />}
          >
            <NavLink
              to={"/Auth/Logout"}
              className={
                "d-flex gap-2 align-items-center text-secondary text-decoration-none fs-6 fw-normal"
              }
            >
              Đăng xuất
            </NavLink>
          </Dropdown.Item>
        </Dropdown>
      </div>
    </header>
  );
};

export default HeaderAdmin;
