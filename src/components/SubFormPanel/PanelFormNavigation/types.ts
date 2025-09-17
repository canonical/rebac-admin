import type { PanelWidth } from "hooks/usePanel";

export type Props = {
  defaultPanelWidth?: PanelWidth;
  isEditing?: boolean;
  panelEntity: string;
  panelLabelId?: string;
  setView: (view: null | string, panelWidth?: null | PanelWidth) => void;
  view?: null | string;
};
