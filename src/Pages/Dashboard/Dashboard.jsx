import { useContext, useEffect, useState } from "react";
import "./Dashboard.scss";
import Loading from "../../Components/Loading/Loading";
import { AdminContext } from "../../Layouts/Admin/AdminLayout";

const Dashboard = () => {
  const { setHeading } = useContext(AdminContext)
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    setHeading("Dashboard")
    setTimeout(() => {
      setLoading(false);
    }, 1000 * 1);
  }, []);
  return (
    <>
      {loading && <Loading />}
      <div id="terus-dashboard">
        <div className="m-4">
          <div className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb-3 border-bottom ">
            <div
              className="btn-toolbar mb-2 mb-md-0"
              style={{ height: "fit-content" }}
            >
              <div className="btn-group me-2">
                <button
                  type="button"
                  className="btn btn-sm btn-outline-secondary"
                  style={{
                    height: "fit-content",
                  }}
                >
                  Share
                </button>
                <button
                  type="button"
                  className="btn btn-sm btn-outline-secondary"
                  style={{
                    height: "fit-content",
                  }}
                >
                  Export
                </button>
              </div>
              <button
                type="button"
                className="btn btn-sm btn-outline-secondary dropdown-toggle d-flex align-items-center gap-1"
                style={{
                  height: "fit-content",
                }}
              >
                <i className="bi bi-calendar3"></i>
                This week
              </button>
            </div>
          </div>

          <canvas
            className="my-4 w-100"
            id="myChart"
            width="1531"
            height="646"
            style={{
              display: "block",
              boxSizing: "border-box",
              height: "57px",
              width: "1367px",
            }}
          ></canvas>

          <h2>Section title</h2>
          <div className="table-responsive small">
            <table className="table table-striped table-sm">
              <thead>
                <tr>
                  <th scope="col">#</th>
                  <th scope="col">Header</th>
                  <th scope="col">Header</th>
                  <th scope="col">Header</th>
                  <th scope="col">Header</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>1,001</td>
                  <td>random</td>
                  <td>data</td>
                  <td>placeholder</td>
                  <td>text</td>
                </tr>
                <tr>
                  <td>1,002</td>
                  <td>placeholder</td>
                  <td>irrelevant</td>
                  <td>visual</td>
                  <td>layout</td>
                </tr>
                <tr>
                  <td>1,003</td>
                  <td>data</td>
                  <td>rich</td>
                  <td>dashboard</td>
                  <td>tabular</td>
                </tr>
                <tr>
                  <td>1,003</td>
                  <td>information</td>
                  <td>placeholder</td>
                  <td>illustrative</td>
                  <td>data</td>
                </tr>
                <tr>
                  <td>1,004</td>
                  <td>text</td>
                  <td>random</td>
                  <td>layout</td>
                  <td>dashboard</td>
                </tr>
                <tr>
                  <td>1,005</td>
                  <td>dashboard</td>
                  <td>irrelevant</td>
                  <td>text</td>
                  <td>placeholder</td>
                </tr>
                <tr>
                  <td>1,006</td>
                  <td>dashboard</td>
                  <td>illustrative</td>
                  <td>rich</td>
                  <td>data</td>
                </tr>
                <tr>
                  <td>1,007</td>
                  <td>placeholder</td>
                  <td>tabular</td>
                  <td>information</td>
                  <td>irrelevant</td>
                </tr>
                <tr>
                  <td>1,008</td>
                  <td>random</td>
                  <td>data</td>
                  <td>placeholder</td>
                  <td>text</td>
                </tr>
                <tr>
                  <td>1,009</td>
                  <td>placeholder</td>
                  <td>irrelevant</td>
                  <td>visual</td>
                  <td>layout</td>
                </tr>
                <tr>
                  <td>1,010</td>
                  <td>data</td>
                  <td>rich</td>
                  <td>dashboard</td>
                  <td>tabular</td>
                </tr>
                <tr>
                  <td>1,011</td>
                  <td>information</td>
                  <td>placeholder</td>
                  <td>illustrative</td>
                  <td>data</td>
                </tr>
                <tr>
                  <td>1,012</td>
                  <td>text</td>
                  <td>placeholder</td>
                  <td>layout</td>
                  <td>dashboard</td>
                </tr>
                <tr>
                  <td>1,013</td>
                  <td>dashboard</td>
                  <td>irrelevant</td>
                  <td>text</td>
                  <td>visual</td>
                </tr>
                <tr>
                  <td>1,014</td>
                  <td>dashboard</td>
                  <td>illustrative</td>
                  <td>rich</td>
                  <td>data</td>
                </tr>
                <tr>
                  <td>1,015</td>
                  <td>random</td>
                  <td>tabular</td>
                  <td>information</td>
                  <td>text</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
};

export default Dashboard;
