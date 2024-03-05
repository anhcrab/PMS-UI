import { useContext } from "react";
import "./HeaderAdmin.scss";
import { AdminContext } from "../../Layouts/Admin/AdminLayout";

const HeaderAdmin = () => {
  const { heading } = useContext(AdminContext)
  return (
    <header className="terus-header">
      <div className="terus-left">
        <img
          width={50}
          src="https://terusvn.com/wp-content/uploads/2023/10/cropped-1-1-192x192.png"
          alt=""
        />
        <h1>terus</h1>
      </div>
      <div className="terus-right d-flex justify-content-between px-4">
        {/* <div className="terus-header-search__container">
          <label htmlFor="terus_search_input" id="terus_search">
            <i className="bi bi-search"></i>
            <input
              type="text"
              id="terus_search_input"
              name="s"
              placeholder="Search..."
            />
          </label>
        </div> */}
        <h2 className="text-dark fs-4 mb-0">{heading}</h2>
      </div>
    </header>
  );
};

export default HeaderAdmin;
