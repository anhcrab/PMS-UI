import "./Employee.scss";
import { useContext, useEffect, useState } from "react";
import { Show } from "../../Components/Show/Show";
import { checkExpireToken } from "../../Utils/utils";
import api from "../../Utils/api";
import { AdminContext } from "../../Layouts/Admin/AdminLayout";
import Loading from "../../Components/Loading/Loading";
import { utils, writeFile } from "xlsx";
import { Popover } from "bootstrap";

const DEPARTMENT = {
  ["NONE"]: "Không có",
  ["BUSINESS"]: "Phòng kinh doanh",
  ["MARKETING"]: "Phòng marketing",
  ["ADMINISTRATION"]: "Phòng hành chính",
  ["HR"]: "Phòng nhân sự",
  ["ACCOUNTING"]: "Phòng kế toán",
};

const Employee = () => {
  const [loading, setLoading] = useState(true);
  const [deleteId, setDeleteId] = useState("none");
  const [watchId, setWatchId] = useState("none");
  const [users, setUsers] = useState([]);
  const [pagination, setPagination] = useState({
    limit: 20,
    totalItems: 0,
    totalPages: 0,
    currentPage: 1,
  });
  const [employees, setEmployees] = useState([]);
  const [employee, setEmployee] = useState({
    id: "",
    userName: "",
    firstName: "",
    lastName: "",
    email: "",
    sex: "male",
    dob: "",
    hometown: "",
    address: "",
    phoneNumber: "",
    department: "0",
    position: "",
    supervisorId: "",
    description: "",
    additionalInfo: "",
    status: "",
  });
  const [newEmployee, setNewEmployee] = useState({
    id: "",
    supervisorId: "",
    department: "",
  });
  const [reload, setReload] = useState(false);
  const { accessControl, setNotification } = useContext(AdminContext);
  const [promotion, setPromotion] = useState("");
  const [demotion, setDemotion] = useState("");
  useEffect(() => {
    setLoading(true);
    if (checkExpireToken()) location.href = "/Auth?Action=Login";
    if (accessControl?.role === "ADMIN") {
      api.get("users").then((res) => {
        setUsers(res.data);
      });
      api.get("employees/page/" + pagination.currentPage).then((res) => {
        setEmployees(res.data?.items);
        setPagination({
          ...pagination,
          totalItems: res.data?.totalItems,
          totalPages: res.data?.totalPages,
        });
        setLoading(false);
      });
      if (watchId !== "none" && watchId !== "new") {
        api
          .get(`users/${watchId}`)
          .then((res) => setEmployee(res.data))
          .catch((err) => console.log(err));
      }
    } else if (accessControl?.role === "MANAGER") {
      api.get("employees/room").then((res) => {
        setEmployees(res.data);
        setLoading(false);
      });
    } else {
      api.get("employees/myteam").then((res) => {
        setEmployees(res.data);
        setLoading(false);
      });
    }
  }, [watchId, reload]);

  useEffect(() => {
    const popoverTriggerList = document.querySelectorAll(
      '[data-bs-toggle="popover"]'
    );
    [...popoverTriggerList].map(
      (popoverTriggerEl) =>
        new Popover(popoverTriggerEl, {
          trigger: "hover",
        })
    );
    document.querySelectorAll(".popover").forEach((popover) => {
      popover.setAttribute("data-bs-theme", "dark");
    });
  }, [employees])

  function handlePrint() {
    const printTarget = document.querySelector("#list-table table");
    const newWin = window.open("Terus");
    newWin.document.write(printTarget.outerHTML);
    newWin.print();
    newWin.close();
  }

  function handleSheet() {
    let ws = utils.json_to_sheet(employees);
    let wb = utils.book_new();
    utils.book_append_sheet(wb, ws, "Đơn đặt xe");
    writeFile(wb, "Danh sách nhân sự.xlsx");
  }

  function handleWatchChange(e) {
    setEmployee({
      ...employee,
      [e.target.name]: e.target.value,
    });
  }

  function handleDelete(e) {
    e.preventDefault();
    api
      .delete(`employees/${deleteId}`)
      .then(() => {
        document.querySelector("#deleteModal button.btn-close").click();
        setDeleteId("none");
        setNotification([
          {
            status: "show",
            type: "default",
            title: "Hệ thống",
            time: Date.now(),
            content: "Xóa thành công!",
          },
        ]);
        api.get("users").then((res) => {
          setUsers(res.data);
        });
        api.get("employees/page/1").then((res) => {
          setEmployees(res.data.items);
        });
      })
      .catch((err) => {
        console.log(err);
      });
  }

  function handleEditSubmit(e) {
    e.preventDefault();
    if (checkExpireToken()) location.href = "/Auth?Action=Login";
    console.log(employee);
    api
      .put(`users/${watchId}`, employee)
      .then(() => {
        document.querySelector("#formModal button.btn-close").click();
        // setWatchId("none");
        // setNotification([
        //   {
        //     status: "show",
        //     type: "default",
        //     title: "Hệ thống",
        //     time: Date.now(),
        //     content: "Cập nhật thành công!",
        //   },
        // ]);
        // api.get("users").then((res) => {
        //   setUsers(res.data);
        // });
        // api.get("employees/page/1").then((res) => {
        //   setEmployees(res.data.items);
        // });
        location.reload();
      })
      .catch((err) => console.log(err));
  }

  function handleNewChange(e) {
    setNewEmployee({
      ...newEmployee,
      [e.target.name]: e.target.value,
    });
  }

  function handleNewSubmit(e) {
    e.preventDefault();
    if (checkExpireToken()) location.href = "/Auth?Action=Login";
    console.log(newEmployee);
    api
      .post("employees", newEmployee)
      .then(() => {
        document.querySelector("#formModal button.btn-close").click();
        api.get("users").then((res) => {
          setUsers(res.data);
        });
        api.get("employees/page/1").then((res) => {
          setEmployees(res.data.items);
        });
        setWatchId("none");
        setNewEmployee({
          id: "",
          supervisorId: "",
          department: "",
        });
      })
      .catch((err) => {
        console.log(err);
      });
  }

  function handlePromotion(e) {
    e.preventDefault();
    api
      .get(`employees/promotion/${promotion}`)
      .then(() => {
        document.querySelector("#deleteModal button.btn-close").click();
        setReload(!reload);
        setPromotion("");
      })
      .catch((err) => console.log(err));
  }

  function handleDemotion(e) {
    e.preventDefault();
    api
      .get(`employees/demotion/${demotion}`)
      .then(() => {
        document.querySelector("#deleteModal button.btn-close").click();
        setReload(!reload);
        setPromotion("");
      })
      .catch((err) => console.log(err));
  }

  return (
    <div id="terus-employee-page" className="p50" data-bs-theme="dark">
      {loading && <Loading />}
      <h2 className="mb-3">
        <Show>
          <Show.When isTrue={accessControl?.role === "EMPLOYEE"}>
            Nhóm của tôi
          </Show.When>
          {/* <Show.When isTrue={accessControl?.role === "MANAGER"}>
            Nhóm của tôi
          </Show.When> */}
          <Show.Else>Quản lý nhân sự</Show.Else>
        </Show>
      </h2>
      <Show>
        <Show.When isTrue={accessControl?.role !== "EMPLOYEE"}>
          <div className="card w-100 d-flex flex-row bg-transparent ps-4 pe-3 py-3 justify-content-between align-items-center">
            <div className="d-flex align-items-center">
              <label className="me-3" htmlFor="search">
                Nhân viên
              </label>
              {/* <div className="card bg-transparent d-flex px-3 flex-row align-items-center">
            <i className="bi bi-search "></i>
            <input
              type="text"
              name=""
              id="search"
              className="bg-transparent p-2"
              placeholder="Tìm kiếm..."
              style={{
                border: "none",
                outline: 0,
              }}
            />
          </div> */}
            </div>
            <div className="d-flex justify-content-between align-items-center">
              <Show>
                <Show.When isTrue={accessControl?.role === "ADMIN"}>
                  <i
                    className="bi bi-plus-circle-fill fs-3 me-3 text-light"
                    data-bs-toggle="modal"
                    data-bs-target="#formModal"
                    onClick={() => {
                      setWatchId("new");
                    }}
                    style={{ cursor: "pointer" }}
                  ></i>
                </Show.When>
              </Show>
              <span
                className="bg-light text-center text-dark me-3 d-flex justify-content-center align-item-center"
                style={{
                  borderRadius: "50%",
                  width: "28px",
                  height: "28px",
                  cursor: "pointer",
                }}
                onClick={() => {
                  setReload(!reload);
                }}
              >
                <i className="bi bi-arrow-clockwise fs-5 fw-bold text-center text-dark"></i>
              </span>
              <div className="btn-group" role="group">
                <button
                  type="button"
                  className="btn btn-outline-light"
                  onClick={handleSheet}
                >
                  <i className="bi bi-file-earmark-excel text-success"></i>{" "}
                  Sheet
                </button>
                {/* <button type="button" className="btn btn-outline-light">
                  <i className="bi bi-file-earmark-pdf text-danger"></i> PDF
                </button> */}
                <button
                  type="button"
                  className="btn btn-outline-light"
                  onClick={handlePrint}
                >
                  <i className="bi bi-printer text-primary"></i> Print
                </button>
              </div>
            </div>
          </div>
        </Show.When>
      </Show>
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
                  <th scope="col">Phòng ban</th>
                  <th scope="col">Vị trí</th>
                  <th scope="col">Email</th>
                  <Show>
                    <Show.When isTrue={accessControl?.role !== "EMPLOYEE"}>
                      <th scope="col">Hành động</th>
                    </Show.When>
                  </Show>
                </tr>
              </thead>
              <tbody>
                {Array.from(employees).map((item, index) => (
                  <tr
                    key={item.id}
                    onClick={() => {
                      setWatchId(item.id);
                    }}
                    data-bs-toggle="modal"
                    data-bs-target="#formModal"
                  >
                    <th scope="row">{index + 1}</th>
                    <td>{item.lastName + " " + item.firstName}</td>
                    <td>{DEPARTMENT[item.department]}</td>
                    <td>{item.position}</td>
                    <td>{item.email}</td>
                    <Show>
                      <Show.When isTrue={accessControl?.role !== "EMPLOYEE"}>
                        <td className="action-column">
                          <div className="action-container">
                            <Show>
                              <Show.When
                                isTrue={accessControl?.role === "ADMIN"}
                              >
                                <i
                                  className="bi bi-arrow-up-circle-fill action-item"
                                  data-bs-toggle="modal"
                                  data-bs-target="#deleteModal"
                                  onClick={() => {
                                    setPromotion(item.id);
                                    setDeleteId("none");
                                    setDemotion("");
                                  }}
                                ></i>
                                <i
                                  className="bi bi-arrow-down-circle-fill action-item"
                                  data-bs-toggle="modal"
                                  data-bs-target="#deleteModal"
                                  onClick={() => {
                                    setDemotion(item.id);
                                    setDeleteId("none");
                                    setPromotion("");
                                  }}
                                ></i>
                              </Show.When>
                            </Show>
                            <i className="bi bi-pencil-square text-success action-item"></i>
                            <i
                              className="bi bi-trash-fill text-danger action-item"
                              onClick={() => {
                                setDeleteId(item.id);
                                setPromotion("");
                                setDemotion("");
                              }}
                              data-bs-toggle="modal"
                              data-bs-target="#deleteModal"
                            ></i>
                          </div>
                        </td>
                      </Show.When>
                    </Show>
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
              <div className="modal-dialog modal-dialog-centered">
                <div className="modal-content">
                  <div className="modal-body d-flex flex-column gap-4">
                    <div className="d-flex justify-content-between">
                      <h3 className="modal-title fs-5" id="deleteModalLabel">
                        Hệ thống cần xác nhận
                      </h3>
                      <button
                        type="button"
                        className="btn-close"
                        data-bs-dismiss="modal"
                        aria-label="Close"
                        id="delete_close_primary"
                        onClick={() => {
                          setDeleteId("none");
                          setPromotion("");
                        }}
                      ></button>
                    </div>
                    <Show>
                      <Show.When isTrue={promotion !== "" && demotion === ""}>
                        Bạn có chắc chắn muốn thăng chức cho nhân viên này?
                        <div className="d-flex justify-content-end gap-2">
                          <button
                            type="button"
                            className="btn btn-secondary"
                            data-bs-dismiss="modal"
                            onClick={() => {
                              setDeleteId("none");
                              setPromotion("");
                            }}
                          >
                            Hủy
                          </button>
                          <button
                            type="button"
                            className="btn btn-primary"
                            onClick={handlePromotion}
                            style={{ minWidth: "120px" }}
                          >
                            Thăng chức
                          </button>
                        </div>
                      </Show.When>
                      <Show.When isTrue={promotion === "" && demotion !== ""}>
                        Bạn có chắc chắn muốn giáng chức cho nhân viên này?
                        <div className="d-flex justify-content-end gap-2">
                          <button
                            type="button"
                            className="btn btn-secondary"
                            data-bs-dismiss="modal"
                            onClick={() => {
                              setDeleteId("none");
                              setDemotion("");
                            }}
                          >
                            Hủy
                          </button>
                          <button
                            type="button"
                            className="btn btn-primary"
                            onClick={handleDemotion}
                            style={{ minWidth: "120px" }}
                          >
                            Giáng chức
                          </button>
                        </div>
                      </Show.When>
                      <Show.Else>
                        Bạn có chắc chắn muốn xóa nhân viên này?
                        <div className="d-flex justify-content-end gap-2">
                          <button
                            type="button"
                            className="btn btn-secondary"
                            data-bs-dismiss="modal"
                            onClick={() => {
                              setDeleteId("none");
                            }}
                          >
                            Hủy
                          </button>
                          <button
                            type="button"
                            className="btn btn-danger"
                            onClick={handleDelete}
                            style={{ minWidth: "120px" }}
                          >
                            Xóa
                          </button>
                        </div>
                      </Show.Else>
                    </Show>
                  </div>
                </div>
              </div>
            </div>
            <div
              className="modal fade"
              id="formModal"
              tabIndex="0"
              aria-labelledby="formModalLabel"
              aria-hidden="true"
              data-bs-backdrop="static"
            >
              <div className="modal-dialog modal-lg modal-dialog-centered modal-dialog-scrollable">
                <div className="modal-content">
                  <div className="modal-body">
                    <Show>
                      <Show.When isTrue={watchId === "new"}>
                        <div className="w-100 d-flex justify-content-between px-3 py-2">
                          <h3 className="modal-title fs-5" id="formModalLabel">
                            Thêm nhân viên mới
                          </h3>
                          <button
                            type="button"
                            className="btn-close"
                            data-bs-dismiss="modal"
                            aria-label="Close"
                            onClick={() => {
                              setWatchId("none");
                            }}
                          ></button>
                        </div>
                        <div className="w-100 px-3 py-2 mt-4">
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
                                <option value="NONE">Chọn Phòng ban</option>
                                <option value="BUSINESS">
                                  Phòng Kinh Doanh
                                </option>
                                <option value="MARKETING">
                                  Phòng Marketing
                                </option>
                                <option value="ADMINISTRATION">
                                  Phòng Hành Chính
                                </option>
                                <option value="HR">Phòng Nhân sự</option>
                                <option value="ACCOUNTING">
                                  Phòng Kế Toán
                                </option>
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
                              <div className="col-md-12 d-flex justify-content-end">
                                <button
                                  className="btn btn-success w-25 py-2"
                                  type="submit"
                                >
                                  Thêm mới
                                </button>
                              </div>
                            </div>
                          </form>
                        </div>
                      </Show.When>
                      <Show.Else>
                        <div className="w-100 d-flex justify-content-between px-3 py-2">
                          <h3 className="modal-title fs-5" id="formModalLabel">
                            {employee.lastName + " " + employee.firstName}
                          </h3>
                          <button
                            type="button"
                            className="btn-close"
                            data-bs-dismiss="modal"
                            aria-label="Close"
                            onClick={() => {
                              setWatchId("none");
                            }}
                          ></button>
                        </div>
                        <div className="w-100 px-3 py-2 mt-4">
                          <form onSubmit={handleEditSubmit}>
                            <div className="row">
                              <div className="col-md-6">
                                <div className="form-floating mb-3">
                                  <input
                                    type="text"
                                    className="form-control"
                                    placeholder="Họ"
                                    name="lastName"
                                    defaultValue={employee.lastName}
                                    onChange={handleWatchChange}
                                  />
                                  <label>Họ</label>
                                </div>
                              </div>
                              <div className="col-md-6">
                                <div className="form-floating mb-3">
                                  <input
                                    type="text"
                                    className="form-control"
                                    placeholder="Tên"
                                    name="firstName"
                                    defaultValue={employee.firstName}
                                    onChange={handleWatchChange}
                                  />
                                  <label>Tên</label>
                                </div>
                              </div>
                            </div>
                            <div className="row">
                              <div className="col-md-6">
                                <div className="form-floating mb-3">
                                  <input
                                    type="text"
                                    className="form-control"
                                    placeholder="Số điện thoại"
                                    name="phoneNumber"
                                    defaultValue={employee.phoneNumber}
                                    onChange={handleWatchChange}
                                  />
                                  <label>Số điện thoại</label>
                                </div>
                              </div>
                              <div className="col-md-6">
                                <div className="form-floating mb-3">
                                  <input
                                    type="text"
                                    className="form-control"
                                    placeholder="Vị trí"
                                    name="position"
                                    defaultValue={employee.position}
                                    onChange={handleWatchChange}
                                  />
                                  <label>Vị trí</label>
                                </div>
                              </div>
                            </div>
                            <div className="row">
                              <div className="col-md-6">
                                <div className="form-floating mb-3">
                                  <select
                                    className="form-select"
                                    placeholder="Phòng ban"
                                    name="department"
                                    value={employee.department}
                                    onChange={handleWatchChange}
                                  >
                                    <option value="NONE">Chọn Phòng ban</option>
                                    <option value="BUSINESS">
                                      Phòng Kinh Doanh
                                    </option>
                                    <option value="MARKETING">
                                      Phòng Marketing
                                    </option>
                                    <option value="ADMINISTRATION">
                                      Phòng Hành Chính
                                    </option>
                                    <option value="HR">Phòng Nhân sự</option>
                                    <option value="ACCOUNTING">
                                      Phòng Kế Toán
                                    </option>
                                  </select>
                                  <label>Phòng ban</label>
                                </div>
                              </div>
                              <div className="col-md-6">
                                <div className="form-floating mb-3">
                                  <select
                                    className="form-select"
                                    placeholder="Người giám sát"
                                    name="supervisorId"
                                    value={employee.supervisorId ?? ""}
                                    onChange={handleWatchChange}
                                  >
                                    <option value="">
                                      Chọn Người Giám Sát
                                    </option>
                                    {Array.from(users).map((user) => (
                                      <option key={user.id} value={user.id}>
                                        {user.email}
                                      </option>
                                    ))}
                                  </select>
                                  <label>Người giám sát</label>
                                </div>
                              </div>
                            </div>
                            <div className="w-100 d-flex justify-content-end mt-4">
                              <button
                                type="submit"
                                className="btn btn-success"
                                style={{
                                  minWidth: "100px",
                                  minHeight: "42px",
                                }}
                              >
                                Lưu
                              </button>
                            </div>
                          </form>
                        </div>
                      </Show.Else>
                    </Show>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <Show>
            <Show.When isTrue={pagination.totalPages > 1}>
              <div className="d-flex justify-content-between mt-4">
                <nav aria-label="Page navigation">
                  <ul className="pagination" style={{ marginBottom: "0" }}>
                    <Show>
                      <Show.When isTrue={pagination.currentPage > 1}>
                        <li className="page-item">
                          <button className="page-link" aria-label="Previous">
                            <i className="bi bi-arrow-left"></i>
                          </button>
                        </li>
                      </Show.When>
                    </Show>
                    {Array.of(pagination.totalPages).map((page, index) => (
                      <li key={index} className="page-item">
                        <button className="page-link">{page}</button>
                      </li>
                    ))}
                    <Show>
                      <Show.When
                        isTrue={
                          pagination.totalPages > 1 &&
                          pagination.currentPage < pagination.totalPages
                        }
                      >
                        <li className="page-item">
                          <button className="page-link" aria-label="Next">
                            <i className="bi bi-arrow-right"></i>
                          </button>
                        </li>
                      </Show.When>
                    </Show>
                  </ul>
                </nav>
              </div>
            </Show.When>
          </Show>
        </div>
      </div>
    </div>
  );
};

export default Employee;
