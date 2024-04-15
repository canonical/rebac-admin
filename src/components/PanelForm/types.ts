import type { FormikConfig, FormikValues } from "formik";
import type { PropsWithChildren, ReactNode } from "react";

export type SubForm = {
  count: number;
  entity: string;
  icon: string;
  view: ReactNode;
};

export type Props<F extends FormikValues> = {
  close: () => void;
  entity: string;
  error?: string | null;
  isEditing?: boolean;
  isSaving?: boolean;
  subForms: SubForm[];
} & PropsWithChildren &
  Omit<FormikConfig<F>, "children">;

export enum Label {
  CANCEL = "Cancel",
}

export enum TestId {
  DEFAULT_VIEW = "default-view",
}
