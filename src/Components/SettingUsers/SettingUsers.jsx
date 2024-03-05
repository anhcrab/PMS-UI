import { useEffect, useState } from "react";
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
  SelectPicker,
  Table,
  Tooltip,
  Whisper,
} from "rsuite";
import { Show } from "../Show/Show";
import api from "../../Utils/api";
import { authenticate } from "../../Utils/utils";

const SettingUsers = () => {
  const [reload, setReload] = useState(false);
  const [trashPage, setTrashPage] = useState(false);
  const [openAdd, setOpenAdd] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [tableLoading, setTableLoading] = useState(true);
  const [multipleChoices, setMultipleChoices] = useState({
    list: [],
    checkedAll: false,
    indeterminate: false,
  });
  const [users, setUsers] = useState({
    totalPages: 1,
    totalItems: 0,
    items: [],
  });
  const [pagination, setPagination] = useState({
    limit: 20,
    page: 1,
    role: "",
    search: "",
  });
  const [newUser, setNewUser] = useState({
    userName: "",
    email: "",
    password: "",
  });
  const [editUser, setEditUser] = useState({});
  const [editUserId, setEditUserId] = useState("");
  const { Column, HeaderCell, Cell } = Table;

  useEffect(() => {
    const { limit, page, role, search } = pagination;
    let endpoint = "users";
    if (trashPage) endpoint += "/trash";
    endpoint += `?limit=${limit}&page=${page}`;
    endpoint += role !== null && role !== "" ? `&role=${role}` : "";
    endpoint += search !== null && search !== "" ? `&search=${search}` : "";
    api
      .get(endpoint)
      .then((res) => {
        setTableLoading(false);
        setUsers(res.data);
        console.log(res.data);
      })
      .catch((err) => console.log(err));
  }, [pagination, reload, trashPage]);

  useEffect(() => {
    authenticate("/Auth/Login", true);
    if (multipleChoices.list.length === Array.from(users.items).length) {
      setMultipleChoices({
        ...multipleChoices,
        checkedAll: true,
        indeterminate: false,
      });
    } else if (multipleChoices.list.length === 0) {
      setMultipleChoices({
        ...multipleChoices,
        checkedAll: false,
        indeterminate: false,
      });
    } else if (
      multipleChoices.list.length > 0 &&
      multipleChoices.list.length < Array.from(users.items).length
    ) {
      setMultipleChoices({
        ...multipleChoices,
        indeterminate: true,
        checkedAll: false,
      });
    }
  }, [multipleChoices.list, users]);

  function handleCheckAll(value, checked) {
    const keys = checked ? Array.from(users.items).map((item) => item.id) : [];
    setMultipleChoices({
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
    setMultipleChoices({
      ...multipleChoices,
      list: keys,
    });
  }

  function handleEnter() {
    api
      .get("users/" + editUserId)
      .then((res) => {
        setEditUser(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }

  function createNewUser(e) {
    e.preventDefault();
    console.log(newUser);
    api
      .post("users", newUser)
      .then(() => {
        setReload(!reload);
      })
      .catch((err) => {
        console.log(err);
      });
  }

  return (
    <div data-bs-theme="dark" style={{ overflow: "hidden" }}>
      <div className="d-flex justify-content-between">
        <div className="d-flex justify-content-center gap-3">
          <Button
            onClick={() => {
              setOpenAdd(true);
            }}
            appearance="primary"
            style={{
              "--rs-btn-primary-bg": "var(--gradient-gold)",
              "--rs-btn-primary-hover-bg": "var(--rs-yellow-500)",
              "--rs-btn-primary-active-bg": "var(--rs-yellow-500)",
              "--rs-btn-primary-text": "#000",
              "--rs-btn-primary-hover-text": "#000",
            }}
          >
            Thêm tài khoản
          </Button>
          <Show>
            <Show.When isTrue={Array.from(multipleChoices.list).length > 0}>
              <Dropdown title="Hành động" size="lg">
                <Show>
                  <Show.When isTrue={trashPage}>
                    <Dropdown.Item
                      onClick={() => {
                        api
                          .post("users/restore", multipleChoices.list)
                          .then(() => {
                            setReload(!reload);
                            setMultipleChoices({
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
                          .post("users/trash", multipleChoices.list)
                          .then(() => {
                            setReload(!reload);
                            setMultipleChoices({
                              list: [],
                              checkedAll: false,
                              indeterminate: false,
                            });
                          });
                      }}
                    >
                      <i className="bi bi-trash-fill fs-5 text-danger"></i> Bỏ
                      vào thùng rác
                    </Dropdown.Item>
                  </Show.Else>
                </Show>
                <Dropdown.Item
                  onClick={() => {
                    api.post("users/delete", multipleChoices.list).then(() => {
                      setReload(!reload);
                      setMultipleChoices({
                        list: [],
                        checkedAll: false,
                        indeterminate: false,
                      });
                    });
                  }}
                >
                  <i className="bi bi-x-lg fs-5 text-danger"></i> Xóa vĩnh viễn
                </Dropdown.Item>
              </Dropdown>
            </Show.When>
          </Show>
        </div>
        <div className="d-flex gap-3 justify-content-center align-items-center">
          <SelectPicker
            name="filterByTypeId"
            onChange={(value) =>
              setPagination({
                ...pagination,
                role: value,
              })
            }
            size="lg"
            style={{
              "--rs-input-bg": "var(--rs-bg-card)",
              "--rs-input-focus-border": "var(--gradient-gold)",
              "--rs-picker-value": "var(--gradient-gold)",
              "--rs-border-primary": "transparent",
            }}
            label="Lọc theo vai trò"
            data={Array.from(rolesData).map((item) => ({
              label: item.label,
              value: item.value,
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
              "--rs-picker-value": "var(--gradient-gold)",
              "--rs-border-primary": "transparent",
            }}
          >
            <Input
              id="search"
              placeholder="Tìm kiếm"
              onPressEnter={() => {
                setPagination({
                  ...pagination,
                  search: document.getElementById("search").value,
                });
              }}
            />
            <InputGroup.Button
              onClick={() => {
                setPagination({
                  ...pagination,
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
        height={450}
        data={users.items}
        className="rounded mt-3"
        loading={tableLoading}
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
        <Column width={150} fixed>
          <HeaderCell className="fs-6">Tên tài khoản</HeaderCell>
          <Cell className="terus-column__pj-name">
            {(rowdata) => (
              <span
                className="w-100 h-100 d-flex justify-content-between"
                onClick={() => {
                  setEditUserId(rowdata.id);
                  setOpenEdit(true);
                }}
              >
                {rowdata.userName + " "}
                <i className="bi bi-pencil-fill"></i>
              </span>
            )}
          </Cell>
        </Column>
        <Column width={250}>
          <HeaderCell className="fs-6">Email</HeaderCell>
          <Cell>{(rowdata) => rowdata.email}</Cell>
        </Column>
        <Column flexGrow={1}>
          <HeaderCell className="fs-6">Số điện thoại</HeaderCell>
          <Cell dataKey="phoneNumber" />
        </Column>
        <Column flexGrow={1}>
          <HeaderCell className="fs-6">Vai trò</HeaderCell>
          <Cell>Chưa truy xuất được</Cell>
        </Column>
        <Column flexGrow={1}>
          <HeaderCell className="fs-6">Tình trạng</HeaderCell>
          <Cell dataKey="status" />
        </Column>
      </Table>
      <div
        className="p-2 rounded mt-3 px-3 d-flex flex-row justify-content-between"
        style={{
          background: "var(--rs-bg-card)",
        }}
      >
        <div className="d-flex gap-3 justify-content-center align-items-center">
          <Whisper
            trigger="hover"
            placement={"bottom"}
            controlId={`control-id-trash`}
            speaker={<Tooltip>{trashPage ? "Danh sách" : "Thùng rác"}</Tooltip>}
          >
            <Button
              appearance="subtle"
              onClick={() => {
                setTrashPage(!trashPage);
              }}
            >
              <i
                className={`bi bi-${
                  trashPage ? "list-task text-sencondary" : "trash text-danger"
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
            <Button appearance="subtle">
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
          total={1}
          activePage={1}
          // onChangePage={setPage}
          limit={20}
          limitOptions={[20, 50, 100]}
          // onChangeLimit={handleChangeLimit}
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
        open={openAdd}
        onClose={() => setOpenAdd(false)}
        backdrop="static"
      >
        <form id="new_user_form" onSubmit={createNewUser}>
          <Drawer.Header>
            <Drawer.Title>Thêm tài khoản</Drawer.Title>
            <Drawer.Actions>
              <Button
                onClick={() => setOpenAdd(false)}
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
              <Button onClick={() => setOpenAdd(false)} appearance="subtle">
                hủy
              </Button>
            </Drawer.Actions>
          </Drawer.Header>
          <Drawer.Body>
            <div className="row">
              <div className="col-12">
                <InputGroup>
                  <InputGroup.Addon>Tên tài khoản</InputGroup.Addon>
                  <Input
                    name="userName"
                    size="lg"
                    onChange={(value) => {
                      setNewUser({
                        ...newUser,
                        userName: value,
                      });
                    }}
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
                  <InputGroup.Addon>Email</InputGroup.Addon>
                  <Input
                    name="email"
                    size="lg"
                    onChange={(value) => {
                      setNewUser({
                        ...newUser,
                        email: value,
                      });
                    }}
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
                  <InputGroup.Addon>Mật khẩu</InputGroup.Addon>
                  <Input
                    name="password"
                    size="lg"
                    onChange={(value) => {
                      setNewUser({
                        ...newUser,
                        password: value,
                      });
                    }}
                    style={{
                      "--rs-input-bg": "transparent",
                      "--rs-input-focus-border": "var(--gradient-gold)",
                      "--rs-picker-value": "var(--gradient-gold)",
                    }}
                  />
                </InputGroup>
              </div>
            </div>
          </Drawer.Body>
        </form>
      </Drawer>

      <Modal
        open={openEdit}
        onClose={() => {
          setOpenEdit(false);
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
              .put(`users/${editUserId}`, editUser)
              .then((res) => {
                console.log(res.data);
                setReload(!reload);
                setOpenEdit(false);
              })
              .catch((err) => {
                console.log(err);
              });
          }}
        >
          <Modal.Header>
            <Modal.Title>Tài khoản {editUser.userName}</Modal.Title>
          </Modal.Header>
          <Modal.Body style={{ overflow: "hidden", minHeight: "600px" }}>
            <div className="row">
              <div className="col-lg-4 d-flex align-items-center">
                <label htmlFor="">Họ và Tên:</label>
              </div>
              <div className="col-lg-8 d-flex">
                <InlineEdit placeholder="Họ">
                  <Input
                    name="lastName"
                    defaultValue={editUser.lastName}
                    onChange={(value) => {
                      setEditUser({
                        ...editUser,
                        lastName: value,
                      });
                    }}
                    size="lg"
                  />
                </InlineEdit>
                <InlineEdit placeholder="Tên">
                  <Input
                    name="firstName"
                    defaultValue={editUser.firstName}
                    onChange={(value) => {
                      setEditUser({
                        ...editUser,
                        firstName: value,
                      });
                    }}
                    size="lg"
                  />
                </InlineEdit>
              </div>
            </div>
            <div className="row mt-3">
              <div className="col-lg-4 d-flex align-items-center">
                <label htmlFor="">Ngày sinh:</label>
              </div>
              <div className="col-lg-8">
                <InlineEdit
                  placeholder="Ngày thanh toán"
                  value={new Date(editUser.dob)}
                  onChange={(value) => {
                    setEditUser({
                      ...editUser,
                      dob: value,
                    });
                  }}
                >
                  <DatePicker name="dob" size="lg" block />
                </InlineEdit>
              </div>
            </div>
            <div className="row mt-3">
              <div className="col-lg-4 d-flex align-items-center">
                Giới tính:
              </div>
              <div className="col-lg-8">
                <InlineEdit
                  placeholder="Giới tính"
                  value={editUser.sex}
                  onChange={(value) => {
                    setEditUser({
                      ...editUser,
                      sex: value,
                    });
                  }}
                >
                  <SelectPicker
                    name="sex"
                    size="lg"
                    data={["male", "female"].map((item) => ({
                      label: item === "male" ? "Nam" : "Nữ",
                      value: item,
                    }))}
                    searchable={false}
                    block
                  />
                </InlineEdit>
              </div>
            </div>
            <div className="row mt-3">
              <div className="col-lg-4 d-flex align-items-center">
                Số điện thoại:
              </div>
              <div className="col-lg-8">
                <InlineEdit placeholder="Số điện thoại">
                  <Input
                    name="phoneNumber"
                    defaultValue={editUser.phoneNumber}
                    onChange={(value) => {
                      setEditUser({
                        ...editUser,
                        phoneNumber: value,
                      });
                    }}
                    size="lg"
                  />
                </InlineEdit>
              </div>
            </div>
            <div className="row mt-3">
              <div className="col-lg-4 d-flex align-items-center">Địa chỉ:</div>
              <div className="col-lg-8">
                <InlineEdit placeholder="Địa chỉ" className="w-100">
                  <Input
                    name="address"
                    defaultValue={editUser.address}
                    onChange={(value) => {
                      setEditUser({
                        ...editUser,
                        address: value,
                      });
                    }}
                    size="lg"
                  />
                </InlineEdit>
              </div>
            </div>
            <div className="row mt-3">
              <div className="col-lg-4 d-flex align-items-center">Mô tả:</div>
              <div className="col-lg-8">
              <InlineEdit placeholder="Viết mô tả ngắn..." className="w-100">
                  <Input
                    name="description"
                    defaultValue={editUser.description}
                    onChange={(value) => {
                      setEditUser({
                        ...editUser,
                        description: value,
                      });
                    }}
                    size="lg"
                  />
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
                setOpenEdit(false);
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

export default SettingUsers;

const rolesData = [
  {
    label: "Quản trị viên",
    value: "Admin",
  },
  {
    label: "Quản lý",
    value: "Manager",
  },
  {
    label: "Nhân viên",
    value: "Employee",
  },
  {
    label: "Khách",
    value: "Client",
  },
];
