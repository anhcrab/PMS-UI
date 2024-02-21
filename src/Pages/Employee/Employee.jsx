import { useSearchParams } from "react-router-dom";
import "./Employee.scss";
import { useEffect, useState } from "react";
import { Show } from "../../Components/Show/Show";

const Employee = () => {
  const [urlParams, setUrlParams] = useSearchParams();
  const [tab, setTab] = useState("All");
  useEffect(() => {
    if (!urlParams.has("Tab")) {
      setUrlParams({ Tab: "All" });
    }
  }, []);
  useEffect(() => {
    setTab(urlParams.get("Tab"));
  }, [urlParams]);

  function handlePrint() {
    const printTarget = document.getElementById('list-table')
    const newWin = window.open("")
    newWin.document.write(printTarget.outerHTML);
    newWin.print();
    newWin.close();
  }

  return (
    <div id="terus-employee-page" className="p50" data-bs-theme="dark">
      <h2 className="mb-3">Quản lý nhân sự</h2>
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
                      <th scope="col">Họ Tên</th>
                      <th scope="col">Phòng ban</th>
                      <th scope="col">Vị trí</th>
                      <th scope="col">Hành động</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <th scope="row">1</th>
                      <td>Phan Phúc Thịnh</td>
                      <td>Phòng tổng GĐ</td>
                      <td>CEO</td>
                      <td className="action-column">
                        <div className="action-container">
                          <i
                            className="bi bi-eye-fill action-item"
                            data-bs-toggle="modal"
                            data-bs-target="#employeeModal"
                          ></i>
                          <i className="bi bi-pencil-square text-success action-item"></i>
                          <i className="bi bi-trash-fill text-danger action-item"></i>
                        </div>
                      </td>
                    </tr>
                    <tr>
                      <th scope="row">2</th>
                      <td>Nguyễn Dương Thanh Bình</td>
                      <td>Marketing</td>
                      <td>Marketer</td>
                      <td className="action-column">
                        <div className="action-container">
                          <i
                            className="bi bi-eye-fill action-item"
                            data-bs-toggle="modal"
                            data-bs-target="#employeeModal"
                          ></i>
                          <i className="bi bi-pencil-square text-success action-item"></i>
                          <i className="bi bi-trash-fill text-danger action-item"></i>
                        </div>
                      </td>
                    </tr>
                    <tr>
                      <th scope="row">3</th>
                      <td>Huỳnh Vĩnh Khang</td>
                      <td>Bán Hàng</td>
                      <td>Sales Manager</td>
                      <td className="action-column">
                        <div className="action-container">
                          <i
                            className="bi bi-eye-fill action-item"
                            data-bs-toggle="modal"
                            data-bs-target="#employeeModal"
                          ></i>
                          <i className="bi bi-pencil-square text-success action-item"></i>
                          <i className="bi bi-trash-fill text-danger action-item"></i>
                        </div>
                      </td>
                    </tr>
                    <tr>
                      <th scope="row">4</th>
                      <td>Đặng Quang Anh</td>
                      <td>Công Nghệ</td>
                      <td>Developer</td>
                      <td className="action-column">
                        <div className="action-container">
                          <i
                            className="bi bi-eye-fill action-item"
                            data-bs-toggle="modal"
                            data-bs-target="#employeeModal"
                          ></i>
                          <i className="bi bi-pencil-square text-success action-item"></i>
                          <i className="bi bi-trash-fill text-danger action-item"></i>
                        </div>
                      </td>
                    </tr>
                    <tr>
                      <th scope="row">5</th>
                      <td>Anh Buồi</td>
                      <td>Marketing</td>
                      <td>Content Creator</td>
                      <td className="action-column">
                        <div className="action-container">
                          <i
                            className="bi bi-eye-fill action-item"
                            data-bs-toggle="modal"
                            data-bs-target="#employeeModal"
                          ></i>
                          <i className="bi bi-pencil-square text-success action-item"></i>
                          <i className="bi bi-trash-fill text-danger action-item"></i>
                        </div>
                      </td>
                    </tr>
                    <tr>
                      <th scope="row">6</th>
                      <td>Phan Phúc Thịnh</td>
                      <td>Tổng</td>
                      <td>Director</td>
                      <td className="action-column">
                        <div className="action-container">
                          <i
                            className="bi bi-eye-fill action-item"
                            data-bs-toggle="modal"
                            data-bs-target="#employeeModal"
                          ></i>
                          <i className="bi bi-pencil-square text-success action-item"></i>
                          <i className="bi bi-trash-fill text-danger action-item"></i>
                        </div>
                      </td>
                    </tr>
                    <tr>
                      <th scope="row">7</th>
                      <td>Nguyễn Dương Thanh Bình</td>
                      <td>Marketing</td>
                      <td>Marketer</td>
                      <td className="action-column">
                        <div className="action-container">
                          <i
                            className="bi bi-eye-fill action-item"
                            data-bs-toggle="modal"
                            data-bs-target="#employeeModal"
                          ></i>
                          <i className="bi bi-pencil-square text-success action-item"></i>
                          <i className="bi bi-trash-fill text-danger action-item"></i>
                        </div>
                      </td>
                    </tr>
                    <tr>
                      <th scope="row">8</th>
                      <td>Huỳnh Vĩnh Khang</td>
                      <td>Bán Hàng</td>
                      <td>Sales Manager</td>
                      <td className="action-column">
                        <div className="action-container">
                          <i
                            className="bi bi-eye-fill action-item"
                            data-bs-toggle="modal"
                            data-bs-target="#employeeModal"
                          ></i>
                          <i className="bi bi-pencil-square text-success action-item"></i>
                          <i className="bi bi-trash-fill text-danger action-item"></i>
                        </div>
                      </td>
                    </tr>
                    <tr>
                      <th scope="row">9</th>
                      <td>Đặng Quang Anh</td>
                      <td>Công Nghệ</td>
                      <td>Developer</td>
                      <td className="action-column">
                        <div className="action-container">
                          <i
                            className="bi bi-eye-fill action-item"
                            data-bs-toggle="modal"
                            data-bs-target="#employeeModal"
                          ></i>
                          <i className="bi bi-pencil-square text-success action-item"></i>
                          <i className="bi bi-trash-fill text-danger action-item"></i>
                        </div>
                      </td>
                    </tr>
                    <tr>
                      <th scope="row">10</th>
                      <td>Anh Buồi</td>
                      <td>Marketing</td>
                      <td>Content Creator</td>
                      <td className="action-column">
                        <div className="action-container">
                          <i
                            className="bi bi-eye-fill action-item"
                            data-bs-toggle="modal"
                            data-bs-target="#employeeModal"
                          ></i>
                          <i className="bi bi-pencil-square text-success action-item"></i>
                          <i className="bi bi-trash-fill text-danger action-item"></i>
                        </div>
                      </td>
                    </tr>
                    <tr>
                      <th scope="row">11</th>
                      <td>Phan Phúc Thịnh</td>
                      <td>Tổng</td>
                      <td>Director</td>
                      <td className="action-column">
                        <div className="action-container">
                          <i
                            className="bi bi-eye-fill action-item"
                            data-bs-toggle="modal"
                            data-bs-target="#employeeModal"
                          ></i>
                          <i className="bi bi-pencil-square text-success action-item"></i>
                          <i className="bi bi-trash-fill text-danger action-item"></i>
                        </div>
                      </td>
                    </tr>
                    <tr>
                      <th scope="row">12</th>
                      <td>Nguyễn Dương Thanh Bình</td>
                      <td>Marketing</td>
                      <td>Marketer</td>
                      <td className="action-column">
                        <div className="action-container">
                          <i
                            className="bi bi-eye-fill action-item"
                            data-bs-toggle="modal"
                            data-bs-target="#employeeModal"
                          ></i>
                          <i className="bi bi-pencil-square text-success action-item"></i>
                          <i className="bi bi-trash-fill text-danger action-item"></i>
                        </div>
                      </td>
                    </tr>
                    <tr>
                      <th scope="row">13</th>
                      <td>Huỳnh Vĩnh Khang</td>
                      <td>Bán Hàng</td>
                      <td>Sales Manager</td>
                      <td className="action-column">
                        <div className="action-container">
                          <i
                            className="bi bi-eye-fill action-item"
                            data-bs-toggle="modal"
                            data-bs-target="#employeeModal"
                          ></i>
                          <i className="bi bi-pencil-square text-success action-item"></i>
                          <i className="bi bi-trash-fill text-danger action-item"></i>
                        </div>
                      </td>
                    </tr>
                    <tr>
                      <th scope="row">14</th>
                      <td>Đặng Quang Anh</td>
                      <td>Công Nghệ</td>
                      <td>Developer</td>
                      <td className="action-column">
                        <div className="action-container">
                          <i
                            className="bi bi-eye-fill action-item"
                            data-bs-toggle="modal"
                            data-bs-target="#employeeModal"
                          ></i>
                          <i className="bi bi-pencil-square text-success action-item"></i>
                          <i className="bi bi-trash-fill text-danger action-item"></i>
                        </div>
                      </td>
                    </tr>
                    <tr>
                      <th scope="row">15</th>
                      <td>Anh Buồi</td>
                      <td>Marketing</td>
                      <td>Content Creator</td>
                      <td className="action-column">
                        <div className="action-container">
                          <i
                            className="bi bi-eye-fill action-item"
                            data-bs-toggle="modal"
                            data-bs-target="#employeeModal"
                          ></i>
                          <i className="bi bi-pencil-square text-success action-item"></i>
                          <i className="bi bi-trash-fill text-danger action-item"></i>
                        </div>
                      </td>
                    </tr>
                    <tr>
                      <th scope="row">16</th>
                      <td>Phan Phúc Thịnh</td>
                      <td>Tổng</td>
                      <td>Director</td>
                      <td className="action-column">
                        <div className="action-container">
                          <i
                            className="bi bi-eye-fill action-item"
                            data-bs-toggle="modal"
                            data-bs-target="#employeeModal"
                          ></i>
                          <i className="bi bi-pencil-square text-success action-item"></i>
                          <i className="bi bi-trash-fill text-danger action-item"></i>
                        </div>
                      </td>
                    </tr>
                    <tr>
                      <th scope="row">17</th>
                      <td>Nguyễn Dương Thanh Bình</td>
                      <td>Marketing</td>
                      <td>Marketer</td>
                      <td className="action-column">
                        <div className="action-container">
                          <i
                            className="bi bi-eye-fill action-item"
                            data-bs-toggle="modal"
                            data-bs-target="#employeeModal"
                          ></i>
                          <i className="bi bi-pencil-square text-success action-item"></i>
                          <i className="bi bi-trash-fill text-danger action-item"></i>
                        </div>
                      </td>
                    </tr>
                    <tr>
                      <th scope="row">18</th>
                      <td>Huỳnh Vĩnh Khang</td>
                      <td>Bán Hàng</td>
                      <td>Sales Manager</td>
                      <td className="action-column">
                        <div className="action-container">
                          <i
                            className="bi bi-eye-fill action-item"
                            data-bs-toggle="modal"
                            data-bs-target="#employeeModal"
                          ></i>
                          <i className="bi bi-pencil-square text-success action-item"></i>
                          <i className="bi bi-trash-fill text-danger action-item"></i>
                        </div>
                      </td>
                    </tr>
                    <tr>
                      <th scope="row">19</th>
                      <td>Đặng Quang Anh</td>
                      <td>Công Nghệ</td>
                      <td>Developer</td>
                      <td className="action-column">
                        <div className="action-container">
                          <i
                            className="bi bi-eye-fill action-item"
                            data-bs-toggle="modal"
                            data-bs-target="#employeeModal"
                          ></i>
                          <i className="bi bi-pencil-square text-success action-item"></i>
                          <i className="bi bi-trash-fill text-danger action-item"></i>
                        </div>
                      </td>
                    </tr>
                    <tr>
                      <th scope="row">20</th>
                      <td>Anh Buồi</td>
                      <td>Marketing</td>
                      <td>Content Creator</td>
                      <td className="action-column">
                        <div className="action-container">
                          <i
                            className="bi bi-eye-fill action-item"
                            data-bs-toggle="modal"
                            data-bs-target="#employeeModal"
                          ></i>
                          <i className="bi bi-pencil-square text-success action-item"></i>
                          <i className="bi bi-trash-fill text-danger action-item"></i>
                        </div>
                      </td>
                    </tr>
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
                  <button type="button" className="btn btn-outline-light" onClick={handlePrint}>
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
              <div
                className="modal fade"
                id="employeeModal"
                tabIndex="-1"
                aria-labelledby="confirmModalLabel"
                aria-hidden="true"
              >
                <div className="modal-dialog modal-xl">
                  <div className="modal-content">
                    <div className="modal-header">
                      <h3 className="modal-title fs-5" id="confirmModalLabel">
                        Thông tin về nhân sự Quang Anh Đặng
                      </h3>
                      <button
                        type="button"
                        className="btn-close"
                        data-bs-dismiss="modal"
                        aria-label="Close"
                      ></button>
                    </div>
                    <div className="modal-body">
                      <div className="w-100 h-100 d-flex"></div>
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
          </div>
        </Show.When>
        <Show.When isTrue={tab === "New"}>
          <div className="card card-body bg-transparent mt-3">
            <form>
              <div className="mb-3">
                <label htmlFor="" className="form-label">
                  Tài khoản
                </label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Search tên hoặc ID để tìm tài khoản"
                />
              </div>
              <div className="mb-3">
                <label htmlFor="" className="form-label">
                  Phòng ban
                </label>
                <input className="form-control" placeholder="" />
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
