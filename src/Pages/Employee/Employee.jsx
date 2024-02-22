import { useSearchParams } from "react-router-dom";
import "./Employee.scss";
import { useEffect, useState } from "react";
import { Show } from "../../Components/Show/Show";
import { checkExpireToken } from "../../Utils/utils";
import api from "../../Utils/api";
import List from "../../Components/List/List";

const Employee = () => {
  const [urlParams, setUrlParams] = useSearchParams();
  const [users, setUsers] = useState([]);
  const [newEmployee, setNewEmployee] = useState({
    id: "",
    supervisorId: "",
    department: "",
  });
  useEffect(() => {
    if (checkExpireToken()) location.href = "/Auth?Action=Login";
    if (!urlParams.has("Tab")) {
      setUrlParams({ Tab: "All" });
    }
    api.get("users").then((res) => setUsers(res.data));
  }, [setUrlParams, urlParams]);

  function handlePrint() {
    const printTarget = document.getElementById("list-table");
    const newWin = window.open("");
    newWin.document.write(printTarget.outerHTML);
    newWin.print();
    newWin.close();
  }

  function handleChange(e) {
    setNewEmployee({ ...newEmployee, [e.target.name]: e.target.value });
  }

  function handleSubmit(e) {
    e.preventDefault();
    if (checkExpireToken()) location.href = "/Auth?Action=Login";
    api
      .post("employees", newEmployee)
      .then(() => {
        document.querySelector("#confirmModal button.btn-close").click();
        setUrlParams({ Tab: "All" });
      })
      .catch((err) => {
        console.log(err);
      });
  }

  return (
    <div id="terus-employee-page" className="p50" data-bs-theme="dark">
      <h2 className="mb-3">Quản lý nhân sự</h2>
      <ul className="nav nav-tabs">
        <li className="nav-item">
          <button
            className={`nav-link ${
              urlParams.get("Tab") == "All" ? "active" : ""
            }`}
            onClick={() => {
              setUrlParams({ Tab: "All" });
            }}
          >
            Danh sách
          </button>
        </li>
        <li className="nav-item">
          <button
            className={`nav-link ${
              urlParams.get("Tab") == "New" ? "active" : ""
            }`}
            onClick={() => {
              setUrlParams({ Tab: "New" });
            }}
          >
            Thêm
          </button>
        </li>
        <li className="nav-item">
          <button
            disabled
            className={`nav-link ${
              urlParams.get("Tab") == "Edit" ? "active" : ""
            }`}
            onClick={() => {
              setUrlParams({ Tab: "Edit" });
            }}
          >
            Chỉnh sửa
          </button>
        </li>
      </ul>
      <Show>
        <Show.When isTrue={urlParams.get("Tab") === "All"}>
          <List cols={cols} endpoint={endpoint} actions={actions} />
        </Show.When>
        <Show.When isTrue={urlParams.get("Tab") === "New"}>
          <div className="card card-body bg-transparent mt-3">
            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label htmlFor="" className="form-label">
                  Tài khoản
                </label>
                <select
                  className="form-select"
                  name="id"
                  onChange={handleChange}
                >
                  <option value="">Chọn tài khoản</option>
                  {Array.from(users).map((user) => (
                    <option key={user.id} value={user.id}>
                      {user.email}
                    </option>
                  ))}
                </select>
              </div>
              <div className="mb-3">
                <label htmlFor="" className="form-label">
                  Phòng ban
                </label>
                <select
                  className="form-select"
                  name="department"
                  onChange={handleChange}
                >
                  <option value="">Chọn Phòng ban</option>
                  <option value="HR">Phòng Nhân sự</option>
                  <option value="ACCOUNTING">Phòng Kế Toán</option>
                  <option value="BUSINESS">Phòng Kinh Doanh</option>
                  <option value="MARKETING">Phòng Marketing</option>
                  <option value="ADMINISTRATION">Phòng Hành Chính</option>
                </select>
              </div>
              <div className="mb-3">
                <label htmlFor="" className="form-label">
                  Người quản lý
                </label>
                <select
                  className="form-select"
                  name="supervisorId"
                  onChange={handleChange}
                >
                  <option value="">Chọn Người Giám Sát</option>
                  {Array.from(users).map((user) => (
                    <option key={user.id} value={user.id}>
                      {user.email}
                    </option>
                  ))}
                </select>
              </div>
              <div className="row mb-3">
                <div className="col-md-12">
                  <button
                    className="btn btn-dark w-25 py-2"
                    type="button"
                    data-bs-toggle="modal"
                    data-bs-target="#confirmModal"
                  >
                    Thêm mới
                  </button>
                </div>
                <div
                  className="modal fade"
                  id="confirmModal"
                  tabIndex="-1"
                  aria-labelledby="confirmModalLabel"
                  aria-hidden="true"
                >
                  <div className="modal-dialog">
                    <div className="modal-content">
                      <div className="modal-header">
                        <h3 className="modal-title fs-5" id="confirmModalLabel">
                          Hệ thống cần xác nhận
                        </h3>
                        <button
                          type="button"
                          className="btn-close"
                          data-bs-dismiss="modal"
                          aria-label="Close"
                        ></button>
                      </div>
                      <div className="modal-body">
                        Bạn có chắc chắn muốn thêm mới phòng ban ?
                      </div>
                      <div className="modal-footer">
                        <button
                          type="button"
                          className="btn btn-secondary"
                          data-bs-dismiss="modal"
                        >
                          Đóng
                        </button>
                        <button type="submit" className="btn btn-primary">
                          Thêm mới
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </form>
          </div>
        </Show.When>
      </Show>
    </div>
  );
};

export default Employee;

const cols = [
  {
    key: "firstName",
    name: "Tên",
  },
  {
    key: "lastName",
    name: "Họ",
  },
  {
    key: "department",
    name: "Phòng Ban",
  },
  {
    key: "position",
    name: "Chức vụ",
  },
  {
    key: "email",
    name: "Email",
  },
];
const endpoint = "employees";
const actions = {
  turnOn: true,
  watch: {
    isAllowed: true,
  },
  edit: {
    isAllowed: true,
  },
  delete: {
    isAllowed: true,
  },
};
