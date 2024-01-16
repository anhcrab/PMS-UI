import { useEffect, useState } from "react";
import "./Profile.scss";
import Loading from "../../Components/Loading/Loading";
import api from "../../Utils/api";

const Profile = () => {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  useEffect(() => {
    const id = localStorage.getItem("USER_ID");
    api.get("users/" + id).then((res) => {
      console.log(res.data);
      setUser(res.data);
      setLoading(false);
    });
  }, []);
  return (
    <>
      {loading && <Loading />}
      {user && (
        <div id="terus-profile-page">
          <div className="row p50">
            <div className="col-lg-9 fl-g3 h-full">
              <section className="terus-section"></section>
              <section className="terus-section"></section>
              <section className="terus-section"></section>
              <section className="terus-section"></section>
            </div>
            <div className="col-lg-3">
              <section className="terus-section">
                <div className="row">
                  <i className="bi bi-person-square terus-user-avatar center"></i>
                  <h2 className="center">{user.userName}</h2>
                  <small>
                    Là một người sử dụng website Terus thường xuyên.
                  </small>
                  <div className="row">
                  </div>
                </div>
              </section>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Profile;
