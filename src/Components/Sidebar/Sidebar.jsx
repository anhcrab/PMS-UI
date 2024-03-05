import { NavLink } from "react-router-dom";
import "./Sidebar.scss";
import { useContext, useEffect, useState } from "react";
import { AdminContext } from "../../Layouts/Admin/AdminLayout";
import { Show } from "../Show/Show";
import { Popover } from "bootstrap";

const Sidebar = () => {
  const [minimize, setMinimize] = useState(true);
  const [tooltip, setTooltip] = useState({
    toggle: "popover",
    placement: "right",
  });
  const { accessControl } = useContext(AdminContext);

  function handleMinimize() {
    setMinimize(!minimize);
  }

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
    if (minimize) {
      setTooltip({
        toggle: "tooltip",
        placement: "right",
      });
    } else {
      setTooltip({
        toggle: "none",
        placement: "none",
      });
      document.querySelectorAll(".popover").forEach((popover) => {
        popover.remove();
      });
    }
  }, [minimize]);

  useEffect(() => {
    const popoverTriggerList = document.querySelectorAll(
      '[data-bs-toggle="popover"]'
    );
    [...popoverTriggerList].map(
      (popoverTriggerEl) =>
        new Popover(popoverTriggerEl, {
          trigger: "hover",
        })
    );
    document.querySelectorAll(".popover").forEach((popover) => {
      popover.setAttribute("data-bs-theme", "dark");
    });
    return () => {
      document.querySelectorAll(".popover").forEach((popover) => {
        popover.remove();
      });
    };
  }, []);

  return (
    <aside
      id="terus-admin__body-sidebar"
      className={`${minimize ? "minimized" : ""}`}
    >
      <div className={`terus-sidebar`}>
        <div className="terus-minimize__btn" onClick={handleMinimize}>
          <i className={`bi bi-arrow-bar-${minimize ? "right" : "left"}`}></i>
        </div>
        <ul className="terus-side-top__list" data-bs-theme="dark">
          <li
            className="terus-side-top__item"
            data-bs-toggle={tooltip.toggle}
            data-bs-placement={tooltip.placement}
            data-bs-content="Dashboard"
          >
            <NavLink
              className={({ isActive, isPending }) =>
                isPending
                  ? "terus-side-nav__link pending"
                  : isActive
                  ? "terus-side-nav__link active"
                  : "terus-side-nav__link"
              }
              to={"/Admin/Dashboard"}
            >
              <i className="bi bi-grid"></i>
              <span className="terus-sidebar__nav-text">Dashboard</span>
            </NavLink>
          </li>
          <li
            className="terus-side-top__item"
            data-bs-toggle={tooltip.toggle}
            data-bs-placement={tooltip.placement}
            data-bs-content="Hồ sơ"
          >
            <NavLink
              className={({ isActive, isPending }) =>
                isPending
                  ? "terus-side-nav__link"
                  : isActive
                  ? "terus-side-nav__link active"
                  : "terus-side-nav__link"
              }
              to={"/Admin/Profile"}
            >
              <i className="bi bi-person"></i>
              <span className="terus-sidebar__nav-text">Hồ sơ</span>
            </NavLink>
          </li>
          <Show>
            <Show.When isTrue={accessControl.role !== "CLIENT"}>
              <li
                className="terus-side-top__item"
                data-bs-toggle={tooltip.toggle}
                data-bs-placement={tooltip.placement}
                data-bs-content={
                  accessControl.role === "EMPLOYEE" ? "Nhóm của tôi" : "Nhân sự"
                }
              >
                <NavLink
                  className={({ isActive, isPending }) =>
                    isPending
                      ? "terus-side-nav__link"
                      : isActive
                      ? "terus-side-nav__link active"
                      : "terus-side-nav__link"
                  }
                  to={"/Admin/Employees"}
                >
                  <i className={`bi bi-people`}></i>
                  <span className="terus-sidebar__nav-text">
                    {accessControl.role === "EMPLOYEE"
                      ? "Nhóm của tôi"
                      : "Nhân sự"}
                  </span>
                </NavLink>
              </li>
              <Show>
                <Show.When
                  isTrue={
                    accessControl?.role === "ADMIN" ||
                    accessControl?.role === "MANAGER"
                  }
                >
                  <li
                    className="terus-side-top__item"
                    data-bs-toggle={tooltip.toggle}
                    data-bs-placement={tooltip.placement}
                    data-bs-content="Dự án"
                  >
                    <NavLink
                      className={({ isActive, isPending }) =>
                        isPending
                          ? "terus-side-nav__link"
                          : isActive
                          ? "terus-side-nav__link active"
                          : "terus-side-nav__link"
                      }
                      to={"/Admin/Projects"}
                    >
                      <i className={`bi bi-suitcase-lg`}></i>
                      <span className="terus-sidebar__nav-text">Dự án</span>
                    </NavLink>
                  </li>
                </Show.When>
              </Show>
            </Show.When>
          </Show>
        </ul>
        <ul className="terus-side-bot__list">
          <Show>
            <Show.When isTrue={accessControl.role === "ADMIN"}>
              <li
                className="terus-side-bot__item"
                data-bs-toggle={tooltip.toggle}
                data-bs-placement={tooltip.placement}
                data-bs-content="Cài đặt"
              >
                <NavLink
                  className={({ isActive, isPending }) =>
                    isPending
                      ? "terus-side-nav__link"
                      : isActive
                      ? "terus-side-nav__link active"
                      : "terus-side-nav__link"
                  }
                  to={"/Admin/Settings?Page=General"}
                >
                  <i className="bi bi-gear"></i>
                  <span className="terus-sidebar__nav-text">Cài đặt</span>
                </NavLink>
              </li>
            </Show.When>
          </Show>
          <li
            className="terus-side-bot__item"
            data-bs-toggle={tooltip.toggle}
            data-bs-placement={tooltip.placement}
            data-bs-content="Về Trang Chủ"
          >
            <NavLink
              className={({ isActive, isPending }) =>
                isPending
                  ? "terus-side-nav__link"
                  : isActive
                  ? "terus-side-nav__link active"
                  : "terus-side-nav__link"
              }
              to={"/"}
            >
              <i className="bi bi-house"></i>
              <span className="terus-sidebar__nav-text">Về Trang Chủ</span>
            </NavLink>
          </li>
          <li
            className="terus-side-bot__item"
            data-bs-toggle={tooltip.toggle}
            data-bs-placement={tooltip.placement}
            data-bs-content="Đăng xuất"
          >
            <NavLink
              className={({ isActive, isPending }) =>
                isPending
                  ? "terus-side-nav__link"
                  : isActive
                  ? "terus-side-nav__link active"
                  : "terus-side-nav__link"
              }
              to={"/Auth/Logout"}
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
