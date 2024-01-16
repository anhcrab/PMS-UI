import { NavLink } from "react-router-dom";
import "./Header.scss";

const Header = () => {
  return (
    <header className="terus-header">
      <nav className="terus-nav">
        <div className="terus-left">
          <NavLink to={"/"}>
            <img
              src="/src/assets/imgs/logo-web.png"
              alt="logo"
              className="terus-logo"
            />
          </NavLink>
        </div>
        <div className="terus-right">
          <span className="terus-notification">
            <i className="bi bi-bell-fill"></i>
          </span>
          <NavLink to={"/Auth"} className={'terus-account'}>
            <i className="bi bi-person-fill"></i>
            <ul id="terus-account__sub-menu">
              <li className="terus-account__sub-item">
                <NavLink to={'/Admin/Dashboard'} className="terus-account__link">Quản trị</NavLink>
              </li>
              <li className="terus-account__sub-item">
                <NavLink to={'/Admin/Profile'} className="terus-account__link">Hồ sơ</NavLink>
              </li>
              <li className="terus-account__sub-item">
                <NavLink to={'/Auth/Logout'} className="terus-account__link">Đăng xuất</NavLink>
              </li>
            </ul>
          </NavLink>
        </div>
      </nav>
    </header>
  );
};

export default Header;
