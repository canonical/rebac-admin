import { Spinner, ModularTable } from "@canonical/react-components";
import type { ReactNode } from "react";
import { useState, useMemo } from "react";

import { useGetEntitlements } from "api/entitlements/entitlements";
import Content from "components/Content";
import EntityTablePagination from "components/EntityTable/EntityTablePagination";
import ErrorNotification from "components/ErrorNotification";
import NoEntityCard from "components/NoEntityCard";
import { usePagination } from "hooks/usePagination";
import { Endpoint } from "types/api";

import { Label } from "./types";

const COLUMN_DATA = [
  {
    Header: Label.HEADER_ENTITY,
    accessor: "entity",
  },
  {
    Header: Label.HEADER_ENTITLEMENT,
    accessor: "entitlement",
  },
];

const Entitlements = () => {
  const [filter, setFilter] = useState("");
  const pagination = usePagination();
  const { data, isFetching, isError, error, refetch } = useGetEntitlements({
    filter: filter || undefined,
    ...pagination.pageData,
  });
  const entitlements = data?.data.data;
  pagination.setResponse(data?.data);
  const tableData = useMemo<Record<string, unknown>[]>(
    () =>
      (entitlements || []).map((entitlement) => ({
        entity: entitlement.entity_type,
        entitlement: entitlement.entitlement,
      })),
    [entitlements],
  );

  let content: ReactNode;
  if (isFetching) {
    content = <Spinner text={Label.FETCHING_ENTITLEMENTS} />;
  } else if (isError) {
    content = (
      <ErrorNotification
        message={Label.FETCHING_ENTITLEMENTS_ERROR}
        error={error?.message ?? ""}
        onRefetch={() => void refetch()}
      />
    );
  } else if (!entitlements?.length) {
    content = (
      <NoEntityCard title="No entitlements" message={Label.NO_ENTITLEMENTS} />
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
    <Content
      endpoint={Endpoint.GROUPS}
      onSearch={setFilter}
      title="Entitlements"
    >
      {content}
    </Content>
  );
};

export default Entitlements;
