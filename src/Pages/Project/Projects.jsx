//#region imports
import { useContext, useEffect, useState } from "react";
import "./Projects.scss";
import { AdminContext } from "../../Layouts/Admin/AdminLayout";
import {
  Button,
  DatePicker,
  Drawer,
  Input,
  InputGroup,
  InputNumber,
  Radio,
  RadioGroup,
  SelectPicker,
  Table,
  Pagination,
  Tag,
  Whisper,
  Tooltip,
  Modal,
  Checkbox,
  InlineEdit,
  Dropdown,
  TagPicker,
} from "rsuite";
import api from "../../Utils/api";
import { utils, writeFile } from "xlsx";
import { Show } from "../../Components/Show/Show";
import { authenticate } from "../../Utils/utils";
import { Navigate } from "react-router-dom";
//#endregion

const Projects = () => {
  const { setHeading, accessControl } = useContext(AdminContext);
  const [reload, setReload] = useState(true);
  const [projectTypes, setProjectTypes] = useState([]);
  const [users, setUsers] = useState([]);
  const [open, setOpen] = useState(false);
  const [projects, setProjects] = useState({
    totalItems: 0,
    totalPages: 0,
    items: [],
  });
  const [newProject, setNewProject] = useState({
    name: "",
    budget: "",
    typeId: "",
    responsibleId: "",
    paymentDate: "",
    deadline: "",
    status: "NEW",
  });
  const [editProjectId, setEditProjectId] = useState(null);
  const [editProject, setEditProject] = useState({
    name: "",
    progress: "0",
    budget: "0",
    typeId: "",
    responsibleId: "",
    paymentDate: "",
    deadline: "",
    status: "NEW",
  });
  const [limit, setLimit] = useState(20);
  const [page, setPage] = useState(1);
  const [tableLoading, setTableLoading] = useState(true);
  const [filter, setFilter] = useState({
    typeId: null,
    search: null,
  });
  const [editModal, setEditModal] = useState(false);
  const [trashStatus, setTrashStatus] = useState(false);
  const [multipleChoices, setMutipleChoice] = useState({
    list: [],
    checkedAll: false,
    indeterminate: false,
  });
  const [employees, setEmployees] = useState([]);
  const { Column, HeaderCell, Cell } = Table;

  useEffect(() => {
    setHeading("Dự án");
    authenticate("/Auth/Login", true);
    api
      .get("projecttypes")
      .then((res) => {
        setProjectTypes(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
    api
      .get("employees")
      .then((res) => {
        setEmployees(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
    api
      .get("users?limit=-1&page=1")
      .then((res) => {
        setUsers(Array.from(res.data.items));
      })
      .catch((err) => {
        console.log(err);
      });
    const { typeId, search } = filter;
    let endpoint = `projects?limit=${limit}&page=${page}`;
    if (trashStatus) endpoint = `projects/trash?limit=${limit}&page=${page}`;
    endpoint += typeId !== null && typeId !== "" ? `&typeId=${typeId}` : "";
    endpoint += search !== null && search !== "" ? `&search=${search}` : "";
    api
      .get(endpoint)
      .then((res) => {
        setTableLoading(false);
        setProjects(res.data);
      })
      .catch((err) => console.log(err));
  }, [limit, page, filter, reload, trashStatus]);

  useEffect(() => {
    authenticate("/Auth/Login", true);
    if (multipleChoices.list.length === Array.from(projects.items).length) {
      setMutipleChoice({
        ...multipleChoices,
        checkedAll: true,
        indeterminate: false,
      });
    } else if (multipleChoices.list.length === 0) {
      setMutipleChoice({
        ...multipleChoices,
        checkedAll: false,
        indeterminate: false,
      });
    } else if (
      multipleChoices.list.length > 0 &&
      multipleChoices.list.length < Array.from(projects.items).length
    ) {
      setMutipleChoice({
        ...multipleChoices,
        indeterminate: true,
        checkedAll: false,
      });
    }
  }, [multipleChoices.list, projects]);

  function handleEnter() {
    if (editProjectId !== null && editProjectId !== "") {
      api
        .get(`projects/${editProjectId}`)
        .then((res) => {
          setEditProject(res.data);
        })
        .catch((err) => console.log(err));
    } else {
      setEditProject({
        name: "",
        progress: "0",
        budget: "",
        typeId: "",
        responsibleId: "",
        paymentDate: "",
        deadline: "",
        status: "NEW",
      });
    }
  }

  const handleChangeLimit = (dataKey) => {
    setPage(1);
    setLimit(dataKey);
  };

  function handleNewProjectChange(value, event) {
    setNewProject({
      ...newProject,
      [event.target.name]: value,
    });
  }

  function handlePickerChange(value, event, label = "typeId") {
    setNewProject({
      ...newProject,
      [label]: value,
    });
  }

  function handleNewProjectSubmit(e) {
    e.preventDefault();
    console.log(newProject);
    api
      .post("projects", newProject)
      .then(() => setReload(!reload))
      .catch((err) => console.log(err));
  }

  function toThousands(value) {
    return value
      ? `${value}`.replace(/\d{1,3}(?=(\d{3})+(\.\d*)?$)/g, "$&,")
      : value;
  }

  // function toPercent(value) {
  //   if (typeof value == "string") {
  //     if (value !== null && value !== "") {
  //       value = parseInt(value);
  //     }
  //     value = 0;
  //   }
  //   return `${(value * 100).toFixed(0)}%`;
  // }

  // function handlePrint() {
  //   const printTarget = document.querySelector(".projects-table");
  //   const newWin = window.open("projects");
  //   newWin.document.write(printTarget.outerHTML);
  //   newWin.print();
  //   newWin.close();
  // }

  function handleSheet() {
    api
      .get("projects?limit=-1&page=0")
      .then((res) => {
        const { items } = res.data;
        let ws = utils.json_to_sheet(items);
        let wb = utils.book_new();
        utils.book_append_sheet(wb, ws, "Dự án");
        writeFile(wb, "Tổng dự án.xlsx");
      })
      .catch((err) => console.log(err));
  }

  function handleCheckAll(value, checked) {
    const keys = checked
      ? Array.from(projects.items).map((item) => item.id)
      : [];
    setMutipleChoice({
      ...multipleChoices,
      list: keys,
      checkedAll: checked,
      indeterminate: false,
    });
  }

  function handleCheck(value, checked) {
    const keys = checked
      ? [...multipleChoices.list, value]
      : multipleChoices.list.filter((item) => item !== value);
    setMutipleChoice({
      ...multipleChoices,
      list: keys,
    });
  }

  return (
    <Show>
      <Show.When
        isTrue={
          accessControl?.role == "ADMIN" || accessControl?.role === "MANAGER"
        }
      >
        <div className="p-4" data-bs-theme="dark">
          <div className="d-flex justify-content-between">
            <div className="d-flex justify-content-center gap-3">
              <Button
                onClick={() => setOpen(true)}
                appearance="primary"
                style={{
                  "--rs-btn-primary-bg": "var(--gradient-gold)",
                  "--rs-btn-primary-hover-bg": "var(--rs-yellow-500)",
                  "--rs-btn-primary-active-bg": "var(--rs-yellow-500)",
                  "--rs-btn-primary-text": "#000",
                  "--rs-btn-primary-hover-text": "#000",
                }}
              >
                Tạo dự án
              </Button>
              <Show>
                <Show.When isTrue={Array.from(multipleChoices.list).length > 0}>
                  <Dropdown title="Hành động" size="lg">
                    <Show>
                      <Show.When isTrue={trashStatus}>
                        <Dropdown.Item
                          onClick={() => {
                            api
                              .post("projects/restore", multipleChoices.list)
                              .then(() => {
                                setReload(!reload);
                                setMutipleChoice({
                                  list: [],
                                  checkedAll: false,
                                  indeterminate: false,
                                });
                              });
                          }}
                        >
                          <i className="bi bi-arrow-counterclockwise fs-5 text-white"></i>{" "}
                          Khôi phục
                        </Dropdown.Item>
                      </Show.When>
                      <Show.Else>
                        <Dropdown.Item
                          onClick={() => {
                            api
                              .post("projects/trash", multipleChoices.list)
                              .then(() => {
                                setReload(!reload);
                                setMutipleChoice({
                                  list: [],
                                  checkedAll: false,
                                  indeterminate: false,
                                });
                              });
                          }}
                        >
                          <i className="bi bi-trash-fill fs-5 text-danger"></i>{" "}
                          Bỏ vào thùng rác
                        </Dropdown.Item>
                      </Show.Else>
                    </Show>
                    <Show>
                      <Show.When isTrue={accessControl?.role === "ADMIN"}>
                        <Dropdown.Item
                          onClick={() => {
                            api
                              .post("projects/delete", multipleChoices.list)
                              .then(() => {
                                setReload(!reload);
                                setMutipleChoice({
                                  list: [],
                                  checkedAll: false,
                                  indeterminate: false,
                                });
                              });
                          }}
                        >
                          <i className="bi bi-x-lg fs-5 text-danger"></i> Xóa
                          vĩnh viễn
                        </Dropdown.Item>
                      </Show.When>
                    </Show>
                  </Dropdown>
                </Show.When>
              </Show>
            </div>
            <div className="d-flex gap-3 justify-content-center align-items-center">
              <SelectPicker
                name="filterByTypeId"
                onChange={(value) =>
                  setFilter({
                    ...filter,
                    typeId: value,
                  })
                }
                size="lg"
                style={{
                  "--rs-input-bg": "var(--rs-bg-card)",
                  "--rs-input-focus-border": "var(--gradient-gold)",
                  "--rs-border-primary": "transparent",
                  "--rs-picker-value": "var(--gradient-gold)",
                }}
                label="Lọc theo loại"
                data={Array.from(projectTypes).map((item) => ({
                  label: item.name,
                  value: item.id,
                }))}
                block
                placeholder=" "
              />
              <InputGroup
                inside
                size="lg"
                style={{
                  "--rs-input-bg": "var(--rs-bg-card)",
                  "--rs-input-focus-border": "var(--gradient-gold)",
                  "--rs-border-primary": "transparent",
                  "--rs-picker-value": "var(--gradient-gold)",
                }}
              >
                <Input
                  id="search"
                  placeholder="Tìm kiếm"
                  onPressEnter={() => {
                    setFilter({
                      ...filter,
                      search: document.getElementById("search").value,
                    });
                  }}
                />
                <InputGroup.Button
                  onClick={() => {
                    setFilter({
                      ...filter,
                      search: document.getElementById("search").value,
                    });
                  }}
                >
                  <i className="bi bi-search"></i>
                </InputGroup.Button>
              </InputGroup>
            </div>
          </div>
          <Table
            height={420}
            className="rounded mt-3 projects-table"
            data={projects.items}
            loading={tableLoading}
            autoHeight={true}
          >
            <Column width={56} fixed>
              <HeaderCell className="text-center">
                <Checkbox
                  style={{
                    top: "-7px",
                    "--rs-checkbox-checked-bg": "var(--rs-gray-100)",
                  }}
                  value={"all"}
                  checked={multipleChoices.checkedAll}
                  onChange={handleCheckAll}
                  indeterminate={multipleChoices.indeterminate}
                />
              </HeaderCell>
              <Cell className="text-center">
                {(rowdata) => (
                  <Checkbox
                    name="trashId"
                    value={rowdata.id}
                    style={{
                      top: "-7px",
                      "--rs-checkbox-checked-bg": "var(--rs-gray-100)",
                    }}
                    checked={multipleChoices.list.some(
                      (item) => item === rowdata.id
                    )}
                    onChange={handleCheck}
                  />
                )}
              </Cell>
            </Column>
            <Column width={200} fixed resizable>
              <HeaderCell className="fs-6">Tên</HeaderCell>
              <Cell className="terus-column__pj-name">
                {(rowdata) => (
                  <span
                    className="w-100 h-100 d-flex justify-content-between"
                    onClick={() => {
                      setEditModal(true);
                      setEditProjectId(rowdata.id);
                    }}
                  >
                    {rowdata.name + " "}
                    <i className="bi bi-pencil-fill"></i>
                  </span>
                )}
              </Cell>
            </Column>
            <Column width={200} resizable>
              <HeaderCell className="fs-6">Loại dự án</HeaderCell>
              <Cell>
                {(rowdata) => {
                  const type = projectTypes.find(
                    (type) => type.id === rowdata.typeId
                  );
                  return type.name;
                }}
              </Cell>
            </Column>
            <Column width={200} resizable>
              <HeaderCell className="fs-6">Kinh phí</HeaderCell>
              <Cell>{(rowdata) => `${toThousands(rowdata.budget)} VNĐ`}</Cell>
            </Column>
            <Column width={150} resizable>
              <HeaderCell className="text-center fs-6">Trạng thái</HeaderCell>
              <Cell className="text-center">
                {(rowdata) => statusComponent(rowdata.status)}
              </Cell>
            </Column>
            <Column width={150} resizable>
              <HeaderCell className="text-center fs-6">Tiến độ</HeaderCell>
              <Cell className="text-center">
                {(rowdata) =>
                  rowdata.progress === "" ? "0%" : rowdata.progress + "%"
                }
              </Cell>
            </Column>
            <Column flexGrow={1} resizable>
              <HeaderCell className="fs-6">Người phụ trách</HeaderCell>
              <Cell>
                {(rowdata) => {
                  const employee =
                    employees &&
                    employees.find(
                      (employee) => employee.id === rowdata.responsibleId
                    );
                  return employee.lastName + " " + employee.firstName;
                }}
              </Cell>
            </Column>
            <Column flexGrow={1} resizable>
              <HeaderCell className="text-center fs-6">
                Ngày thanh toán
              </HeaderCell>
              <Cell className="text-center">
                {(rowdata) =>
                  new Date(rowdata.paymentDate).toLocaleDateString("vi")
                }
              </Cell>
            </Column>
            <Column flexGrow={1} resizable>
              <HeaderCell className="text-center fs-6">
                Ngày hoàn thành
              </HeaderCell>
              <Cell className="text-center">
                {(rowdata) =>
                  new Date(rowdata.deadline).toLocaleDateString("vi")
                }
              </Cell>
            </Column>
          </Table>
          <div
            className="p-2 rounded mt-3 px-3 d-flex justify-content-between"
            style={{ background: "var(--rs-bg-card)" }}
          >
            <div className="d-flex gap-3 justify-content-center align-items-center">
              <Whisper
                trigger="hover"
                placement={"bottom"}
                controlId={`control-id-trash`}
                speaker={
                  <Tooltip>{trashStatus ? "Danh sách" : "Thùng rác"}</Tooltip>
                }
              >
                <Button
                  appearance="subtle"
                  onClick={() => {
                    setTrashStatus(!trashStatus);
                    setMutipleChoice({
                      list: [],
                      checkedAll: false,
                      indeterminate: false,
                    });
                  }}
                >
                  <i
                    className={`bi bi-${
                      trashStatus
                        ? "list-task text-sencondary"
                        : "trash text-danger"
                    } fs-5`}
                  ></i>
                </Button>
              </Whisper>
              <Whisper
                trigger="hover"
                placement={"bottom"}
                controlId={`control-id-excel`}
                speaker={<Tooltip>Xuất Excel</Tooltip>}
              >
                <Button appearance="subtle" onClick={handleSheet}>
                  <i className="bi bi-file-earmark-excel text-success fs-5"></i>
                </Button>
              </Whisper>
            </div>
            <Pagination
              prev
              next
              first
              last
              ellipsis
              boundaryLinks
              maxButtons={10}
              size="md"
              layout={["limit", "|", "pager"]}
              total={projects.totalItems}
              activePage={page}
              onChangePage={setPage}
              limit={limit}
              limitOptions={[20, 50, 100]}
              onChangeLimit={handleChangeLimit}
              style={{
                "--rs-btn-ghost-border": "var(--gradient-gold)",
                "--rs-btn-ghost-text": "var(--gradient-gold)",
                "--rs-btn-ghost-hover-border": "var(--gradient-gold)",
                "--rs-btn-ghost-hover-text": "var(--gradient-gold)",
                "--rs-btn-ghost-active-border": "var(--gradient-gold)",
                "--rs-btn-ghost-active-text": "var(--gradient-gold)",
              }}
            />
          </div>

          <Drawer
            open={open}
            onClose={() => setOpen(false)}
            backdrop="static"
            // overflow={true}
          >
            <form id="new_project_form" onSubmit={handleNewProjectSubmit}>
              <Drawer.Header>
                <Drawer.Title>Tạo dự án</Drawer.Title>
                <Drawer.Actions>
                  <Button
                    onClick={() => setOpen(false)}
                    type="submit"
                    appearance="primary"
                    style={{
                      "--rs-btn-primary-bg": "var(--gradient-gold)",
                      "--rs-btn-primary-hover-bg": "var(--rs-yellow-500)",
                      "--rs-btn-primary-active-bg": "var(--rs-yellow-500)",
                      "--rs-btn-primary-text": "#000",
                      "--rs-btn-primary-hover-text": "#000",
                    }}
                  >
                    Xác nhận
                  </Button>
                  <Button onClick={() => setOpen(false)} appearance="subtle">
                    hủy
                  </Button>
                </Drawer.Actions>
              </Drawer.Header>
              <Drawer.Body style={{ overflow: "hidden", minHeight: "760px" }}>
                <div className="row">
                  <div className="col-12">
                    <InputGroup>
                      <InputGroup.Addon>Tên</InputGroup.Addon>
                      <Input
                        name="name"
                        onChange={handleNewProjectChange}
                        placeholder="Tên dự án"
                        size="lg"
                        style={{
                          "--rs-input-bg": "transparent",
                          "--rs-input-focus-border": "var(--gradient-gold)",
                          "--rs-picker-value": "var(--gradient-gold)",
                        }}
                      />
                    </InputGroup>
                  </div>
                </div>
                <div className="row mt-3">
                  <div className="col-12">
                    <InputGroup>
                      <InputGroup.Addon>Kinh phí</InputGroup.Addon>
                      <InputNumber
                        name="budget"
                        onChange={handleNewProjectChange}
                        placeholder="kinh phí"
                        step={1000}
                        size="lg"
                        style={{
                          "--rs-input-bg": "transparent",
                          "--rs-input-focus-border": "var(--gradient-gold)",
                          "--rs-picker-value": "var(--gradient-gold)",
                        }}
                      />
                      <InputGroup.Addon>VNĐ</InputGroup.Addon>
                    </InputGroup>
                  </div>
                </div>
                <div className="row mt-3">
                  <div className="col-12">
                    <SelectPicker
                      name="typeId"
                      onChange={(value, event) =>
                        handlePickerChange(value, event, "typeId")
                      }
                      size="lg"
                      style={{
                        "--rs-input-bg": "transparent",
                        "--rs-input-focus-border": "var(--gradient-gold)",
                        "--rs-picker-value": "var(--gradient-gold)",
                      }}
                      label="Loại dự án"
                      data={Array.from(projectTypes).map((item) => ({
                        label: item.name,
                        value: item.id,
                      }))}
                      className="bg-transparent"
                      block
                      placeholder=" "
                    />
                  </div>
                </div>
                <div className="row mt-3">
                  <div className="col-12">
                    <SelectPicker
                      name="responsibleId"
                      onChange={(value, event) =>
                        handlePickerChange(value, event, "responsibleId")
                      }
                      size="lg"
                      style={{
                        "--rs-input-bg": "transparent",
                        "--rs-input-focus-border": "var(--gradient-gold)",
                        "--rs-picker-value": "var(--gradient-gold)",
                      }}
                      label="Người phụ trách"
                      data={Array.from(employees).map((item) => ({
                        label: item.lastName + " " + item.firstName,
                        value: item.id,
                      }))}
                      className="bg-transparent"
                      block
                      placeholder=" "
                    />
                  </div>
                </div>
                <div className="row mt-3">
                  <div className="col-12">
                    <DatePicker
                      name="paymentDate"
                      onChange={(value, event) =>
                        handlePickerChange(value, event, "paymentDate")
                      }
                      size="lg"
                      style={{
                        "--rs-input-bg": "transparent",
                        "--rs-input-focus-border": "var(--gradient-gold)",
                        "--rs-picker-value": "var(--gradient-gold)",
                      }}
                      className="bg-transparent"
                      block
                      label="Ngày thanh toán"
                      placeholder=" "
                    />
                  </div>
                </div>
                <div className="row mt-3">
                  <div className="col-12">
                    <DatePicker
                      name="deadline"
                      onChange={(value, event) =>
                        handlePickerChange(value, event, "deadline")
                      }
                      size="lg"
                      style={{
                        "--rs-input-bg": "transparent",
                        "--rs-input-focus-border": "var(--gradient-gold)",
                        "--rs-picker-value": "var(--gradient-gold)",
                      }}
                      className="bg-transparent"
                      block
                      label="Ngày hoàn thành"
                      placeholder=" "
                    />
                  </div>
                </div>
                <div className="row mt-3">
                  <div className="col-12">
                    <h6 className="mb-3 fw-normal">Thành viên dự án:</h6>
                    <TagPicker
                      placeholder="thành viên"
                      placement="topStart"
                      className="w-100"
                      data={Array.from(employees).map((e) => ({
                        label: `${e.lastName} ${e.firstName}`,
                        value: e.id,
                      }))}
                    />
                  </div>
                </div>
                <div className="row mt-3">
                  <div className="col-lg-3 fs-6">Trạng thái:</div>
                  <div className="col-lg-9">
                    <InlineEdit>
                      <RadioGroup
                        name="status"
                        defaultValue={"NEW"}
                        onChange={handleNewProjectChange}
                      >
                        <Radio
                          value="NEW"
                          style={{
                            "--rs-radio-checked-bg": "var(--rs-gray-500)",
                          }}
                        >
                          Dự án mới
                        </Radio>
                        <Radio
                          value="ACTIVE"
                          style={{
                            "--rs-radio-checked-bg": "var(--rs-cyan-700)",
                          }}
                        >
                          Dự án đang triển khai
                        </Radio>
                        <Radio
                          value="COMPLETED"
                          style={{
                            "--rs-radio-checked-bg": "var(--rs-green-500)",
                          }}
                        >
                          Dự án đã hoàn thành
                        </Radio>
                        <Radio
                          value="CLOSED"
                          style={{
                            "--rs-radio-checked-bg": "var(--rs-red-500)",
                          }}
                        >
                          Dự án đã đóng hoặc bị hủy
                        </Radio>
                      </RadioGroup>
                    </InlineEdit>
                  </div>
                </div>
              </Drawer.Body>
            </form>
          </Drawer>
          <Modal
            open={editModal}
            onClose={() => {
              setEditModal(false);
            }}
            onEnter={handleEnter}
            size={"sm"}
            backdrop="static"
          >
            <form
              style={{ overflow: "hidden" }}
              onSubmit={(e) => {
                e.preventDefault();
                api
                  .put(`projects/${editProjectId}`, editProject)
                  .then((res) => {
                    console.log(res.data);
                    setReload(!reload);
                    setEditModal(false);
                  })
                  .catch((err) => {
                    console.log(err);
                  });
              }}
            >
              <Modal.Header>
                <Modal.Title>Dự án</Modal.Title>
              </Modal.Header>
              <Modal.Body style={{ overflow: "hidden", minHeight: "600px" }}>
                <div className="row">
                  <div className="col-lg-4 d-flex align-items-center">
                    <label htmlFor="">Tên:</label>
                  </div>
                  <div className="col-lg-8">
                    <InlineEdit placeholder="Tên dự án">
                      <Input
                        name="name"
                        defaultValue={editProject.name}
                        onChange={(value) => {
                          setEditProject({
                            ...editProject,
                            name: value,
                          });
                        }}
                        size="lg"
                      />
                    </InlineEdit>
                  </div>
                </div>
                <div className="row mt-3">
                  <div className="col-lg-4 d-flex align-items-center">
                    <label htmlFor="">Kinh phí:</label>
                  </div>
                  <div className="col-lg-8">
                    <InlineEdit
                      placeholder="Kinh phí"
                      value={editProject.budget}
                      onChange={(value) => {
                        setEditProject({
                          ...editProject,
                          budget: value,
                        });
                      }}
                    >
                      <InputNumber
                        name="budget"
                        onChange={(value) => {
                          setEditProject({
                            ...editProject,
                            budget: value,
                          });
                        }}
                        placeholder="kinh phí"
                        step={1000}
                        size="lg"
                      />
                    </InlineEdit>
                    <span className="ms-2">VNĐ</span>
                  </div>
                </div>
                <div className="row mt-3">
                  <div className="col-lg-4 d-flex align-items-center">
                    <label htmlFor="">Loại dự án:</label>
                  </div>
                  <div className="col-lg-8">
                    <InlineEdit
                      placeholder="Loại dự án"
                      value={editProject.typeId}
                      onChange={(value) =>
                        setEditProject({
                          ...editProject,
                          typeId: value,
                        })
                      }
                    >
                      <SelectPicker
                        name="typeId"
                        size="lg"
                        data={Array.from(projectTypes).map((item) => ({
                          label: item.name,
                          value: item.id,
                        }))}
                        block
                      />
                    </InlineEdit>
                  </div>
                </div>
                <div className="row mt-3">
                  <div className="col-lg-4 d-flex align-items-center">
                    <label htmlFor="">Người phụ trách:</label>
                  </div>
                  <div className="col-lg-8">
                    <InlineEdit
                      placeholder="Loại dự án"
                      value={editProject.responsibleId}
                      onChange={(value) => {
                        setEditProject({
                          ...editProject,
                          responsibleId: value,
                        });
                      }}
                    >
                      <SelectPicker
                        name="responsibleId"
                        size="lg"
                        data={Array.from(users).map((item) => ({
                          label: item.lastName + " " + item.firstName,
                          value: item.id,
                        }))}
                        block
                      />
                    </InlineEdit>
                  </div>
                </div>
                <div className="row mt-3">
                  <div className="col-lg-4 d-flex align-items-center">
                    <label htmlFor="">Ngày thanh toán:</label>
                  </div>
                  <div className="col-lg-8">
                    <InlineEdit
                      placeholder="Ngày thanh toán"
                      value={new Date(editProject.paymentDate)}
                      onChange={(value) => {
                        setEditProject({
                          ...editProject,
                          paymentDate: value,
                        });
                      }}
                    >
                      <DatePicker name="paymentDate" size="lg" block />
                    </InlineEdit>
                  </div>
                </div>
                <div className="row mt-3">
                  <div className="col-lg-4 d-flex align-items-center">
                    <label htmlFor="">Ngày hoàn thành:</label>
                  </div>
                  <div className="col-lg-8">
                    <InlineEdit
                      placeholder="Ngày hoàn thành"
                      value={new Date(editProject.deadline)}
                      onChange={(value) =>
                        setEditProject({
                          ...editProject,
                          deadline: value,
                        })
                      }
                    >
                      <DatePicker name="paymentDate" size="lg" block />
                    </InlineEdit>
                  </div>
                </div>
                <div className="row mt-3">
                  <div className="col-lg-4">Tiến độ (%)</div>
                  <div className="col-lg-8">
                    <InlineEdit
                      onChange={(value) => {
                        setEditProject({
                          ...editProject,
                          progress: value,
                        });
                      }}
                    >
                      <Input
                        name="progress"
                        defaultValue={editProject.progress}
                        onChange={(value) => {
                          setEditProject({
                            ...editProject,
                            progress: value,
                          });
                        }}
                      />
                    </InlineEdit>
                    <span> %</span>
                  </div>
                </div>
                <div className="row mt-3">
                  <div className="col-12">
                    <div className="fs-7 fw-normal m-0 mb-3">Thành viên</div>
                    <InlineEdit>
                    <div className="col-12">
                    <h6 className="mb-3 fw-normal">Thành viên dự án:</h6>
                    <TagPicker
                      placeholder="thành viên"
                      placement="topStart"
                      className="w-100"
                      data={Array.from(employees).map((e) => ({
                        label: `${e.lastName} ${e.firstName}`,
                        value: e.id,
                      }))}
                    />
                  </div>
                    </InlineEdit>
                  </div>
                </div>
                <div className="row mt-3">
                  <div className="col-lg-4">Trạng thái</div>
                  <div className="col-lg-8">
                    <InlineEdit
                      onChange={(value) => {
                        setEditProject({
                          ...editProject,
                          status: value,
                        });
                      }}
                    >
                      <RadioGroup
                        name="status"
                        defaultValue={editProject.status}
                        onChange={(value) => {
                          setEditProject({
                            ...editProject,
                            status: value,
                          });
                        }}
                      >
                        <Radio
                          value="NEW"
                          style={{
                            "--rs-radio-checked-bg": "var(--rs-gray-500)",
                          }}
                        >
                          Dự án mới
                        </Radio>
                        <Radio
                          value="ACTIVE"
                          style={{
                            "--rs-radio-checked-bg": "var(--rs-cyan-700)",
                          }}
                        >
                          Dự án đang triển khai
                        </Radio>
                        <Radio
                          value="COMPLETED"
                          style={{
                            "--rs-radio-checked-bg": "var(--rs-green-500)",
                          }}
                        >
                          Dự án đã hoàn thành
                        </Radio>
                        <Radio
                          value="CLOSED"
                          style={{
                            "--rs-radio-checked-bg": "var(--rs-red-500)",
                          }}
                        >
                          Dự án đã đóng hoặc bị hủy
                        </Radio>
                      </RadioGroup>
                    </InlineEdit>
                  </div>
                </div>
              </Modal.Body>
              <Modal.Footer>
                <Button appearance="primary" color="green" type="submit">
                  Cập nhật
                </Button>
                <Button
                  appearance="subtle"
                  onClick={() => {
                    setEditModal(false);
                  }}
                >
                  Hủy
                </Button>
              </Modal.Footer>
            </form>
          </Modal>
        </div>
      </Show.When>
      <Show.Else>
        <Navigate to={"/PageNotFound"} />
      </Show.Else>
    </Show>
  );
};

function statusComponent(status) {
  return (
    <Show>
      <Show.When isTrue={status === "ACTIVE"}>
        <Tag color="cyan">Đang triển khai</Tag>
      </Show.When>
      <Show.When isTrue={status === "COMPLETED"}>
        <Tag color="green">Đã hoàn thành</Tag>
      </Show.When>
      <Show.When isTrue={status === "CLOSED"}>
        <Tag color="red">Đã đóng</Tag>
      </Show.When>
      <Show.Else>
        <Tag color="gray">Mới</Tag>
      </Show.Else>
    </Show>
  );
}

export default Projects;
