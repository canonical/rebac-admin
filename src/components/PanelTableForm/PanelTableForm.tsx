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
import fastDeepEqual from "fast-deep-equal";
import { useMemo, useState } from "react";
import type { Column } from "react-table";

import NoEntityCard from "components/NoEntityCard";
import { pluralize } from "utils";

import type { RowData, Props } from "./types";

const generateRow = <E,>(
  generateCells: Props<E>["generateCells"],
  entityName: string,
  entity: E,
  onRemove?: ((entity: E) => void) | null,
): Record<string, React.ReactNode> => ({
  ...generateCells(entity),
  actions: onRemove ? (
    <Button
      appearance="base"
      className="u-no-margin--bottom is-small"
      hasIcon
      onClick={() => onRemove(entity)}
    >
      <Icon name="delete">Remove {entityName}</Icon>
    </Button>
  ) : null,
});

// Search all string values in the entity for the substring.
const matches = <E,>(entity: E, search: string): boolean =>
  entity &&
  typeof entity === "object" &&
  Object.values(entity).some(
    (value) => typeof value === "string" && value.includes(search.trim()),
  );

const PanelTableForm = <E,>({
  addEntities,
  columns,
  entityMatches = matches,
  entityName,
  error,
  existingEntities,
  form,
  generateCells,
  removeEntities,
  setAddEntities,
  setRemoveEntities,
  showTable = true,
  isFetching,
}: Props<E>): JSX.Element => {
  const [search, setSearch] = useState("");
  const tableColumns: Column<RowData>[] = [
    ...columns,
    { Header: "Actions", accessor: "actions" },
  ];
  const tableData = useMemo<RowData[]>(() => {
    const add =
      addEntities.reduce<RowData[]>((filtered, newEntity) => {
        if (!search || entityMatches(newEntity, search)) {
          filtered.push(
            generateRow(
              generateCells,
              entityName,
              newEntity,
              setAddEntities
                ? (addEntity): void =>
                    setAddEntities(
                      addEntities.filter(
                        (entity) => !fastDeepEqual(entity, addEntity),
                      ),
                    )
                : null,
            ),
          );
        }
        return filtered;
      }, []) ?? [];
    const existing =
      existingEntities?.reduce<RowData[]>((filtered, existingEntity) => {
        if (
          !removeEntities.find((removed) =>
            fastDeepEqual(existingEntity, removed),
          ) &&
          (!search || entityMatches(existingEntity, search))
        ) {
          filtered.push(
            generateRow(
              generateCells,
              entityName,
              existingEntity,
              setRemoveEntities
                ? (entity): void =>
                    setRemoveEntities([...removeEntities, entity])
                : null,
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
          {form ? (
            <Row>
              <Col size={12}>{form}</Col>
            </Row>
          ) : null}
          {showTable ? (
            <>
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
                            return { className: "u-align--right" };
                          default:
                            return {};
                        }
                      }}
                      getHeaderProps={({ id }) => {
                        switch (id) {
                          case "actions":
                            return { className: "u-align--right" };
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
          ) : null}
        </>
      )}
    </>
  );
};

export default PanelTableForm;
