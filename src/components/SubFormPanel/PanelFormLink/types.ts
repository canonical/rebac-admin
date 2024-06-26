import type { SubForm } from "../types";

export type Props = {
  count: SubForm["count"];
  entity: SubForm["entity"];
  icon: SubForm["icon"];
  isEditing?: boolean;
  onClick: (entity: string) => void;
};
