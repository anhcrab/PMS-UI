import { useContext, useEffect, useState } from "react";
import "./Profile.scss";
import Loading from "../../Components/Loading/Loading";
import api from "../../Utils/api";
import { AdminContext } from "../../Layouts/Admin/AdminLayout";

const Profile = () => {
  const { setHeading } = useContext(AdminContext)
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [info, setInfo] = useState({
    firstName: "",
    lastName: "",
    phoneNumber: "",
    sex: "",
    dob: "",
    address: "",
    description: "",
  });
  const [role, setRole] = useState("Client");
  useEffect(() => {
    setHeading("Hồ sơ")
    api.get("profile").then((res) => {
      console.log(res.data);
      const { data } = res;
      setUser(data);
      setLoading(false);
      setInfo({
        firstName: data.firstName,
        lastName: data.lastName,
        phoneNumber: data.phoneNumber,
        sex: data.sex,
        dob: data.dob,
        address: data.address,
        description: data.description,
      });
    });
  }, []);
  useEffect(() => {
    api.get("auth/role").then((res) => setRole(res.data));
  }, [user]);
  const handleChange = (e) => {
    setInfo({
      ...info,
      [e.target.name]: e.target.value,
    });
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    api.post("profile", info).then(() => {
      location.reload();
    });
  };
  return (
    <>
      {loading && <Loading />}
      {user && (
        <div id="terus-profile-page">
          <div className="row p50">
            {/* <h1 className="col-lg-12 text-start">Hồ sơ cá nhân</h1> */}
            <div className="col-lg-9 fl-g3 h-full">
              <section className="terus-section">
                <form
                  className="row needs-validation"
                  data-bs-theme="dark"
                  onSubmit={handleSubmit}
                >
                  <div className="row">
                    <div className="col-md-12">
                      <div className="input-group mb-3">
                        <span className="input-group-text" id="basic-addon1">
                          UserName
                        </span>
                        <input
                          type="text"
                          className="form-control py-2"
                          placeholder="Username"
                          aria-label="Username"
                          aria-describedby="basic-addon1"
                          defaultValue={user.userName}
                          disabled
                        />
                      </div>
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-md-6">
                      <div className="input-group mb-3">
                        <span className="input-group-text" id="basic-addon1">
                          Tên
                        </span>
                        <input
                          type="text"
                          className="form-control py-2 py-2"
                          placeholder=""
                          aria-label="Tên"
                          aria-describedby="basic-addon1"
                          defaultValue={user.firstName}
                          name="firstName"
                          onChange={handleChange}
                        />
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="input-group mb-3">
                        <span className="input-group-text" id="basic-addon1">
                          Họ
                        </span>
                        <input
                          type="text"
                          className="form-control py-2"
                          placeholder=""
                          aria-label="Họ"
                          aria-describedby="basic-addon1"
                          defaultValue={user.lastName}
                          name="lastName"
                          onChange={handleChange}
                        />
                      </div>
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-md-6">
                      <div className="input-group mb-3">
                        <input
                          type="text"
                          className="form-control py-2"
                          placeholder="Email"
                          aria-label="Email"
                          aria-describedby="basic-addon2"
                          defaultValue={user.email.split("@")[0]}
                          disabled
                        />
                        <span className="input-group-text" id="basic-addon2">
                          @{user.email.split("@")[1]}
                        </span>
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="input-group mb-3">
                        <span className="input-group-text" id="basic-addon2">
                          Di động
                        </span>
                        <input
                          type="text"
                          className="form-control py-2"
                          placeholder="Số điện thoại"
                          aria-label="Số điện thoại"
                          aria-describedby="basic-addon2"
                          defaultValue={user.phoneNumber}
                          name="phoneNumber"
                          onChange={handleChange}
                        />
                      </div>
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-md-6">
                      <div className="input-group mb-3">
                        <span className="input-group-text">Ngày sinh</span>
                        <input
                          type="date"
                          className="form-control py-2"
                          placeholder="Ngày sinh"
                          aria-label="dob"
                          aria-describedby="basic-addon2"
                          defaultValue={user.dob}
                          name="dob"
                          onChange={handleChange}
                        />
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="input-group mb-3">
                        <span className="input-group-text">Giới tính</span>
                        <select
                          className="form-select py-2"
                          name="sex"
                          id="sex"
                          placeholder="Giới tính"
                          onChange={handleChange}
                          defaultValue={user.sex}
                        >
                          <option value="" className="d-none">
                            Chọn giới tính
                          </option>
                          <option value="male">Nam</option>
                          <option value="female">Nữ</option>
                        </select>
                      </div>
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-lg-12 mb-3">
                      <textarea
                        className="form-control"
                        name="address"
                        rows="2"
                        placeholder="Địa chỉ"
                        onChange={handleChange}
                        defaultValue={user.address}
                      ></textarea>
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-lg-12 mb-3">
                      <textarea
                        className="form-control"
                        name="description"
                        rows="4"
                        placeholder="Mô tả ngắn về bản thân..."
                        onChange={handleChange}
                        defaultValue={user.description}
                      ></textarea>
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-md-12">
                      <button
                        className="btn btn-dark w-25 py-2"
                        type="button"
                        data-bs-toggle="modal"
                        data-bs-target="#confirmModal"
                      >
                        Lưu
                      </button>
                    </div>
                    <div
                      className="modal fade"
                      id="confirmModal"
                      tabIndex="-1"
                      aria-labelledby="confirmModalLabel"
                      aria-hidden="true"
                    >
                      <div className="modal-dialog modal-dialog-centered">
                        <div className="modal-content">
                          <div className="modal-body d-flex flex-column gap-4">
                            <div className="d-flex justify-content-between">
                              <h3
                                className="modal-title fs-5"
                                id="updateProfileLabel"
                              >
                                Hệ thống cần xác nhận
                              </h3>
                              <button
                                type="button"
                                className="btn-close"
                                data-bs-dismiss="modal"
                                aria-label="Close"
                              ></button>
                            </div>
                            Bạn có chắc chắn muốn cập nhật hồ sơ?
                            <div className="d-flex justify-content-end gap-2">
                              <button
                                type="button"
                                className="btn btn-secondary"
                                data-bs-dismiss="modal"
                              >
                                Đóng
                              </button>
                              <button type="submit" className="btn btn-success">
                                Lưu thay đổi
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </form>
              </section>
            </div>
            <div className="col-lg-3">
              <section className="terus-section sticky-top">
                <div className="row">
                  <i className="bi bi-person-square terus-user-avatar center"></i>
                  <h2 className="center">{user.userName}</h2>
                  <small className="text-center">{role}</small>
                  <p>{user.description}</p>
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
