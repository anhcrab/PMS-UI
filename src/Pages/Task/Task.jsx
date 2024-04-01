//#region imports
import { useContext, useEffect, useState } from "react";
import "./Task.scss";
import { AdminContext } from "../../Layouts/Admin/AdminLayout";
import { Show } from "../../Components/Show/Show";
import { Navigate } from "react-router-dom";
import {
  Button,
  Checkbox,
  DatePicker,
  Drawer,
  Dropdown,
  InlineEdit,
  Input,
  InputGroup,
  Modal,
  Pagination,
  Panel,
  SelectPicker,
  Table,
  Tag,
  Tooltip,
  Whisper,
} from "rsuite";
import api from "../../Utils/api";
import { isOnDesktop, isOnMobile } from "../../Utils/utils";
import { utils, writeFile } from "xlsx";
import { Reorder } from "framer-motion";
//#endregion

const Task = () => {
  const { setHeading, accessControl } = useContext(AdminContext);
  const [tableLoading, setTableLoading] = useState(false);
  const [reload, setReload] = useState(false);
  const [limit, setLimit] = useState(20);
  const [page, setPage] = useState(1);
  const [trashStatus, setTrashStatus] = useState(false);
  const [multipleChoices, setMutipleChoices] = useState({
    list: [],
    checkedAll: false,
    indeterminate: false,
  });
  const [filter, setFilter] = useState({
    projectId: null,
    search: null,
  });
  const [tasks, setTasks] = useState({
    totalPages: 0,
    totalItems: 0,
    items: [],
  });
  const [addTask, setAddTask] = useState({
    open: false,
    payload: {
      name: "",
      content: "",
      isCompleted: false,
      deadline: "",
      projectId: null,
      memberId: null,
    },
  });
  const [editTask, setEditTask] = useState({
    open: false,
    id: null,
    payload: {
      name: "",
      content: "",
      isCompleted: false,
      deadline: "",
      projectId: null,
      memberId: null,
    },
  });
  const [employees, setEmployees] = useState([]);
  const [projects, setProjects] = useState([]);
  const { Column, HeaderCell, Cell } = Table;

  useEffect(() => {
    api.get("employees").then((res) => setEmployees(res.data));
    api
      .get("projects?limit=-1&page=1")
      .then((res) => setProjects(res.data.items));
  }, []);

  useEffect(() => {
    setHeading(trashStatus ? "Nhiệm vụ (Thùng rác)" : "Nhiệm vụ");
    const { projectId, search } = filter;
    let endpoint = `tasks${
      trashStatus ? "/trash" : ""
    }?limit=${limit}&page=${page}`;
    endpoint +=
      projectId !== null && projectId !== "" ? `&projectId=${projectId}` : "";
    endpoint += search !== null && search !== "" ? `&search=${search}` : "";
    setTableLoading(true);
    api
      .get(endpoint)
      .then((res) => {
        setTableLoading(false);
        setTasks(res.data);
      })
      .catch((err) => console.log(err));
  }, [limit, page, reload, trashStatus, filter]);

  useEffect(() => {
    if (
      Array.from(multipleChoices.list)?.length ===
      Array.from(tasks.items)?.length
    ) {
      setMutipleChoices({
        ...multipleChoices,
        checkedAll: true,
        indeterminate: false,
      });
    } else if (Array.from(multipleChoices.list)?.length === 0) {
      setMutipleChoices({
        ...multipleChoices,
        checkedAll: false,
        indeterminate: false,
      });
    } else if (
      Array.from(multipleChoices.list)?.length > 0 &&
      Array.from(multipleChoices.list)?.length < Array.from(tasks.items)?.length
    ) {
      setMutipleChoices({
        ...multipleChoices,
        indeterminate: true,
        checkedAll: false,
      });
    }
  }, [multipleChoices.list, tasks]);

  function handleCheckAll(value, checked) {
    const keys = checked ? Array.from(tasks.items).map((item) => item.id) : [];
    setMutipleChoices({
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
    setMutipleChoices({
      ...multipleChoices,
      list: keys,
    });
  }

  function handleNewSubmit(e) {
    e.preventDefault();
    console.log(addTask.payload);
    api
      .post("tasks", addTask.payload)
      .then(() => {
        setReload(!reload);
      })
      .catch((err) => {
        console.log(err);
      });
  }

  function handleNewChange(value, event) {
    setAddTask({
      ...addTask,
      payload: {
        ...addTask.payload,
        [event.target.name]: value,
      },
    });
  }

  function handleSheet() {
    api
      .get("tasks?limit=-1&page=0")
      .then((res) => {
        // Nên xử lý dữ liệu trước khi lưu vào excel
        const { items } = res.data;
        let ws = utils.json_to_sheet(items);
        let wb = utils.book_new();
        utils.book_append_sheet(wb, ws, "Nhiệm vụ");
        writeFile(wb, "Tổng nhiệm vụ.xlsx");
      })
      .catch((err) => console.log(err));
  }

  function handlePickerChange(value, event, label = "projectId") {
    setAddTask({
      ...addTask,
      payload: {
        ...addTask.payload,
        [label]: value,
      },
    });
  }

  function handleEnter() {
    if (editTask.id !== null && editTask.id !== "") {
      api
        .get(`tasks/${editTask.id}`)
        .then((res) => {
          setEditTask({
            ...editTask,
            payload: res.data,
          });
        })
        .catch((err) => console.log(err));
    } else {
      setEditTask({
        ...editTask,
        payload: {
          name: "",
          progress: "0",
          budget: "",
          typeId: "",
          responsibleId: "",
          paymentDate: "",
          deadline: "",
          status: "NEW",
        },
      });
    }
  }

  function handleChangeLimit(dataKey) {
    setPage(1);
    setLimit(dataKey);
  }

  return (
    <Show>
      <Show.When isTrue={accessControl?.role !== "CLIENT"}>
        {/* Các role không phải là Client đều được có quyền access vào bảng nhiệm vụ. */}
        <div className="p-4">
          <Show>
            <Show.When isTrue={accessControl?.role !== "EMPLOYEE"}>
              {/* Bảng này sẽ hiển thị cho mỗi Admin và Manager xem */}
              <Show>
                <Show.When isTrue={accessControl?.role === "ADMIN"}>
                  <h2 className="fs-5">
                    Tổng số nhiệm vụ đã giao: {tasks.totalItems}
                  </h2>
                </Show.When>
              </Show>
              <div
                className={`d-flex ${
                  isOnMobile()
                    ? "flex-column align-items-start gap-3 "
                    : "justify-content-between"
                }`}
              >
                <div
                  className={`d-flex ${
                    isOnMobile() ? "flex-column" : ""
                  } justify-content-center gap-3`}
                >
                  <Button
                    onClick={() => setAddTask({ ...addTask, open: true })}
                    appearance="primary"
                    style={{
                      "--rs-btn-primary-bg": "var(--gradient-gold)",
                      "--rs-btn-primary-hover-bg": "var(--rs-yellow-500)",
                      "--rs-btn-primary-active-bg": "var(--rs-yellow-500)",
                      "--rs-btn-primary-text": "#000",
                      "--rs-btn-primary-hover-text": "#000",
                    }}
                  >
                    Thêm task
                  </Button>
                  <Show>
                    <Show.When
                      isTrue={Array.from(multipleChoices.list).length > 0}
                    >
                      <Dropdown title="Hành động" size="lg">
                        <Show>
                          <Show.When isTrue={trashStatus}>
                            <Dropdown.Item
                              onClick={() => {
                                api
                                  .post("tasks/restore", multipleChoices.list)
                                  .then(() => {
                                    setReload(!reload);
                                    setMutipleChoices({
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
                                  .post("tasks/trash", multipleChoices.list)
                                  .then(() => {
                                    setReload(!reload);
                                    setMutipleChoices({
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
                                  .post("tasks/delete", multipleChoices.list)
                                  .then(() => {
                                    setReload(!reload);
                                    setMutipleChoices({
                                      list: [],
                                      checkedAll: false,
                                      indeterminate: false,
                                    });
                                  });
                              }}
                            >
                              <i className="bi bi-x-lg fs-5 text-danger"></i>{" "}
                              Xóa vĩnh viễn
                            </Dropdown.Item>
                          </Show.When>
                        </Show>
                      </Dropdown>
                    </Show.When>
                  </Show>
                </div>
                {/* Bộ lọc cho danh sách */}
                <div
                  className={`d-flex ${
                    isOnMobile() ? "flex-column w-100" : "align-items-center"
                  } justify-content-center gap-3`}
                >
                  <SelectPicker
                    name="filterByProjectId"
                    onChange={(value) =>
                      setFilter({
                        ...filter,
                        projectId: value,
                      })
                    }
                    size="lg"
                    style={{
                      "--rs-input-bg": "var(--rs-bg-card)",
                      "--rs-input-focus-border": "var(--gradient-gold)",
                      "--rs-border-primary": "transparent",
                      "--rs-picker-value": "var(--gradient-gold)",
                    }}
                    label="Lọc theo dự án"
                    data={Array.from(projects).map((item) => ({
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
                id="table_tasks_admin"
                data={tasks.items}
                height={420}
                className="rounded mt-3 projects-table"
                style={{
                  "--rs-table-resize": "var(--gradient-gold)",
                  boxShadow: "0 0 4px #ccc",
                }}
                loading={tableLoading}
                autoHeight={true}
              >
                <Column width={56} fixed className="text-center">
                  <HeaderCell>
                    <Checkbox
                      style={{
                        top: "-7px",
                        "--rs-checkbox-checked-bg": "var(--rs-gray-500)",
                      }}
                      value={"all"}
                      checked={multipleChoices.checkedAll}
                      onChange={handleCheckAll}
                      indeterminate={multipleChoices.indeterminate}
                    />
                  </HeaderCell>
                  <Cell>
                    {(rowdata) => (
                      <Checkbox
                        name="taskId"
                        value={rowdata?.id}
                        style={{
                          top: "-7px",
                          "--rs-checkbox-checked-bg": "var(--rs-gray-500)",
                        }}
                        checked={multipleChoices.list.some(
                          (item) => item === rowdata?.id
                        )}
                        onChange={handleCheck}
                      />
                    )}
                  </Cell>
                </Column>
                <Column flexGrow={1} fixed={isOnDesktop()} resizable>
                  <HeaderCell>Tên</HeaderCell>
                  <Cell className="terus-column__pj-name">
                    {(rowdata) => (
                      <span
                        className="w-100 h-100 d-flex justify-content-between"
                        onClick={() => {
                          setEditTask({
                            ...editTask,
                            open: true,
                            id: rowdata.id,
                          });
                        }}
                      >
                        {rowdata.name + " "}
                        <i className="bi bi-pencil-fill"></i>
                      </span>
                    )}
                  </Cell>
                </Column>
                <Column flexGrow={1} resizable>
                  <HeaderCell>Người thực hiện</HeaderCell>
                  <Cell>
                    {(rowdata) =>
                      `${rowdata.member.lastName} ${rowdata.member.firstName}`
                    }
                  </Cell>
                </Column>
                <Column flexGrow={1} resizable>
                  <HeaderCell>Thuộc dự án</HeaderCell>
                  <Cell>{(rowdata) => rowdata.project.name}</Cell>
                </Column>
                <Column flexGrow={1} resizable>
                  <HeaderCell>Tình trạng</HeaderCell>
                  <Cell>
                    {(rowdata) =>
                      rowdata?.isCompleted ? (
                        <Tag color="green">Đã hoàn thành</Tag>
                      ) : (
                        <Tag color="red">Chưa hoàn thành</Tag>
                      )
                    }
                  </Cell>
                </Column>
                <Column flexGrow={1} resizable>
                  <HeaderCell>Hạn hoàn thành</HeaderCell>
                  <Cell>
                    {(rowdata) =>
                      new Date(rowdata?.deadline).toLocaleDateString(
                        "vi-VN",
                        "d-m-Y"
                      )
                    }
                  </Cell>
                </Column>
                <Column flexGrow={1} resizable>
                  <HeaderCell>Nội dung</HeaderCell>
                  <Cell dataKey="content" />
                </Column>
                <Column flexGrow={1} resizable>
                  <HeaderCell>Ngày tạo</HeaderCell>
                  <Cell>
                    {(rowdata) => {
                      let creation = new Date(rowdata?.creationDate);
                      return `${creation.toLocaleDateString()} ${creation.toLocaleTimeString()}`;
                    }}
                  </Cell>
                </Column>
              </Table>

              <div
                className={`p-2 rounded mt-3 px-3 d-flex justify-content-between ${
                  isOnMobile() ? "flex-column align-items-start gap-3" : ""
                }`}
                style={{
                  background: "var(--rs-bg-card)",
                  boxShadow: "0 0 2px #ccc",
                }}
              >
                <Show>
                  <Show.When isTrue={accessControl?.role === "ADMIN"}>
                    {/* Chỉ có admin được phép xem thùng rác và xuất excel */}
                    <div className="d-flex gap-3 justify-content-center align-items-center">
                      <Whisper
                        trigger="hover"
                        placement={"bottom"}
                        controlId={`control-id-trash`}
                        speaker={
                          <Tooltip>
                            {trashStatus
                              ? "Trở về danh sách chính"
                              : "Xem thùng rác"}
                          </Tooltip>
                        }
                      >
                        <Button
                          appearance="subtle"
                          onClick={() => {
                            setTrashStatus(!trashStatus);
                            setMutipleChoices({
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
                        speaker={<Tooltip>Lưu dưới dạng file Excel</Tooltip>}
                      >
                        <Button appearance="subtle" onClick={handleSheet}>
                          <i className="bi bi-file-earmark-excel text-success fs-5"></i>
                        </Button>
                      </Whisper>
                    </div>
                  </Show.When>
                </Show>
                <Pagination
                  prev
                  next
                  first
                  last
                  ellipsis
                  boundaryLinks
                  maxButtons={10}
                  size="md"
                  layout={["limit", "pager"]}
                  total={tasks.totalItems}
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
                  className={`${
                    isOnMobile() ? "flex-column align-items-start gap-3" : ""
                  }`}
                />
              </div>

              <Drawer
                open={addTask.open}
                onClose={() => setAddTask({ ...addTask, open: false })}
                backdrop="static"
              >
                <form id="new_project_form" onSubmit={handleNewSubmit}>
                  <Drawer.Header>
                    <Drawer.Title>Tạo nhiệm vụ</Drawer.Title>
                    <Drawer.Actions>
                      <Button
                        onClick={() => setAddTask({ ...addTask, open: false })}
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
                      <Button
                        onClick={() => setAddTask({ ...addTask, open: false })}
                        appearance="subtle"
                      >
                        hủy
                      </Button>
                    </Drawer.Actions>
                  </Drawer.Header>
                  <Drawer.Body
                    style={{ overflow: "hidden", minHeight: "760px" }}
                  >
                    <div className="row">
                      <div className="col-12">
                        <InputGroup>
                          <InputGroup.Addon>Tên</InputGroup.Addon>
                          <Input
                            name="name"
                            onChange={handleNewChange}
                            placeholder="Tên nhiệm vụ"
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
                        <SelectPicker
                          name="typeId"
                          onChange={(value, event) =>
                            handlePickerChange(value, event, "projectId")
                          }
                          size="lg"
                          style={{
                            "--rs-input-bg": "transparent",
                            "--rs-input-focus-border": "var(--gradient-gold)",
                            "--rs-picker-value": "var(--gradient-gold)",
                          }}
                          label="Thuộc dự án"
                          data={Array.from(projects).map((item) => ({
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
                        <Checkbox
                          name="isCompleted"
                          id="new-task__is-completed"
                          style={{
                            "--rs-checkbox-checked-bg": "var(--rs-gray-500)",
                          }}
                          onChange={(value, checked) => {
                            setAddTask({
                              ...addTask,
                              payload: {
                                ...addTask.payload,
                                isCompleted: checked,
                              },
                            });
                          }}
                        />
                        <label htmlFor="new-task__is-completed">
                          Đánh dấu là đã hoàn thành
                        </label>
                      </div>
                    </div>
                    <div className="row mt-3">
                      <div className="col-12">
                        <Input
                          as="textarea"
                          rows={3}
                          placeholder="Nội dung"
                          name="content"
                          onChange={handleNewChange}
                        />
                      </div>
                    </div>
                    <div className="row mt-3">
                      <div className="col-12">
                        <SelectPicker
                          name="memberId"
                          onChange={(value, event) =>
                            handlePickerChange(value, event, "memberId")
                          }
                          size="lg"
                          style={{
                            "--rs-input-bg": "transparent",
                            "--rs-input-focus-border": "var(--gradient-gold)",
                            "--rs-picker-value": "var(--gradient-gold)",
                          }}
                          label="Người thực hiện"
                          data={Array.from(employees).map((item) => ({
                            label: item?.lastName + " " + item?.firstName,
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
                          label="Hạn hoàn thành"
                          placeholder=" "
                        />
                      </div>
                    </div>
                  </Drawer.Body>
                </form>
              </Drawer>

              <Modal
                open={editTask.open}
                onClose={() => {
                  setEditTask({ ...editTask, open: false });
                }}
                onEnter={handleEnter}
                size={"sm"}
                backdrop="static"
              >
                <form
                  style={{ overflow: "hidden" }}
                  onSubmit={(e) => {
                    e.preventDefault();
                    console.log(editTask.payload);
                    api
                      .put(`tasks/${editTask.id}`, editTask.payload)
                      .then((res) => {
                        console.log(res.data);
                        setReload(!reload);
                        setEditTask({ ...editTask, open: false });
                      })
                      .catch((err) => {
                        console.log(err);
                      });
                  }}
                >
                  <Modal.Header>
                    <Modal.Title>Nhiệm vụ: </Modal.Title>
                  </Modal.Header>
                  <Modal.Body
                    style={{ overflow: "hidden", minHeight: "600px" }}
                  >
                    <div className="row">
                      <div className="col-lg-4 d-flex align-items-center">
                        <label htmlFor="">Tên:</label>
                      </div>
                      <div className="col-lg-8">
                        <InlineEdit placeholder="Tên nhiệm vụ">
                          <Input
                            name="name"
                            defaultValue={editTask?.payload?.name}
                            onChange={(value) => {
                              setEditTask({
                                ...editTask,
                                payload: {
                                  ...editTask?.payload,
                                  name: value,
                                },
                              });
                            }}
                            size="lg"
                          />
                        </InlineEdit>
                      </div>
                    </div>
                    <div className="row mt-3">
                      <div className="col-lg-4 d-flex align-items-center">
                        <label htmlFor="">Thuộc dự án:</label>
                      </div>
                      <div className="col-lg-8">
                        <InlineEdit
                          placeholder="Thuộc dự án"
                          value={editTask?.payload?.projectId}
                          onChange={(value) =>
                            setEditTask({
                              ...editTask,
                              payload: {
                                ...editTask.payload,
                                projectId: value,
                              },
                            })
                          }
                        >
                          <SelectPicker
                            name="typeId"
                            size="lg"
                            data={Array.from(projects).map((item) => ({
                              label: item.name,
                              value: item.id,
                            }))}
                            block
                          />
                        </InlineEdit>
                      </div>
                    </div>
                    <div className="row mt-3">
                      <div className="col-lg-4"></div>
                      <div className="col-lg-8">
                        <label htmlFor="edit-task__is-completed">
                          <Checkbox
                            name="name"
                            id="edit-task__is-completed"
                            checked={editTask?.payload?.isCompleted}
                            onChange={(value, checked) => {
                              setEditTask({
                                ...editTask,
                                payload: {
                                  ...editTask?.payload,
                                  isCompleted: checked,
                                },
                              });
                            }}
                          />
                          Đánh dấu là hoàn thành
                        </label>
                      </div>
                    </div>
                    <div className="row mt-3">
                      <div className="col-lg-4 d-flex align-items-center">
                        <label htmlFor="">Nội dung:</label>
                      </div>
                      <div className="col-lg-8">
                        <InlineEdit placeholder="Nội dung">
                          <Input
                            name="content"
                            as="textarea"
                            rows={3}
                            defaultValue={editTask?.payload?.content}
                            onChange={(value) => {
                              setEditTask({
                                ...editTask,
                                payload: {
                                  ...editTask?.payload,
                                  content: value,
                                },
                              });
                            }}
                            size="lg"
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
                          value={editTask?.payload?.memberId}
                          onChange={(value) => {
                            setEditTask({
                              ...editTask,
                              payload: {
                                ...editTask.payload,
                                memberId: value,
                              },
                            });
                          }}
                        >
                          <SelectPicker
                            name="memberId"
                            size="lg"
                            data={Array.from(employees).map((item) => ({
                              label: item?.lastName + " " + item?.firstName,
                              value: item?.id,
                            }))}
                            block
                          />
                        </InlineEdit>
                      </div>
                    </div>
                    <div className="row mt-3">
                      <div className="col-lg-4 d-flex align-items-center">
                        <label htmlFor="">Hạn hoàn thành:</label>
                      </div>
                      <div className="col-lg-8">
                        <InlineEdit
                          placeholder="Ngày hoàn thành"
                          value={new Date(editTask?.payload?.deadline)}
                          onChange={(value) =>
                            setEditTask({
                              ...editTask,
                              payload: {
                                ...editTask?.payload,
                                deadline: value,
                              },
                            })
                          }
                        >
                          <DatePicker name="paymentDate" size="lg" block />
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
                        setEditTask({ ...editTask, open: false });
                      }}
                    >
                      Hủy
                    </Button>
                  </Modal.Footer>
                </form>
              </Modal>
            </Show.When>
            <Show.Else>
              <Reorder.Group
                values={tasks.items}
                onReorder={(list) => {
                  setTasks({
                    ...tasks,
                    items: list,
                  });
                }}
                style={{ listStyleType: "none", padding: 0 }}
              >
                {Array.from(tasks.items).map((task) => (
                  <Reorder.Item value={task} key={task.id}>
                    <Panel
                      shaded
                      className="mb-3 border"
                      style={{ background: "#fff", color: "#555" }}
                    >
                      <div
                        className={`d-flex justify-content-${
                          isOnMobile() ? "between" : "between"
                        } align-items-center gap-4`}
                      >
                        <Whisper
                          trigger="hover"
                          placement={"bottom"}
                          controlId={`control-id-mark`}
                          speaker={<Tooltip>Đánh dấu là hoàn thành</Tooltip>}
                        >
                          <Checkbox
                            checked={task.isCompleted}
                            onChange={() => {
                              api
                                .get(`tasks/${task.id}/mark`)
                                .then(() => {
                                  setReload(!reload);
                                })
                                .catch((err) => {
                                  console.log(err);
                                });
                            }}
                          />
                        </Whisper>
                        <div
                          className={`d-flex${
                            isOnMobile() ? " flex-column" : ""
                          } justify-content-between flex-grow-1`}
                        >
                          <span>{task.name}</span>
                          <div
                            className={`d-flex gap-lg-5${
                              isOnMobile() ? " flex-column" : ""
                            }`}
                          >
                            <span>{task.project?.name}</span>
                            Hạn hoàn thành:{" "}
                            {new Date(task.deadline).toLocaleDateString()}
                          </div>
                        </div>
                      </div>
                    </Panel>
                  </Reorder.Item>
                ))}
              </Reorder.Group>
            </Show.Else>
          </Show>
        </div>
      </Show.When>
      <Show.Else>
        <Navigate to={"/PageNotFound"} />
      </Show.Else>
    </Show>
  );
};

export default Task;
