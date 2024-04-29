export type Props = {
  isEditing?: boolean;
  panelEntity: string;
  panelLabelId?: string;
  setView: (view?: string | null) => void;
  view?: string | null;
};
