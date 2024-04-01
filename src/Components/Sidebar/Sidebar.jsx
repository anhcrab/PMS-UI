import { NavLink } from "react-router-dom";
import "./Sidebar.scss";
import { useContext } from "react";
import { AdminContext } from "../../Layouts/Admin/AdminLayout";
import { Show } from "../Show/Show";
import { Tooltip, Whisper } from "rsuite";
import { isOnDesktop, isOnMobile } from "../../Utils/utils";

const Sidebar = () => {
  const { accessControl, minimize, setMinimize } = useContext(AdminContext);
  function handleClickMinize() {
    if (isOnMobile()) {
      setMinimize(!false);
    }
  }
  return (
    <aside
      id="terus-admin__body-sidebar"
      className={`${minimize ? "minimized" : ""}`}
    >
      <div className={`terus-sidebar`}>
        <ul className="terus-side-top__list">
          <li className="terus-side-top__item">
            <div className="w-100 h-100 d-flex justify-content-center align-items-center gap-2">
              <img
                style={{ width: "45px", height: "fit-content" }}
                src="https://terusvn.com/wp-content/uploads/2023/10/1.png"
                alt=""
              />
              <h1
                className="fs-4"
                style={{
                  color: "var(--sidebar-primary-color)",
                }}
              >
                PMS
              </h1>
            </div>
          </li>
          <li className="terus-side-top__item" onClick={handleClickMinize}>
            <Show>
              <Show.When isTrue={isOnDesktop() && minimize}>
                <Whisper
                  trigger="hover"
                  placement={"right"}
                  controlId={`control-id-sidebar__dashboard`}
                  speaker={<Tooltip>Dashboard</Tooltip>}
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
                </Whisper>
              </Show.When>
              <Show.Else>
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
              </Show.Else>
            </Show>
          </li>
          <li className="terus-side-top__item" onClick={handleClickMinize}>
            <Show>
              <Show.When isTrue={isOnDesktop() && minimize}>
                <Whisper
                  trigger="hover"
                  placement={"right"}
                  controlId={`control-id-sidebar__profile`}
                  speaker={<Tooltip>Hồ sơ</Tooltip>}
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
                </Whisper>
              </Show.When>
              <Show.Else>
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
              </Show.Else>
            </Show>
          </li>
          <Show>
            <Show.When isTrue={accessControl.role !== "CLIENT"}>
              <li className="terus-side-top__item" onClick={handleClickMinize}>
                <Show>
                  <Show.When isTrue={isOnDesktop() && minimize}>
                    <Whisper
                      trigger="hover"
                      placement={"right"}
                      controlId={`control-id-sidebar__employee`}
                      speaker={
                        <Tooltip>
                          {accessControl.role === "EMPLOYEE"
                            ? "Nhóm của tôi"
                            : "Nhân sự"}
                        </Tooltip>
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
                    </Whisper>
                  </Show.When>
                  <Show.Else>
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
                  </Show.Else>
                </Show>
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
                    onClick={handleClickMinize}
                  >
                    <Show>
                      <Show.When isTrue={isOnDesktop() && minimize}>
                        <Whisper
                          trigger="hover"
                          placement={"right"}
                          controlId={`control-id-sidebar__projects`}
                          speaker={<Tooltip>Dự án</Tooltip>}
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
                            <span className="terus-sidebar__nav-text">
                              Dự án
                            </span>
                          </NavLink>
                        </Whisper>
                      </Show.When>
                      <Show.Else>
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
                      </Show.Else>
                    </Show>
                  </li>
                </Show.When>
              </Show>
              <li className="terus-side-top__item" onClick={handleClickMinize}>
                <Show>
                  <Show.When isTrue={isOnDesktop() && minimize}>
                    <Whisper
                      trigger="hover"
                      placement={"right"}
                      controlId={`control-id-sidebar__task`}
                      speaker={<Tooltip>Nhiệm vụ</Tooltip>}
                    >
                      <NavLink
                        className={({ isActive, isPending }) =>
                          isPending
                            ? "terus-side-nav__link"
                            : isActive
                            ? "terus-side-nav__link active"
                            : "terus-side-nav__link"
                        }
                        to={"/Admin/Tasks"}
                      >
                        <i className={`bi bi-patch-check`}></i>
                        <span className="terus-sidebar__nav-text">
                          {"Nhiệm vụ"}
                        </span>
                      </NavLink>
                    </Whisper>
                  </Show.When>
                  <Show.Else>
                    <NavLink
                      className={({ isActive, isPending }) =>
                        isPending
                          ? "terus-side-nav__link"
                          : isActive
                          ? "terus-side-nav__link active"
                          : "terus-side-nav__link"
                      }
                      to={"/Admin/Tasks"}
                    >
                      <i className={`bi bi-patch-check`}></i>
                      <span className="terus-sidebar__nav-text">
                        {"Nhiệm vụ"}
                      </span>
                    </NavLink>
                  </Show.Else>
                </Show>
              </li>
            </Show.When>
          </Show>
        </ul>
        <ul className="terus-side-bot__list">
          <Show>
            <Show.When isTrue={accessControl.role === "ADMIN"}>
              <li className="terus-side-bot__item" onClick={handleClickMinize}>
                <Show>
                  <Show.When isTrue={isOnDesktop() && minimize}>
                    <Whisper
                      trigger="hover"
                      placement={"right"}
                      controlId={`control-id-sidebar__settings`}
                      speaker={<Tooltip>Cài đặt</Tooltip>}
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
                    </Whisper>
                  </Show.When>
                  <Show.Else>
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
                  </Show.Else>
                </Show>
              </li>
            </Show.When>
          </Show>
          <li className="terus-side-bot__item" onClick={handleClickMinize}>
            <Show>
              <Show.When isTrue={isOnDesktop() && minimize}>
                <Whisper
                  trigger="hover"
                  placement={"right"}
                  controlId={`control-id-sidebar__home`}
                  speaker={<Tooltip>Về Trang Chủ</Tooltip>}
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
                    <span className="terus-sidebar__nav-text">
                      Về Trang Chủ
                    </span>
                  </NavLink>
                </Whisper>
              </Show.When>
              <Show.Else>
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
              </Show.Else>
            </Show>
          </li>
          <li className="terus-side-bot__item" onClick={handleClickMinize}>
            <Show>
              <Show.When isTrue={isOnDesktop() && minimize}>
                <Whisper
                  trigger="hover"
                  placement={"right"}
                  controlId={`control-id-sidebar__logout`}
                  speaker={<Tooltip>Đăng xuất</Tooltip>}
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
                </Whisper>
              </Show.When>
              <Show.Else>
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
              </Show.Else>
            </Show>
          </li>
        </ul>
      </div>
    </aside>
  );
};

export default Sidebar;
