import { useSearchParams } from "react-router-dom";
import "./Department.scss";
import { useContext, useEffect, useState } from "react";
import api from "../../Utils/api";
import { Show } from "../../Components/Show/Show";
import { AdminContext } from "../../Layouts/Admin/AdminLayout";

const Department = () => {
  const [urlParams, setUrlParams] = useSearchParams();
  const [tab, setTab] = useState("All");
  const [newPayload, setNewPayload] = useState({
    name: "",
    address: "",
  });
  const [newStatus, setNewStatus] = useState("pending");
  const [errorText, setErrorText] = useState({
    Name: [""],
    Address: [""],
  });
  const { setNotification } = useContext(AdminContext);
  const [departments, setDepartments] = useState([]);

  useEffect(() => {
    if (!urlParams.has("Tab")) {
      setUrlParams({ Tab: "All" });
    }
    api.get('departments').then(res => setDepartments(res.data))
  }, []);

  useEffect(() => {
    setTab(urlParams.get("Tab"));
  }, [urlParams]);

  function handleChange(e) {
    setNewPayload({ ...newPayload, [e.target.name]: e.target.value });
  }

  function handleAddNew(e) {
    e.preventDefault();
    console.log(newPayload);
    api
      .post("departments", newPayload)
      .then(() => {
        setNewStatus("success");
        setNotification([
          {
            status: "show",
            type: "success",
            title: "Hệ thống",
            time: Date.now(),
            content: "Thêm mới phòng ban thành công.",
          },
        ]);
      })
      .catch((err) => {
        console.log(err);
        setNewStatus("failed");
        setErrorText(err.response.data.errors);
        document.querySelector("#confirmModal button").click();
      });
  }
  return (
    <>
      <div id="terus-department-page" className="p50" data-bs-theme="dark">
        <h2 className="mb-3">Quản lý phòng ban</h2>
        <ul className="nav nav-tabs">
          <li className="nav-item">
            <button
              className={`nav-link ${tab == "All" ? "active" : ""}`}
              onClick={() => {
                setUrlParams({ Tab: "All" });
              }}
            >
              Danh sách
            </button>
          </li>
          <li className="nav-item">
            <button
              className={`nav-link ${tab == "New" ? "active" : ""}`}
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
              className={`nav-link ${tab == "Edit" ? "active" : ""}`}
              onClick={() => {
                setUrlParams({ Tab: "Edit" });
              }}
            >
              Chỉnh sửa
            </button>
          </li>
        </ul>
        <Show>
          <Show.When isTrue={tab === "All"}>
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
                        <th scope="col">Tên</th>
                        <th scope="col">Địa chỉ</th>
                        <th scope="col">Hành động</th>
                      </tr>
                    </thead>
                    <tbody>
                      {Array.from(departments).map((department, index) => (
                        <tr key={department.id}>
                          <th scope="row">{index + 1}</th>
                          <td>{department.name}</td>
                          <td>
                            {department.address}
                          </td>
                          <td className="action-column">
                            <div className="action-container">
                              <i className="bi bi-eye-fill action-item"></i>
                              <i
                                className="bi bi-pencil-square text-success action-item"
                                onClick={() => {
                                  // setToEdit("absdfs");
                                }}
                              ></i>
                              <i className="bi bi-trash-fill text-danger action-item"></i>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
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
                    <button type="button" className="btn btn-outline-light">
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
          <Show.When isTrue={tab === "New"}>
            <div className="card card-body bg-transparent mt-3">
              <form onSubmit={handleAddNew}>
                <div className="mb-3">
                  <label
                    htmlFor="exampleFormControlInput1"
                    className="form-label"
                  >
                    Tên phòng ban mới
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="exampleFormControlInput1"
                    placeholder="Ví dụ: phòng kỹ thuật..."
                    name="name"
                    onChange={handleChange}
                  />
                </div>
                <Show>
                  <Show.When isTrue={newStatus === "failed"}>
                    <div className="row mb-3">
                      <div className="col-md-12">
                        <span className="text-danger">{errorText.Address}</span>
                      </div>
                    </div>
                  </Show.When>
                </Show>
                <div className="mb-3">
                  <label
                    htmlFor="exampleFormControlTextarea1"
                    className="form-label"
                  >
                    Địa chỉ
                  </label>
                  <textarea
                    className="form-control"
                    id="exampleFormControlTextarea1"
                    rows="3"
                    placeholder="Ví dụ: Tầng abc, tòa xyz, đường Lê Văn Việt, quận 9, thành phố Hồ Chí Minh..."
                    name="address"
                    onChange={handleChange}
                  ></textarea>
                </div>
                <Show>
                  <Show.When isTrue={newStatus === "failed"}>
                    <div className="row mb-3">
                      <div className="col-md-12">
                        <span className="text-danger">{errorText.Address}</span>
                      </div>
                    </div>
                  </Show.When>
                </Show>
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
                          <h1
                            className="modal-title fs-5"
                            id="confirmModalLabel"
                          >
                            Hệ thống cần xác nhận
                          </h1>
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
          <Show.Else> </Show.Else>
        </Show>
      </div>
    </>
  );
};

export default Department;
