import { ModularTable } from "@canonical/react-components";
import { useCallback, useEffect, useMemo, type JSX } from "react";
import type { Column } from "react-table";

import { useGetIdentities } from "api/identities/identities";
import Content from "components/Content";
import Panel from "components/Panel";

const COLUMN_DATA: Column[] = [
  {
    Header: "first name",
    accessor: "firstName",
  },
  {
    Header: "last name",
    accessor: "lastName",
  },
  {
    Header: "added by",
    accessor: "addedBy",
  },
  {
    Header: "email",
    accessor: "email",
  },
  {
    Header: "source",
    accessor: "source",
  },
];

const Users = () => {
  const { data, isFetching, isSuccess } = useGetIdentities();

  const tableData = useMemo(() => {
    const users = data?.data.data;
    if (!users) {
      return [];
    }
    const tableData = users.map((user) => ({
      firstName: user?.firstName ?? "Unknown",
      lastName: user?.lastName ?? "Unknown",
      addedBy: user.addedBy,
      email: user.email,
      source: user.source,
    }));
    return tableData;
  }, [data]);

  useEffect(() => {
    if (!isFetching && isSuccess) {
      console.log("Users fetched succesfully.", data);
    }
  }, [isFetching, isSuccess, data]);

  const generateContent = useCallback((): JSX.Element => {
    if (isFetching) {
      return <h3>Fetching users data...</h3>;
    } else if (!isFetching && isSuccess) {
      return (
        <ModularTable
          className="audit-logs-table"
          columns={COLUMN_DATA}
          data={tableData}
          emptyMsg="No users found!"
        />
      );
    } else {
      return <h3>No data to display!</h3>;
    }
  }, [isFetching, isSuccess, tableData]);

  return (
    <Panel title="Users">
      <Content>{generateContent()}</Content>
    </Panel>
  );
};

export default Users;
