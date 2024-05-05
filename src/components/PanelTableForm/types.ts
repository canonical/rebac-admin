import type { ReactNode } from "react";
import type { Column } from "react-table";

export type Props<E> = {
  addEntities: E[];
  columns: Column<any>[];
  entityName: string;
  entityEqual: (entityA: E, entityB: E) => boolean;
  entityMatches: (entity: E, search: string) => boolean;
  error?: string | null;
  existingEntities?: E[];
  form: ReactNode;
  generateCells: (entity: E) => Record<string, ReactNode>;
  removeEntities: E[];
  setAddEntities: (addEntities: E[]) => void;
  setRemoveEntities: (removeEntities: E[]) => void;
};
