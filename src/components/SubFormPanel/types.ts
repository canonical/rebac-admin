import type { FormikValues } from "formik";
import type { ReactNode } from "react";

import type { Props as PanelFormProps } from "components/PanelForm";

export type SubForm = {
  count: number;
  entity: string;
  icon: string;
  view: ReactNode;
};

export type Props<F extends FormikValues> = {
  entity: string;
  isEditing?: boolean;
  subForms: SubForm[];
} & Omit<PanelFormProps<F>, "submitLabel">;

export enum TestId {
  DEFAULT_VIEW = "default-view",
}
