import { Outlet } from "react-router-dom";
import Header from "../../Components/Header/Header";

const ClientLayout = () => {
  return (
    <div id="terus-client">
      <div className="terus-client__nav">
        <Header />
      </div>
      <div className="terus-client__content">
        <Outlet />
      </div>
    </div>
  );
};

export default ClientLayout;
