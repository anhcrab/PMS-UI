import { useEffect, useState } from "react";
import LoginForm from "../../Components/LoginForm/LoginForm";
// import SignUpForm from "../../Components/SignUpForm/SignUpForm";
import "./Auth.scss";
import { Link, useParams } from "react-router-dom";
import { authenticate } from "../../Utils/utils";
import { Show } from "../../Components/Show/Show";
import Logout from "../../Components/Logout/Logout";

const Auth = () => {
  const { When, Else } = Show;
  const { action } = useParams();
  const [toggle, setToggle] = useState("login");
  useEffect(() => {
    setToggle(action);
    if (!action) {
      location.href = "/Auth/Login";
    }
  }, [action]);
  useEffect(() => {
    document.querySelectorAll(".terus-pwd").forEach((element) => {
      element.value = "";
    });
  }, [toggle]);
  console.clear();
  return (
    <>
      <Show>
        <When isTrue={action === "Logout"}>
          <Logout />
        </When>
        <Else>
          {authenticate("/Admin/Dashboard", false)}
          <div
            className={`terus-container${
              toggle === "Register" ? " active" : ""
            }`}
            id="container"
          >
            {/* <SignUpForm /> */}
            <LoginForm />
            <div className="terus-toggle-container">
              <div className="terus-toggle">
                <div className="terus-toggle-panel terus-toggle-left">
                  <h1 className="fw-normal">
                    Chào mừng <br />
                    Trở lại!
                  </h1>
                  <p>
                    Đăng nhập vào tài khoản để sử dụng tất cả các tính năng của
                    Terus
                  </p>
                  <Link
                    to={"../Auth/Login"}
                    className="hidden button highlight-2 fw-normal"
                    style={{ textDecoration: "none" }}
                    id="login"
                  >
                    Đăng Nhập
                  </Link>
                </div>
                <div className="terus-toggle-panel terus-toggle-right">
                  <h1 className="fw-normal">Xin chào!</h1>
                  <p>
                    Đăng nhập ngay để sử dụng tất cả các tính năng của Terus
                  </p>
                  {/* <Link
                    to={"../Auth/Register"}
                    className="hidden button highlight-1"
                    style={{ textDecoration: 'none' }}
                    id="register"
                  >
                    Đăng ký
                  </Link> */}
                </div>
              </div>
            </div>
          </div>
        </Else>
      </Show>
    </>
  );
};
export default Auth;
