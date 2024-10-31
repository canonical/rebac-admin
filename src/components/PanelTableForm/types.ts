import type { ReactNode } from "react";
import type { Column } from "react-table";

export type RowData = Record<string, ReactNode>;

export type Props<E> = {
  addEntities: E[];
  columns: Column<RowData>[];
  entityMatches?: (entity: E, search: string) => boolean;
  entityName: string;
  error?: string | null;
  existingEntities?: E[];
  form?: ReactNode;
  generateCells: (entity: E) => Record<string, ReactNode>;
  isFetching?: boolean;
  removeEntities: E[];
  setAddEntities?: ((addEntities: E[]) => void) | null;
  setRemoveEntities?: ((removeEntities: E[]) => void) | null;
  showTable?: boolean;
};
