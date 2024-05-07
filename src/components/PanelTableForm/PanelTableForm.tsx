import {
  Col,
  Notification,
  NotificationSeverity,
  Row,
  ModularTable,
  Button,
  Icon,
  SearchBox,
} from "@canonical/react-components";
import type { ReactNode } from "react";
import { useMemo, useState } from "react";
import type { Column } from "react-table";

import NoEntityCard from "components/NoEntityCard";

import { type Props } from "./types";

import "./_panel-table-form.scss";

type RowData = Record<string, ReactNode>;

const generateRow = <E,>(
  generateCells: Props<E>["generateCells"],
  entityName: string,
  entity: E,
  onRemove: (entity: E) => void,
) => ({
  ...generateCells(entity),
  actions: (
    <Button
      appearance="base"
      className="u-no-margin--bottom is-small"
      hasIcon
      onClick={() => onRemove(entity)}
    >
      <Icon name="delete">Remove {entityName}</Icon>
    </Button>
  ),
});

const PanelTableForm = <E,>({
  addEntities,
  columns,
  entityEqual,
  entityMatches,
  entityName,
  error,
  existingEntities,
  form,
  generateCells,
  removeEntities,
  setAddEntities,
  setRemoveEntities,
}: Props<E>) => {
  const [search, setSearch] = useState("");
  const tableColumns: Column<any>[] = [
    ...columns,
    {
      Header: "Actions",
      accessor: "actions",
    },
  ];
  const tableData = useMemo(() => {
    const add =
      addEntities.reduce<RowData[]>((filtered, newEntity) => {
        if (!search || entityMatches(newEntity, search)) {
          filtered.push(
            generateRow(generateCells, entityName, newEntity, (newEntity) =>
              setAddEntities(
                addEntities.filter((entity) => !entityEqual(entity, newEntity)),
              ),
            ),
          );
        }
        return filtered;
      }, []) ?? [];
    const existing =
      existingEntities?.reduce<RowData[]>((filtered, existingEntity) => {
        if (
          !removeEntities.find((removed) =>
            entityEqual(existingEntity, removed),
          ) &&
          (!search || entityMatches(existingEntity, search))
        ) {
          filtered.push(
            generateRow(
              generateCells,
              entityName,
              existingEntity,
              (existingEntity) =>
                setRemoveEntities([...removeEntities, existingEntity]),
            ),
          );
        }
        return filtered;
      }, []) ?? [];

    return [...add, ...existing];
  }, [
    addEntities,
    existingEntities,
    search,
    entityMatches,
    generateCells,
    entityName,
    setAddEntities,
    entityEqual,
    removeEntities,
    setRemoveEntities,
  ]);
  return (
    <>
      {error ? (
        <Row>
          <Col size={12}>
            <Notification severity={NotificationSeverity.NEGATIVE}>
              {error}
            </Notification>
          </Col>
        </Row>
      ) : null}
      <Row>
        <Col size={12}>{form}</Col>
      </Row>
      <Row>
        <Col size={12}>
          <SearchBox externallyControlled onChange={setSearch} value={search} />
        </Col>
      </Row>
      <Row>
        <Col size={12}>
          {tableData.length || search ? (
            <ModularTable
              getCellProps={({ column }) => {
                switch (column.id) {
                  case "actions":
                    return {
                      className: "u-align--right",
                    };
                  default:
                    return {};
                }
              }}
              getHeaderProps={({ id }) => {
                switch (id) {
                  case "actions":
                    return {
                      className: "u-align--right",
                    };
                  default:
                    return {};
                }
              }}
              columns={tableColumns}
              data={tableData}
              emptyMsg={
                search
                  ? `No ${entityName}s match the search criteria.`
                  : undefined
              }
            />
          ) : (
            <NoEntityCard
              title={`No ${entityName}s`}
              message={`Add ${entityName}s using the form above.`}
            />
          )}
        </Col>
      </Row>
    </>
  );
};

export default PanelTableForm;