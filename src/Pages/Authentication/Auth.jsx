import { useEffect, useState } from "react";
import LoginForm from "../../Components/LoginForm/LoginForm";
import SignUpForm from "../../Components/SignUpForm/SignUpForm";
import "./Auth.scss";
import { Outlet, useSearchParams } from "react-router-dom";
import { authenticate } from "../../Utils/utils";

const Auth = () => {
  const [searchParams] = useSearchParams();
  const [toggle, setToggle] = useState("login");
  useEffect(() => {
    if (searchParams.get("action") === "signup") {
      setToggle("register");
    }
  }, [searchParams]);
  useEffect(() => {
    document.querySelectorAll(".terus-pwd").forEach((element) => {
      element.value = "";
    });
  }, [toggle]);
  return (
    <>
      <Outlet />
      {authenticate('/Admin/Dashboard', false)}
      <div
        className={`terus-container${toggle === "register" ? " active" : ""}`}
        id="container"
      >
        <SignUpForm />
        <LoginForm state={toggle} />
        <div className="terus-toggle-container">
          <div className="terus-toggle">
            <div className="terus-toggle-panel terus-toggle-left">
              <h1>
                Chào mừng <br />
                Trở lại!
              </h1>
              <p>
                Đăng nhập vào tài khoản để sử dụng tất cả các tính năng của
                Terus
              </p>
              <button
                className="hidden highlight-2"
                id="login"
                onClick={() => {
                  setToggle("login");
                }}
              >
                Đăng Nhập
              </button>
            </div>
            <div className="terus-toggle-panel terus-toggle-right">
              <h1>Xin chào!</h1>
              <p>
                Đăng ký tài khoản mới để sử dụng tất cả các tính năng của Terus
              </p>
              <button
                className="hidden highlight-1"
                id="register"
                onClick={() => {
                  setToggle("register");
                }}
              >
                Đăng ký
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
export default Auth;
