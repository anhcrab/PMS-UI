/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";
import api from "../../Utils/api";
import { Show } from "../Show/Show";
import { checkExpireToken } from "../../Utils/utils";

const List = ({
  cols,
  endpoint,
  actions = {
    turnOn: true,
    watch: {
      isAllowed: true,
      component: "",
    },
    edit: {
      isAllowed: true,
    },
    delete: {
      isAllowed: true,
    },
  },
  config = {
    pagination: true,
    export: true,
  },
}) => {
  const [data, setData] = useState([]);
  useEffect(() => {
    if (checkExpireToken()) location.href = "/Auth?Action=Login";
    api
      .get(endpoint)
      .then((res) => setData(res.data))
      .catch((err) => {
        console.log(err);
      });
  }, [endpoint]);

  function handlePrint() {
    const printTarget = document.getElementById("list-table");
    const newWin = window.open("");
    newWin.document.write(printTarget.outerHTML);
    newWin.print();
    newWin.close();
  }

  return (
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
                {Array.from(cols).map((col, index) => (
                  <th key={index} scope="col">
                    {col.name}
                  </th>
                ))}
                {actions.turnOn && <th scope="col">Hành động</th>}
              </tr>
            </thead>
            <tbody>
              {Array.from(data).map((item, index) => (
                <tr key={item.id}>
                  <th scope="row">{index + 1}</th>
                  {Array.from(cols).map((col, index) => (
                    <td key={index}>{item[col.key]}</td>
                  ))}
                  <Show>
                    <Show.When isTrue={actions.turnOn}>
                      <td className="action-column">
                        <div className="action-container">
                          <Show>
                            <Show.When isTrue={actions.watch.isAllowed}>
                              <i className="bi bi-eye-fill action-item"></i>
                            </Show.When>
                          </Show>
                          <Show>
                            <Show.When isTrue={actions.edit.isAllowed}>
                              <i
                                className="bi bi-pencil-square text-success action-item"
                                onClick={() => {
                                  // setToEdit("absdfs");
                                }}
                              ></i>
                            </Show.When>
                          </Show>
                          <Show>
                            <Show.When isTrue={actions.delete.isAllowed}>
                              <i
                                className="bi bi-trash-fill text-danger action-item"
                                onClick={() => {
                                  api
                                    .delete(`${endpoint}/${item.id}`)
                                    .then(() => location.reload());
                                }}
                              ></i>
                            </Show.When>
                          </Show>
                        </div>
                      </td>
                    </Show.When>
                  </Show>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="d-flex justify-content-between mt-4">
          <Show>
            <Show.When isTrue={config.export}>
              <div className="btn-group" role="group">
                <button type="button" className="btn btn-outline-light">
                  <i className="bi bi-file-earmark-excel text-success"></i>{" "}
                  Sheet
                </button>
                <button
                  type="button"
                  className="btn btn-outline-light"
                  onClick={handlePrint}
                >
                  <i className="bi bi-printer text-primary"></i> Print
                </button>
              </div>
            </Show.When>
          </Show>
          <Show>
            <Show.When isTrue={config.pagination}>
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
            </Show.When>
          </Show>
        </div>
      </div>
    </div>
  );
};

export default List;
