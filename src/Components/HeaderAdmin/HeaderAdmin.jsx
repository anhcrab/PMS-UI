import "./HeaderAdmin.scss";

const HeaderAdmin = () => {
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
      <div className="terus-right">
        <div className="terus-header-search__container">
          <label htmlFor="terus_search_input" id="terus_search">
            <i className="bi bi-search"></i>
            <input
              type="text"
              id="terus_search_input"
              name="s"
              placeholder="Search..."
            />
          </label>
        </div>
      </div>
    </header>
  );
};

export default HeaderAdmin;
