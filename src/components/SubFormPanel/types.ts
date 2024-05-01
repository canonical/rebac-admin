import type { FormikValues } from "formik";
import type { ReactNode } from "react";

import type { Props as PanelFormProps } from "components/PanelForm";
import type { PanelWidth, SetPanelWidth } from "hooks/usePanel";

export type SubForm = {
  count: number;
  entity: string;
  icon: string;
  panelWidth?: PanelWidth;
  view: ReactNode;
};

export type Props<F extends FormikValues> = {
  entity: string;
  isEditing?: boolean;
  panelWidth?: PanelWidth;
  setPanelWidth: SetPanelWidth;
  subForms: SubForm[];
} & Omit<PanelFormProps<F>, "submitLabel">;

export enum TestId {
  DEFAULT_VIEW = "default-view",
}
