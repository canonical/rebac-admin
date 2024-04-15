import type { SubForm } from "components/PanelForm";

export type Props = {
  count: SubForm["count"];
  entity: SubForm["entity"];
  icon: SubForm["icon"];
  isEditing?: boolean;
  onClick: (entity: string) => void;
};
