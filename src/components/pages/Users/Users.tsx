import { ModularTable, Spinner } from "@canonical/react-components";
import { useCallback, useEffect, useMemo, type JSX } from "react";
import type { Column } from "react-table";

import { useGetIdentities } from "api/identities/identities";
import Content from "components/Content";
import {
  CapabilityActionItem,
  useCheckCapabilityAction,
} from "hooks/capabilities";
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
  const { data, isFetching, isSuccess, refetch } = useGetIdentities(undefined, {
    query: {
      enabled: false,
    },
  });
  const { isActionAllowed } = useCheckCapabilityAction(
    Endpoint.IDENTITIES,
    CapabilityActionItem.LIST,
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

  useEffect(() => {
    if (!isFetching && isSuccess) {
      console.log("Users fetched succesfully.", data);
    }
  }, [isFetching, isSuccess, data]);

  useEffect(() => {
    if (isActionAllowed) {
      refetch().catch((error) =>
        console.error("Unable to fetch users.", error),
      );
    }
  }, [isActionAllowed, refetch]);

  const generateContent = useCallback((): JSX.Element => {
    if (isFetching) {
      return <Spinner text="Fetching users data..." />;
    } else if (isSuccess) {
      return (
        <ModularTable
          className="audit-logs-table"
          columns={COLUMN_DATA}
          data={tableData}
          emptyMsg="No users found!"
        />
      );
    } else {
      return <h3>Couldn't fetch user data!</h3>;
    }
  }, [isFetching, isSuccess, tableData]);

  return (
    <Content title="Users" endpoint="/identities">
      {generateContent()}
    </Content>
  );
};

export default Users;
