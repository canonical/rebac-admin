import type { ActionButtonProps } from "@canonical/react-components";
import type { FormikConfig, FormikValues } from "formik";
import type { PropsWithChildren, ReactNode } from "react";

export type Props<F extends FormikValues> = {
  close: () => void;
  error?: string | null;
  isSaving?: boolean;
  submitEnabled?: boolean;
  submitLabel: ReactNode;
  submitButtonAppearance?: ActionButtonProps["appearance"];
} & PropsWithChildren &
  Omit<FormikConfig<F>, "children">;

export enum Label {
  CANCEL = "Cancel",
}
