import { useEffect, useState } from "react";
import LoginForm from "../../Components/LoginForm/LoginForm";
import SignUpForm from "../../Components/SignUpForm/SignUpForm";
import "./Auth.scss";
import { Outlet, useSearchParams } from "react-router-dom";
import { authenticate } from "../../Utils/utils";

const Auth = () => {
  const [urlParams, setUrlParams] = useSearchParams();
  const [toggle, setToggle] = useState("login");
  useEffect(() => {
    if (urlParams.has("Action")) {
      setToggle(urlParams.get('Action'));
    }
  }, [urlParams]);
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
        className={`terus-container${toggle === "Register" ? " active" : ""}`}
        id="container"
      >
        <SignUpForm />
        <LoginForm />
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
                  setUrlParams({ Action: 'Login' })
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
                  setUrlParams({ Action: 'Register' })
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
