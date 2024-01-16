import { useEffect, useState } from "react";
import "./Dashboard.scss";
import Loading from "../../Components/Loading/Loading";

const Dashboard = () => {
  const [loading, setLoading] = useState(true)
  useEffect(() => {
    setTimeout(() => {
      setLoading(false)
    }, 1000 * 2)
  }, [])
  return (
    <>
      {loading && <Loading />}
      <div id="terus-dashboard">Chưa biết làm gì ở trang này cả</div>
    </>
  );
};

export default Dashboard;
