import { ModularTable, Spinner } from "@canonical/react-components";
import { useMemo, type JSX } from "react";
import type { Column } from "react-table";

import { useGetGroups } from "api/groups/groups";
import Content from "components/Content";
import ErrorNotification from "components/ErrorNotification";

import { Label } from "./types";

const COLUMN_DATA: Column[] = [
  {
    Header: "group name",
    accessor: "groupName",
  },
];

const Groups = () => {
  const { data, isFetching, isError, error, refetch } = useGetGroups();

  const tableData = useMemo(() => {
    const groups = data?.data.data;
    if (!groups) {
      return [];
    }
    const tableData = groups.map((group) => ({
      groupName: group,
    }));
    return tableData;
  }, [data]);

  const generateContent = (): JSX.Element => {
    if (isFetching) {
      return <Spinner text={Label.FETCHING_GROUPS} />;
    } else if (isError) {
      return (
        <ErrorNotification
          message={Label.FETCHING_GROUPS_ERROR}
          error={error?.message ?? ""}
          onRefetch={() => void refetch()}
        />
      );
    } else {
      return (
        <ModularTable
          columns={COLUMN_DATA}
          data={tableData}
          emptyMsg={Label.NO_GROUPS}
        />
      );
    }
  };

  return <Content title="Groups">{generateContent()}</Content>;
};

export default Groups;
