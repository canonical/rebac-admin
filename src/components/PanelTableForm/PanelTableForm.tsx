import {
  Col,
  Notification,
  NotificationSeverity,
  Row,
  ModularTable,
  Button,
  Icon,
  SearchBox,
  Spinner,
} from "@canonical/react-components";
import { useMemo, useState } from "react";
import type { Column } from "react-table";

import NoEntityCard from "components/NoEntityCard";
import { pluralize } from "utils";

import type { RowData } from "./types";
import { type Props } from "./types";

import "./_panel-table-form.scss";

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
  isFetching,
}: Props<E>) => {
  const [search, setSearch] = useState("");
  const tableColumns: Column<RowData>[] = [
    ...columns,
    {
      Header: "Actions",
      accessor: "actions",
    },
  ];
  const tableData = useMemo<RowData[]>(() => {
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
      {isFetching ? (
        <Row>
          <Col size={12}>
            <Spinner text={`Loading ${pluralize(entityName)}`} />
          </Col>
        </Row>
      ) : (
        <>
          <Row>
            <Col size={12}>{form}</Col>
          </Row>
          <Row>
            <Col size={12}>
              <SearchBox
                externallyControlled
                onChange={setSearch}
                value={search}
              />
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
      )}
    </>
  );
};

export default PanelTableForm;
