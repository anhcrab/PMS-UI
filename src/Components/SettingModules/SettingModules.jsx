import { useEffect, useState } from "react";
import "./SettingModules.scss";
import { useSearchParams } from "react-router-dom";
import api from "../../Utils/api";

// eslint-disable-next-line react/prop-types
const SettingModules = () => {
  const [urlParams, setUrlParams] = useSearchParams();
  return (
    <>
      {urlParams.get("Action") == "List" && <List />}
      {urlParams.get("Action") == "Add" && <Add />}
      {urlParams.get("Action") == "Edit" && <Edit />}
    </>
  );
};

export default SettingModules;

const List = () => {
  const [setUrlParams] = useSearchParams();
  const [modules, setModules] = useState([]);
  const [trigger, setTrigger] = useState(true);
  useEffect(() => {
    api.get("modules").then(({ data }) => {
      setModules(data);
    });
  }, [trigger]);
  const handleEdit = () => {};
  return (
    <>
      <div className="terus-heading-inline">
        <h4>Quản trị Modules</h4>
        <button
          className="terus-button"
          onClick={() => {
            setUrlParams({
              Page: "Modules",
              Action: "Add",
            });
          }}
        >
          Thêm mới
        </button>
      </div>
      <table className="table table-dark terus-table">
        <thead>
          <tr>
            <th scope="col">
              <input className="form-check-input" type="checkbox" name="id" id="module-all" value={0} />
              <label className="form-check-label" htmlFor="module-all"></label>
            </th>
            <th scope="col">Tên</th>
            <th scope="col">Đường dẫn</th>
            <th scope="col">Icon Class</th>
            <th scope="col">Tác giả</th>
            <th scope="col">Thông tin</th>
            <th scope="col">Hành động</th>
          </tr>
        </thead>
        <tbody>
          {modules &&
            modules.map((module) => {
              return (
                <tr key={module.id}>
                  <th scope="row">
                    <input
                      type="checkbox"
                      name="id"
                      id={"module-" + module.id}
                      value={module.id}
                      className="form-check-input"
                    />
                  </th>
                  <td>{module.name}</td>
                  <td>{module.slug}</td>
                  <td>{module.iconClass}</td>
                  <td>{module.author}</td>
                  <td>
                    v{module.version}
                    <br />
                    {module.description}
                  </td>
                  <td>
                    <button className="terus-button" onClick={handleEdit}>
                      Chỉnh sửa
                    </button>{" "}
                    <button
                      className="terus-button"
                      onClick={() => {
                        api.delete("modules/" + module.id).then(() => {
                          setTrigger(!trigger);
                        });
                      }}
                    >
                      Loại bỏ
                    </button>
                  </td>
                </tr>
              );
            })}
        </tbody>
      </table>
    </>
  );
};

const Add = () => {
  const [payload, setPayload] = useState({
    name: "",
    slug: "",
    iconClass: "",
    version: "",
    author: "",
    description: "",
  });
  const handleOnChange = (e) => {
    setPayload({
      ...payload,
      [e.target.name]: e.target.value,
    });
  };
  const handleOnSubmit = (e) => {
    e.preventDefault();
    api.post("modules", payload);
  };
  return (
    <>
      <h4>
        <i
          className="bi bi-clipboard-pulse gold-text"
          style={{ fontSize: "35px" }}
        ></i>{" "}
        Thêm Module mới
      </h4>
      <form
        id="terus_modules_add"
        className="terus-form"
        onSubmit={handleOnSubmit}
      >
        <div className="terus-field">
          <input
            type="text"
            name="name"
            onChange={handleOnChange}
            placeholder="Tên Module"
          />
        </div>
        <div className="terus-field">
          <input
            type="text"
            name="slug"
            onChange={handleOnChange}
            placeholder="Đường dẫn slug"
          />
        </div>
        <div className="terus-field">
          <input
            type="text"
            name="iconClass"
            onChange={handleOnChange}
            placeholder="Tên class của icon (bootstrap)"
          />
        </div>
        <div className="terus-field">
          <input
            type="text"
            name="version"
            onChange={handleOnChange}
            placeholder="Phiên bản"
          />
        </div>
        <div className="terus-field">
          <input
            type="text"
            name="author"
            onChange={handleOnChange}
            placeholder="Tác giả"
          />
        </div>
        <div className="terus-field">
          <textarea
            cols={5}
            rows={5}
            name="description"
            onChange={handleOnChange}
            placeholder="Mô tả ngắn"
          ></textarea>
        </div>
        <div className="terus-field">
          <button className="terus-button">Thêm mới</button>
        </div>
      </form>
    </>
  );
};

const Edit = () => {
  return <></>;
};
