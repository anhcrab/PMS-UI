import { NavLink } from "react-router-dom";
import "./Sidebar.scss";
import { useEffect, useState } from "react";  

const Sidebar = () => {
  const [minimize, setMinimize] = useState(true);
  const handleMinimize = () => {
    setMinimize(!minimize);
  };
  useEffect(() => {
    const heading = document.querySelector(".terus-header .terus-left");
    const headingRight = document.querySelector(".terus-header .terus-right");
    const body = document.getElementById("terus-admin__body-main");
    if (minimize) {
      heading.style =
        "width: 70px; padding: 0; transition: width .3s ease; justify-content: center";
      heading.querySelector("h1").style = "display: none;";
      headingRight.style =
        "width: calc(100% - 60px); transition: width .3s ease;";
      body.style = "width: calc(100% - 70px); transition: width .3s ease;";
    } else {
      setTimeout(() => {
        heading.querySelector("h1").style = "";
      }, 200);
      heading.style = "";
      headingRight.style = "";
      body.style = "";
    }
  }, [minimize]);
  return (
    <aside
      id="terus-admin__body-sidebar"
      className={`${minimize ? "minimized" : ""}`}
    >
      <div className={`terus-sidebar`}>
        <div className="terus-minimize__btn" onClick={handleMinimize}>
          <i className={`bi bi-arrow-bar-${minimize ? "right" : "left"}`}></i>
        </div>
        <ul className="terus-side-top__list">
          <li className="terus-side-top__item">
            <NavLink
              className={({ isActive, isPending }) =>
                isPending
                  ? "terus-side-nav__link pending"
                  : isActive
                  ? "terus-side-nav__link active"
                  : "terus-side-nav__link"
              }
              to={"/Admin/Dashboard"}
              title="Dashboard"
            >
              <i className="bi bi-grid"></i>
              <span className="terus-sidebar__nav-text">Dashboard</span>
            </NavLink>
          </li>
          <li className="terus-side-top__item">
            <NavLink
              className={({ isActive, isPending }) =>
                isPending
                  ? "terus-side-nav__link"
                  : isActive
                  ? "terus-side-nav__link active"
                  : "terus-side-nav__link"
              }
              to={"/Admin/Profile"}
              title="Hồ sơ"
            >
              <i className="bi bi-person"></i>
              <span className="terus-sidebar__nav-text">Hồ sơ</span>
            </NavLink>
          </li>
          <li className="terus-side-top__item">
            <NavLink
              className={({ isActive, isPending }) =>
                isPending
                  ? "terus-side-nav__link"
                  : isActive
                  ? "terus-side-nav__link active"
                  : "terus-side-nav__link"
              }
              to={"/Admin/Employees"}
              title={'Nhân sự'}
            >
              <i className={`bi bi-people`}></i>
              <span className="terus-sidebar__nav-text">Nhân sự</span>
            </NavLink>
          </li>
          <li className="terus-side-top__item">
            <NavLink
              className={({ isActive, isPending }) =>
                isPending
                  ? "terus-side-nav__link"
                  : isActive
                  ? "terus-side-nav__link active"
                  : "terus-side-nav__link"
              }
              to={"/Admin/Departments"}
              title={'Phòng ban'}
            >
              <i className={`bi bi-building`}></i>
              <span className="terus-sidebar__nav-text">Phòng ban</span>
            </NavLink>
          </li>
          <li className="terus-side-top__item">
            <NavLink
              className={({ isActive, isPending }) =>
                isPending
                  ? "terus-side-nav__link"
                  : isActive
                  ? "terus-side-nav__link active"
                  : "terus-side-nav__link"
              }
              to={"/Admin/Projects"}
              title={'Dự án'}
            >
              <i className={`bi bi-suitcase-lg`}></i>
              <span className="terus-sidebar__nav-text">Dự án</span>
            </NavLink>
          </li>
        </ul>
        <ul className="terus-side-bot__list">
          <li className="terus-side-bot__item">
            <NavLink
              className={({ isActive, isPending }) =>
                isPending
                  ? "terus-side-nav__link"
                  : isActive
                  ? "terus-side-nav__link active"
                  : "terus-side-nav__link"
              }
              to={"/Admin/Settings?Page=General"}
              title="Cài đặt"
            >
              <i className="bi bi-gear"></i>
              <span className="terus-sidebar__nav-text">Cài đặt</span>
            </NavLink>
          </li>
          <li className="terus-side-bot__item">
            <NavLink
              className={({ isActive, isPending }) =>
                isPending
                  ? "terus-side-nav__link"
                  : isActive
                  ? "terus-side-nav__link active"
                  : "terus-side-nav__link"
              }
              to={"/"}
              title="Trang chủ"
            >
              <i className="bi bi-house"></i>
              <span className="terus-sidebar__nav-text">Về Trang Chủ</span>
            </NavLink>
          </li>
          <li className="terus-side-bot__item">
            <NavLink
              className={({ isActive, isPending }) =>
                isPending
                  ? "terus-side-nav__link"
                  : isActive
                  ? "terus-side-nav__link active"
                  : "terus-side-nav__link"
              }
              to={"/Auth/Logout"}
              title="Đăng xuất"
            >
              <i className="bi bi-box-arrow-left"></i>
              <span className="terus-sidebar__nav-text">Đăng xuất</span>
            </NavLink>
          </li>
        </ul>
      </div>
    </aside>
  );
};

export default Sidebar;
