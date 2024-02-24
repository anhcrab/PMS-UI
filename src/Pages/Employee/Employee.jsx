import { useSearchParams } from "react-router-dom";
import "./Employee.scss";
import { useContext, useEffect, useState } from "react";
import { Show } from "../../Components/Show/Show";
import { checkExpireToken } from "../../Utils/utils";
import api from "../../Utils/api";
import { AdminContext } from "../../Layouts/Admin/AdminLayout";

const DEPARTMENT = {
  [0]: "Không có",
  [1]: "Phòng kinh doanh",
  [2]: "Phòng marketing",
  [3]: "Phòng hành chính",
  [4]: "Phòng nhân sự",
  [5]: "Phòng kế toán",
};

const EMPLOYEESTATUS = {
  [0]: "FREE",
  [1]: "EMPLOYED",
  [2]: "FIRED",
  [3]: "RETIRED",
};

const Employee = () => {
  const [urlParams, setUrlParams] = useSearchParams();
  const [users, setUsers] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [newEmployee, setNewEmployee] = useState({
    id: "",
    supervisorId: "",
    department: "",
  });
  const [editEmployee, setEditEmployee] = useState({
    id: "",
    email: "",
    firstName: "",
    lastName: "",
    department: 0,
    position: "",
    supervisorId: "",
  });
  const [deleteId, setDeleteId] = useState("none");
  const [watchId, setWatchId] = useState("none");
  const { setNotification } = useContext(AdminContext);
  useEffect(() => {
    if (checkExpireToken()) location.href = "/Auth?Action=Login";
    if (!urlParams.has("Tab")) {
      setUrlParams({ Tab: "All" });
    }
    api.get("users").then((res) => {
      setUsers(res.data);
    });
    api.get("employees").then((res) => {
      setEmployees(res.data);
    });
  }, [setUrlParams, urlParams]);

  useEffect(() => {
    if (urlParams.get("Tab") === "Edit") {
      api
        .get(`users/${urlParams.get("Id")}`)
        .then((res) => setEditEmployee(res.data))
        .catch((err) => console.log(err));
    }
  }, [urlParams, users]);

  useEffect(() => {
    if (deleteId !== "none") {
      setUrlParams({ Tab: "Delete" });
    }
  }, [deleteId, setUrlParams]);

  useEffect(() => {
    // if (watchId !== "none") {
    //   setUrlParams({ Tab: "Watch" })
    // }
  }, [setUrlParams, watchId]);

  function handlePrint() {
    const printTarget = document.getElementById("list-table");
    const newWin = window.open("");
    newWin.document.write(printTarget.outerHTML);
    newWin.print();
    newWin.close();
  }

  function handleNewChange(e) {
    setNewEmployee({ ...newEmployee, [e.target.name]: e.target.value });
  }

  function handleEditChange(e) {
    setEditEmployee({ ...editEmployee, [e.target.name]: e.target.value });
  }

  function handleNewSubmit(e) {
    e.preventDefault();
    if (checkExpireToken()) location.href = "/Auth?Action=Login";
    console.log(newEmployee);
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

  function handleEditSubmit(e) {
    e.preventDefault();
    if (checkExpireToken()) location.href = "/Auth?Action=Login";
    console.log(editEmployee);
    api
      .put(`users/${urlParams.get("Id")}`, editEmployee)
      .then(() => {
        document.querySelector("#editModal button.btn-close").click();
        setDeleteId("none");
        setUrlParams({ Tab: "All" });
      })
      .catch((err) => {
        console.log(err);
      });
  }

  function handleDelete() {
    api
      .delete(`employees/${deleteId}`)
      .then(() => {
        document.querySelector("#deleteModal button.btn-close").click();
        setUrlParams({ Tab: "All" });
        setNotification([
          {
            status: "show",
            type: "default",
            title: "Hệ thống",
            time: Date.now(),
            content: "Xóa thành công!",
          },
        ]);
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
        <Show.When
          isTrue={
            urlParams.get("Tab") === "All" ||
            urlParams.get("Tab") === "Delete" ||
            urlParams.get("Tab") === "Watch"
          }
        >
          <div className="card card-body bg-transparent mt-3">
            <div id="list-table-colapse">
              <div id="list-table">
                <table
                  className="table table-hover table-striped"
                  style={{
                    "--bs-table-bg": "transparent",
                  }}
                >
                  <thead>
                    <tr>
                      <th scope="col">#</th>
                      <th scope="col">Họ Tên</th>
                      <th scope="col">Phòng Ban</th>
                      <th scope="col">Chức vụ</th>
                      <th scope="col">Email</th>
                      <th scope="col">Hành động</th>
                    </tr>
                  </thead>
                  <tbody>
                    {Array.from(employees).map((item, index) => (
                      <tr key={item.id}>
                        <th scope="row">{index + 1}</th>
                        <td>{item.lastName + " " + item.firstName}</td>
                        <td>{DEPARTMENT[item.department]}</td>
                        <td>{item.position}</td>
                        <td>{item.email}</td>
                        <td className="action-column">
                          <div className="action-container">
                            <i
                              className="bi bi-eye-fill action-item"
                              onClick={() => {
                                setWatchId(item.id);
                              }}
                              data-bs-toggle="modal"
                              data-bs-target="#watchModal"
                            ></i>
                            <i
                              className="bi bi-pencil-square text-success action-item"
                              onClick={() => {
                                setUrlParams({
                                  Tab: "Edit",
                                  Id: item.id,
                                });
                              }}
                            ></i>
                            <i
                              className="bi bi-trash-fill text-danger action-item"
                              onClick={() => {
                                setDeleteId(item.id);
                              }}
                              data-bs-toggle="modal"
                              data-bs-target="#deleteModal"
                            ></i>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <div
                  className="modal fade"
                  id="deleteModal"
                  tabIndex="-1"
                  aria-labelledby="deleteModalLabel"
                  aria-hidden="true"
                  data-bs-backdrop="static"
                >
                  <div className="modal-dialog">
                    <div className="modal-content">
                      <div className="modal-header">
                        <h3 className="modal-title fs-5" id="deleteModalLabel">
                          Hệ thống cần xác nhận
                        </h3>
                        <button
                          type="button"
                          className="btn-close"
                          data-bs-dismiss="modal"
                          aria-label="Close"
                          onClick={() => {setUrlParams({Tab: "All"})}}
                          ></button>
                      </div>
                      <div className="modal-body">
                        Bạn có chắc chắn muốn xóa nhân viên này?
                      </div>
                      <div className="modal-footer">
                        <button
                          type="button"
                          className="btn btn-secondary"
                          data-bs-dismiss="modal"
                          onClick={() => {setUrlParams({Tab: "All"})}}
                        >
                          Đóng
                        </button>
                        <button
                          type="button"
                          className="btn btn-primary"
                          onClick={handleDelete}
                        >
                          Xóa
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
                <div
                  className="modal fade"
                  id="watchModal"
                  tabIndex="-1"
                  aria-labelledby="watchModalLabel"
                  aria-hidden="true"
                  data-bs-backdrop="static"
                >
                  <div className="modal-dialog modal-xl">
                    <div className="modal-content">
                      <div className="modal-body">
                        <button
                          type="button"
                          className="btn-close"
                          data-bs-dismiss="modal"
                          aria-label="Close"
                        ></button>
                        <h3 className="modal-title fs-5" id="watchModalLabel">
                          Thông tin về nhân viên #1
                        </h3>
                        abcxyz
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="d-flex justify-content-between mt-4">
                <div className="btn-group" role="group">
                  <button type="button" className="btn btn-outline-light">
                    <i className="bi bi-file-earmark-excel text-success"></i>{" "}
                    Sheet
                  </button>
                  <button type="button" className="btn btn-outline-light">
                    <i className="bi bi-file-earmark-pdf text-danger"></i> PDF
                  </button>
                  <button
                    type="button"
                    className="btn btn-outline-light"
                    onClick={handlePrint}
                  >
                    <i className="bi bi-printer text-primary"></i> Print
                  </button>
                </div>
                <nav aria-label="Page navigation">
                  <ul className="pagination" style={{ marginBottom: "0" }}>
                    <li className="page-item">
                      <button className="page-link" aria-label="Previous">
                        <i className="bi bi-arrow-left"></i>
                      </button>
                    </li>
                    <li className="page-item">
                      <button className="page-link">1</button>
                    </li>
                    <li className="page-item">
                      <button className="page-link">2</button>
                    </li>
                    <li className="page-item">
                      <button className="page-link">3</button>
                    </li>
                    <li className="page-item">
                      <button className="page-link">4</button>
                    </li>
                    <li className="page-item">
                      <button className="page-link">5</button>
                    </li>
                    <li className="page-item">
                      <button className="page-link" aria-label="Next">
                        <i className="bi bi-arrow-right"></i>
                      </button>
                    </li>
                  </ul>
                </nav>
              </div>
            </div>
          </div>
        </Show.When>
        <Show.When isTrue={urlParams.get("Tab") === "New"}>
          <div className="card card-body bg-transparent mt-3">
            <form onSubmit={handleNewSubmit}>
              <div className="mb-3">
                <label htmlFor="" className="form-label">
                  Tài khoản
                </label>
                <select
                  className="form-select"
                  name="id"
                  onChange={handleNewChange}
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
                  onChange={handleNewChange}
                >
                  <option value={0}>Chọn Phòng ban</option>
                  <option value={1}>Phòng Kinh Doanh</option>
                  <option value={2}>Phòng Marketing</option>
                  <option value={3}>Phòng Hành Chính</option>
                  <option value={4}>Phòng Nhân sự</option>
                  <option value={5}>Phòng Kế Toán</option>
                </select>
              </div>
              <div className="mb-3">
                <label htmlFor="" className="form-label">
                  Người quản lý
                </label>
                <select
                  className="form-select"
                  name="supervisorId"
                  onChange={handleNewChange}
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
                        Bạn có chắc chắn muốn thêm mới nhân viên ?
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
        <Show.Else>
          <div className="card card-body bg-transparent mt-3">
            <form onSubmit={handleEditSubmit}>
              <div className="mb-3">
                <h4>
                  Nhân viên {editEmployee.firstName + editEmployee.lastName}
                </h4>
              </div>
              <div className="mb-3">
                <label htmlFor="" className="form-label">
                  Phòng ban
                </label>
                <select
                  className="form-select"
                  name="department"
                  onChange={handleEditChange}
                  defaultValue={editEmployee.department}
                >
                  <option value={0}>Chọn Phòng ban</option>
                  <option value={1}>Phòng Kinh Doanh</option>
                  <option value={2}>Phòng Marketing</option>
                  <option value={3}>Phòng Hành Chính</option>
                  <option value={4}>Phòng Nhân sự</option>
                  <option value={5}>Phòng Kế Toán</option>
                </select>
              </div>
              <div className="mb-3">
                <label htmlFor="" className="form-label">
                  Chức vụ
                </label>
                <input
                  type="text"
                  name="position"
                  className="form-control"
                  onChange={handleEditChange}
                  defaultValue={editEmployee.position}
                />
              </div>
              <div className="mb-3">
                <label htmlFor="" className="form-label">
                  Người quản lý
                </label>
                <select
                  className="form-select"
                  name="supervisorId"
                  onChange={handleEditChange}
                  defaultValue={editEmployee.supervisorId}
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
                    data-bs-target="#editModal"
                  >
                    Lưu
                  </button>
                </div>
                <div
                  className="modal fade"
                  id="editModal"
                  tabIndex="-1"
                  aria-labelledby="editModalLabel"
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
                        Bạn có chắc chắn muốn cập nhật thông tin nhân viên này?
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
                          Cập nhật
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </form>
          </div>
        </Show.Else>
      </Show>
    </div>
  );
};

export default Employee;
