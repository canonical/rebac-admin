import type { PanelWidth } from "hooks/usePanel";

export type Props = {
  defaultPanelWidth?: PanelWidth;
  isEditing?: boolean;
  panelEntity: string;
  panelLabelId?: string;
  setView: (view: string | null, panelWidth?: PanelWidth | null) => void;
  view?: string | null;
};
