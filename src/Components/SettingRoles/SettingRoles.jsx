import { Table } from "rsuite";
import api from "../../Utils/api";
import { useEffect, useState } from "react";
import { isOnDesktop } from "../../Utils/utils";

const SettingRoles = () => {
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(true);
  const { Column, HeaderCell, Cell } = Table;

  useEffect(() => {
    api
      .get("roles")
      .then((res) => {
        setRoles(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  return (
    <div>
      <Table
        height={420}
        width={isOnDesktop() ? 800 : 340}
        className="rounded mt-3"
        data={roles}
        loading={loading}
        autoHeight
        style={{ boxShadow: '0 0 4px #ccc' }}
      >
        <Column width={56} fixed>
          <HeaderCell className="text-center fs-6">#</HeaderCell>
          <Cell className="text-center fs-6">{(_, index) => index + 1}</Cell>
        </Column>
        <Column flexGrow={1}>
          <HeaderCell className="text-center fs-6">Tên</HeaderCell>
          <Cell className="text-center">{(rowdata) => rowdata.name}</Cell>
        </Column>
        <Column flexGrow={1}>
          <HeaderCell className="text-center fs-6">Mã số Role</HeaderCell>
          <Cell className="">{(rowdata) => rowdata.id}</Cell>
        </Column>
      </Table>
    </div>
  );
};

export default SettingRoles;
