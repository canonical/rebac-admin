import { Button, ModularTable } from "@canonical/react-components";
import { useEffect, useMemo } from "react";
import type { Column } from "react-table";

import { useGetIdentities } from "api/identities/identities";

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
  const { data, isFetching, isSuccess, refetch } = useGetIdentities(undefined, {
    query: {
      enabled: false,
    },
  });

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

  const fetchUsers = () => {
    refetch().catch((error) =>
      console.error("Unable to fetch user data.", error),
    );
  };

  useEffect(() => {
    if (!isFetching && isSuccess) {
      console.log("Users fetched succesfully.", data);
    }
  }, [isFetching, isSuccess, data]);

  if (isFetching) {
    return <h3>Fetching users data...</h3>;
  }

  if (!isFetching && isSuccess) {
    return (
      <>
        <Button onClick={fetchUsers}>Refetch data</Button>
        <ModularTable
          className="audit-logs-table"
          columns={COLUMN_DATA}
          data={tableData}
          emptyMsg="No users found!"
        />
      </>
    );
  }

  return (
    <>
      <h3>No data to display!</h3>
      <Button onClick={fetchUsers}>Fetch data</Button>
    </>
  );
};

export default Users;
