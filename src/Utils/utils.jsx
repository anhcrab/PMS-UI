import { Navigate } from "react-router-dom";

export const authenticate = (target, reverse = false) => {
  checkExpireToken();
  if (reverse === true && localStorage.getItem("ACCESS_TOKEN") === null) {
    return <Navigate to={target} replace={true} />;
  } else if (
    reverse === false &&
    localStorage.getItem("ACCESS_TOKEN") !== null
  ) {
    return <Navigate to={target} replace={true} />;
  }
};

export const checkExpireToken = () => {
  const expiryDate = new Date(localStorage.getItem('EXPIRATION'))
  const today = new Date(Date.now())
  if (today >= expiryDate) {
    localStorage.removeItem('ACCESS_TOKEN')
    localStorage.removeItem('USER_ID')
    localStorage.removeItem('EXPIRATION')
    return <Navigate to={'/Auth/Login'} replace={true}/>
  }
}