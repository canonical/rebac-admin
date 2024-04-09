import type { FormikConfig, FormikValues } from "formik";
import type { PropsWithChildren } from "react";

export type Props<F extends FormikValues> = {
  close: () => void;
  entity: string;
  error?: string | null;
  isEditing?: boolean;
  isSaving?: boolean;
} & PropsWithChildren &
  Omit<FormikConfig<F>, "children">;

export enum Label {
  CANCEL = "Cancel",
}
