import { useEffect, useState } from "react";
import { NavLink, Navigate } from "react-router-dom";
import { githubLogin } from "../../Utils/OAuth";
import api from "../../Utils/api";
import AuthLoading from "../AuthLoading/AuthLoading";

const LoginForm = () => {
  const [pwd, setPwd] = useState(false);
  const [payload, setPayload] = useState({
    email: "",
    password: "",
  });
  const [status, setStatus] = useState("pending");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const pwdEl = document.getElementById("login-pwd");
    if (pwd) {
      pwdEl.type = "text";
    } else {
      pwdEl.type = "password";
    }
  }, [pwd, status]);

  const handleOnChange = (e) => {
    setPayload({
      ...payload,
      [e.target.name]: e.target.value,
    });
  };

  const signin = (e) => {
    setLoading(true)
    e.preventDefault();
    api
      .post("auth/login", payload)
      .then((response) => {
        const { token, expiration, id } = response.data;
        localStorage.setItem("ACCESS_TOKEN", token);
        localStorage.setItem("EXPIRATION", expiration);
        localStorage.setItem("USER_ID", id);
        setLoading(false)
        setStatus("success");
      })
      .catch((error) => {
        if (error.response.status === 401) {
          setStatus("failed");
        }
      });
  };
  return (
    <>
      {loading && <AuthLoading/>}
      {status === "success" && (
        <Navigate to={"/Admin/Dashboard"} replace={true} />
      )}
      <div className="terus-form-container sign-in">
        <form id="sign_in_form" onSubmit={signin}>
          <h1>Đăng Nhập</h1>
          <div className="social-icons">
            <a href="#" className="icon">
              <i className="bi bi-google"></i>
            </a>
            <a href="#" className="icon">
              <i className="bi bi-facebook"></i>
            </a>
            <a href="#" className="icon" onClick={githubLogin}>
              <i className="bi bi-github"></i>
            </a>
            <a href="#" className="icon">
              <i className="bi bi-linkedin"></i>
            </a>
          </div>
          <span>hoặc đăng nhập với email và mật khẩu</span>
          <input
            name="email"
            type="email"
            placeholder="Email"
            onChange={handleOnChange}
          />
          <div style={{ position: "relative", width: "100%" }}>
            <input
              name="password"
              type="password"
              placeholder="Mật khẩu"
              id="login-pwd"
              className="terus-pwd"
              onChange={handleOnChange}
            />
            <i
              className={`bi bi-eye-${pwd ? "slash-" : ""}fill terus-hide-pwd`}
              onClick={() => {
                setPwd(!pwd);
              }}
            ></i>
          </div>
          <NavLink className="terus-forgotpass__link" to={"/auth"}>
            Quên mật khẩu?
          </NavLink>
          <button type="submit" className="terus-submit-btn">
            Đăng Nhập
          </button>
        </form>
      </div>
    </>
  );
};
export default LoginForm;
