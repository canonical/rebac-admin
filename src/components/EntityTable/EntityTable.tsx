import type { MenuLink } from "@canonical/react-components";
import {
  ModularTable,
  CheckboxInput,
  ContextualMenu,
  Icon,
} from "@canonical/react-components";
import { useMemo } from "react";

import EntityTablePagination from "./EntityTablePagination";
import type { TableEntity, Label, type Props } from "./types";

const getProps = (id: string) => {
  switch (id) {
    case "selectEntity":
      return {
        className: "select-entity-checkbox",
      };
    case "actions":
      return {
        className: "u-align--right",
      };
    default:
      return {};
  }
};

const EntityTable = <E extends TableEntity>({
  columns,
  checkboxesDisabled,
  entities,
  generateColumns,
  onDelete,
  onEdit,
  pagination,
  selected,
  ...props
}: Props<E>) => {
  const allColumns = [
    {
      Header: (
        <CheckboxInput
          label=""
          inline
          checked={selected.areAllEntitiesSelected}
          indeterminate={
            !selected.areAllEntitiesSelected &&
            !!selected.selectedEntities.length
          }
          onChange={selected.handleSelectAllEntities}
          disabled={checkboxesDisabled}
          aria-label={Label.SELECT_ALL}
          aria-labelledby={undefined}
        />
      ),
      accessor: "selectEntity",
    },
    ...columns,
    {
      Header: Label.HEADER_ACTIONS,
      accessor: "actions",
    },
  ];
  const tableData = useMemo(
    () =>
      (entities || []).map((entity) => {
        const actions: MenuLink[] = [];
        if (onEdit) {
          actions.push({
            appearance: "link",
            children: (
              <>
                <Icon name="edit" /> {Label.EDIT}
              </>
            ),
            onClick: () => onEdit(entity),
          });
        }
        if (onDelete) {
          actions.push({
            appearance: "link",
            children: (
              <>
                <Icon name="delete" /> {Label.DELETE}
              </>
            ),
            onClick: () => onDelete(entity),
          });
        }
        return {
          selectEntity: (
            <CheckboxInput
              label=""
              inline
              checked={
                selected.areAllEntitiesSelected ||
                (!!entity.id && selected.selectedEntities.includes(entity.id))
              }
              onChange={() =>
                entity.id && selected.handleSelectEntity(entity.id)
              }
              disabled={checkboxesDisabled}
              aria-labelledby={undefined}
            />
          ),
          ...generateColumns(entity),
          actions: actions.length ? (
            <ContextualMenu
              links={actions}
              position="right"
              scrollOverflow
              toggleAppearance="base"
              toggleClassName="has-icon u-no-margin--bottom is-small"
              toggleLabel={<Icon name="menu">{Label.ACTION_MENU}</Icon>}
            />
          ) : null,
        };
      }),
    [checkboxesDisabled, entities, generateColumns, onDelete, onEdit, selected],
  );
  return (
    <>
      <EntityTablePagination pagination={pagination} />
      <ModularTable
        {...props}
        columns={allColumns}
        data={tableData}
        getCellProps={({ column: { id } }) => getProps(id)}
        getHeaderProps={({ id }) => getProps(id)}
      />
    </>
  );
};

export default EntityTable;
