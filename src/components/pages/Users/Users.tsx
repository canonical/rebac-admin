import { ModularTable, Spinner } from "@canonical/react-components";
import { useMemo, type JSX } from "react";
import type { Column } from "react-table";

import { useGetIdentities } from "api/identities/identities";
import Content from "components/Content";
import ErrorNotification from "components/ErrorNotification";
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
  const { data, isFetching, isError, error, refetch } = useGetIdentities(
    undefined,
    // Failed query will not retry. Might need to add this option to all queries.
    { query: { retry: false } },
  );

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

  const generateContent = (): JSX.Element => {
    if (isFetching) {
      return <Spinner text="Fetching users data..." />;
    } else if (isError) {
      return (
        <ErrorNotification
          message="Couldn't fetch user data."
          error={error?.message ?? ""}
          onClick={() => void refetch()}
        />
      );
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
  };

  return (
    <Content title="Users" endpoint={Endpoint.IDENTITIES}>
      {generateContent()}
    </Content>
  );
};

export default Users;
