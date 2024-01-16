import { Navigate } from "react-router-dom"

const Logout = () => {
  localStorage.removeItem('ACCESS_TOKEN')
  localStorage.removeItem('EXPIRATION')
  localStorage.removeItem('USER_ID')
  return (
    <Navigate to={'/Auth'} />
  )
}

export default Logout