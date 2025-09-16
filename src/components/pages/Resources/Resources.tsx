import { Spinner, ModularTable } from "@canonical/react-components";
import type { FC, ReactNode } from "react";
import { useMemo } from "react";

import { useGetResources } from "api/resources/resources";
import Content from "components/Content";
import EntityTablePagination from "components/EntityTable/EntityTablePagination";
import ErrorNotification from "components/ErrorNotification";
import NoEntityCard from "components/NoEntityCard";
import { usePagination } from "hooks/usePagination";
import { Endpoint } from "types/api";

import { Label } from "./types";

const COLUMN_DATA = [
  {
    Header: Label.HEADER_RESOURCE,
    accessor: "resource",
  },
  {
    Header: Label.HEADER_ENTITY,
    accessor: "entity",
  },
  {
    Header: Label.HEADER_PARENT,
    accessor: "parent",
  },
];

const Resources: FC = () => {
  const pagination = usePagination();
  const { data, isFetching, isError, error, refetch } = useGetResources({
    ...pagination.pageData,
  });
  const resources = data?.data.data;
  pagination.setResponse(data?.data);
  const tableData = useMemo<Record<string, unknown>[]>(
    () =>
      (resources || []).map((resource) => ({
        entity: resource.entity.type,
        parent: resource.parent?.name || "-",
        resource: resource.entity.name,
      })),
    [resources],
  );

  let content: ReactNode;
  if (isFetching) {
    content = <Spinner text={Label.FETCHING_RESOURCES} />;
  } else if (isError) {
    content = (
      <ErrorNotification
        message={Label.FETCHING_RESOURCES_ERROR}
        error={error?.message ?? ""}
        onRefetch={() => void refetch()}
      />
    );
  } else if (!resources?.length) {
    content = (
      <NoEntityCard title="No resources" message={Label.NO_RESOURCES} />
    );
  } else {
    content = (
      <>
        <EntityTablePagination pagination={pagination} />
        <ModularTable columns={COLUMN_DATA} data={tableData} />
      </>
    );
  }

  return (
    <Content endpoint={Endpoint.RESOURCES} title="Resources">
      {content}
    </Content>
  );
};

export default Resources;
