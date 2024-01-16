import { Navigate } from "react-router-dom";

export const authenticate = (target, reverse = false) => {
  if (reverse === true && localStorage.getItem("ACCESS_TOKEN") === null) {
    return <Navigate to={target} replace={true} />;
  } else if (
    reverse === false &&
    localStorage.getItem("ACCESS_TOKEN") !== null
  ) {
    return <Navigate to={target} replace={true} />;
  }
};
