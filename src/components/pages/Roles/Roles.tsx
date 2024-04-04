import { ModularTable, Spinner } from "@canonical/react-components";
import { useMemo, type JSX } from "react";
import type { Column } from "react-table";

import { useGetRoles } from "api/roles/roles";
import Content from "components/Content";
import ErrorNotification from "components/ErrorNotification";

import { Label } from "./types";

const COLUMN_DATA: Column[] = [
  {
    Header: "role name",
    accessor: "roleName",
  },
];

const Roles = () => {
  const { data, isFetching, isError, error, refetch } = useGetRoles();

  const tableData = useMemo(() => {
    const roles = data?.data.data;
    if (!roles) {
      return [];
    }
    const tableData = roles.map((role) => ({
      roleName: role,
    }));
    return tableData;
  }, [data]);

  const generateContent = (): JSX.Element => {
    if (isFetching) {
      return <Spinner text={Label.FETCHING_ROLES} />;
    } else if (isError) {
      return (
        <ErrorNotification
          message={Label.FETCHING_ROLES_ERROR}
          error={error?.message ?? ""}
          onRefetch={() => void refetch()}
        />
      );
    } else {
      return (
        <ModularTable
          columns={COLUMN_DATA}
          data={tableData}
          emptyMsg={Label.NO_ROLES}
        />
      );
    }
  };

  return <Content title="Roles">{generateContent()}</Content>;
};

export default Roles;
