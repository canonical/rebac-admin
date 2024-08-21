import type {
  ModularTableProps,
  PropsWithSpread,
} from "@canonical/react-components";
import type { ReactNode } from "react";

import type { EntitiesSelect } from "hooks/useEntitiesSelect";

export type TableEntity = {
  id?: string;
};

export type Props<E extends TableEntity> = PropsWithSpread<
  {
    checkboxesDisabled: boolean;
    entities?: E[];
    generateColumns: (entity: E) => Record<string, ReactNode>;
    onDelete: (entity: E) => void;
    onEdit: (entity: E) => void;
    selected: EntitiesSelect;
  },
  Omit<
    ModularTableProps<Record<string, unknown>>,
    "getHeaderProps" | "getCellProps" | "data"
  >
>;

export enum Label {
  ACTION_MENU = "Action menu",
  DELETE = "Delete",
  EDIT = "Edit",
  HEADER_ACTIONS = "actions",
  SELECT_ALL = "Select all",
}