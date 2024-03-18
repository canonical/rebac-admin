import { ModularTable, Spinner } from "@canonical/react-components";
import { useCallback, useMemo, type JSX } from "react";
import type { Column } from "react-table";

import { useGetIdentities } from "api/identities/identities";
import Content from "components/Content";
import { CapabilityAction, useCheckUsersCapability } from "hooks/capabilities";
import { Endpoint } from "types/api";

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
  const { data, isFetching, isError, error } = useGetIdentities();
  const { isActionAllowed } = useCheckUsersCapability(CapabilityAction.READ);

  console.log(isActionAllowed);

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

  const generateContent = useCallback((): JSX.Element => {
    if (isFetching) {
      return <Spinner text="Fetching users data..." />;
    } else if (!isActionAllowed) {
      return <h3>User data access not granted.</h3>;
    } else if (isError) {
      return <h3>Couldn't fetch user data. {error?.message ?? ""}</h3>;
    } else {
      return (
        <ModularTable
          className="audit-logs-table"
          columns={COLUMN_DATA}
          data={tableData}
          emptyMsg="No users found!"
        />
      );
    }
  }, [error?.message, isActionAllowed, isError, isFetching, tableData]);

  return (
    <Content title="Users" endpoint={Endpoint.IDENTITIES}>
      {generateContent()}
    </Content>
  );
};

export default Users;
