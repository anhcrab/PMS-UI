import { useEffect, useState } from "react";
import api from "../../Utils/api";
import { Button, Input, Modal, Table, Tooltip, Whisper } from "rsuite";

const SettingProjectTypes = () => {
  const [tableLoading, setTableLoading] = useState(true);
  const [reload, setReload] = useState(false);
  const [types, setTypes] = useState([]);
  const [openAdd, setOpenAdd] = useState(false);
  const [newProjectType, setNewProjectType] = useState({
    name: "",
  });

  const { Column, HeaderCell, Cell } = Table;

  useEffect(() => {
    api
      .get("projecttypes")
      .then((res) => {
        setTypes(res.data);
        setTableLoading(false);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [reload]);

  function handleNewProjectTypeChange(value) {
    setNewProjectType({
      name: value,
    });
  }

  function handleNewProjectTypeSubmit(e) {
    e.preventDefault();
    api
      .post("projecttypes", newProjectType)
      .then(() => {
        setReload(!reload)
        setOpenAdd(false)
      })
      .catch((err) => {
        console.log(err);
      });
  }

  return (
    <div>
      <div data-bs-theme="dark">
        <Button
          onClick={() => setOpenAdd(true)}
          appearance="primary"
          style={{
            "--rs-btn-primary-bg": "var(--gradient-gold)",
            "--rs-btn-primary-hover-bg": "var(--rs-yellow-500)",
            "--rs-btn-primary-active-bg": "var(--rs-yellow-500)",
            "--rs-btn-primary-text": "#000",
            "--rs-btn-primary-hover-text": "#000",
          }}
        >
          Thêm mới
        </Button>
      </div>
      <Table
        height={420}
        width={600}
        className="rounded mt-3 projects-table"
        data={types}
        loading={tableLoading}
        autoHeight={true}
      >
        <Column width={60}>
          <HeaderCell className="fs-6 text-center">#</HeaderCell>
          <Cell className="fs-6 text-center">{(rowdata, index) => index + 1}</Cell>
        </Column>
        <Column flexGrow={1}>
          <HeaderCell className="fs-6 text-center">Tên</HeaderCell>
          <Cell dataKey="name" className="text-center" />
        </Column>
        <Column width={200}>
          <HeaderCell className="text-center fs-6">Hành động</HeaderCell>
          <Cell className="d-flex justify-content-center align-items-center text-center">
            <Whisper
              trigger={"hover"}
              placement="bottom"
              controlId="control-id-edit"
              speaker={<Tooltip>Chỉnh sửa</Tooltip>}
            >
              <i
                className="bi bi-pencil-square text-success fs-5 me-3"
                style={{
                  cursor: "pointer",
                }}
              ></i>
            </Whisper>
            <Whisper
              trigger={"hover"}
              placement="bottom"
              controlId="control-id-edit"
              speaker={<Tooltip>Xóa vĩnh viễn</Tooltip>}
            >
              <i
                className="bi bi-trash-fill text-danger fs-5"
                style={{
                  cursor: "pointer",
                }}
              ></i>
            </Whisper>
          </Cell>
        </Column>
      </Table>
      <Modal
        open={openAdd}
        onClose={() => {
          setOpenAdd(false);
        }}
        size={"xs"}
        backdrop="static"
      >
        <form
          style={{ overflow: "hidden" }}
          onSubmit={handleNewProjectTypeSubmit}
        >
          <Modal.Header>
            <Modal.Title>Tạo loại mới</Modal.Title>
          </Modal.Header>
          <Modal.Body style={{ overflow: "hidden" }}>
            <div className="row">
              <div className="col-12">
                <Input
                  name="name"
                  placeholder="Tên"
                  onChange={handleNewProjectTypeChange}
                  size="lg"
                />
              </div>
            </div>
          </Modal.Body>
          <Modal.Footer>
            <Button appearance="primary" color="green" type="submit">
              Xác nhận
            </Button>
            <Button
              appearance="subtle"
              onClick={() => {
                setOpenAdd(false);
              }}
            >
              Hủy
            </Button>
          </Modal.Footer>
        </form>
      </Modal>
    </div>
  );
};

export default SettingProjectTypes;
