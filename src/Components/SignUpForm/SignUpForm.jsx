import { useEffect, useState } from "react";
import api from "../../Utils/api";
import { Navigate } from "react-router-dom";
import AuthLoading from "../AuthLoading/AuthLoading";

const SignUpForm = () => {
  const [payload, setPayload] = useState({
    username: "",
    email: "",
    password: "",
  });
  const [pwd, setPwd] = useState(false);
  const [loading, setLoading] = useState(false)
  useEffect(() => {
    const pwdEl = document.getElementById("register-pwd");
    if (pwd) {
      pwdEl.type = "text";
    } else {
      pwdEl.type = "password";
    }
  }, [pwd]);

  const handleOnChange = (e) => {
    setPayload({
      ...payload,
      [e.target.name]: e.target.value,
    });
  };

  const handleOnSubmit = (e) => {
    setLoading(true)
    e.preventDefault()
    console.log(payload);
    api
      .post('auth/register', payload)
      .then(response => {
        console.log(response.data);
        setLoading(false)
        return <Navigate to={'/Auth?Action=Login'} />
      })
      .catch(error => {
        console.log(error);
        setLoading(false)
      })
  }

  return (
    <>
      {loading && <AuthLoading />}
      <div className="terus-form-container sign-up">
        <form id="sign_up_form" onSubmit={handleOnSubmit} >
          <h1 style={{ width: "300px" }}>Tạo Tài Khoản</h1>
          <div className="social-icons">
            <a href="#" className="icon">
              <i className="bi bi-google"></i>
            </a>
            <a href="#" className="icon">
              <i className="bi bi-facebook"></i>
            </a>
            <a href="#" className="icon">
              <i className="bi bi-github"></i>
            </a>
            <a href="#" className="icon">
              <i className="bi bi-linkedin"></i>
            </a>
          </div>
          <span>hoặc sử dụng email để đăng ký</span>
          <input
            name="username"
            type="text"
            placeholder="Tên"
            onChange={handleOnChange}
          />
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
              id="register-pwd"
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
          <button type="submit" className="terus-submit-btn">
            Đăng Ký
          </button>
        </form>
      </div>
    </>
  );
};

export default SignUpForm;
