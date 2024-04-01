import { Navigate } from "react-router-dom";
import api from "../../Utils/api";
import { useEffect } from "react";

const Logout = () => {
  useEffect(() => {
    api.get("auth/logout");
  }, []);
  localStorage.removeItem("ACCESS_TOKEN");
  localStorage.removeItem("EXPIRATION");
  return <Navigate to={"/Auth?Action=Login"} />;
};

export default Logout;
