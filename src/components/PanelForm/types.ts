import type { ActionButtonProps } from "@canonical/react-components";
import type { FormikConfig, FormikValues } from "formik";
import type { PropsWithChildren, ReactNode } from "react";

export type Props<F extends FormikValues> = {
  close: () => void;
  error?: null | string;
  isSaving?: boolean;
  submitEnabled?: boolean;
  submitLabel: ReactNode;
  submitButtonAppearance?: ActionButtonProps["appearance"];
} & Omit<FormikConfig<F>, "children"> &
  PropsWithChildren;

export enum Label {
  CANCEL = "Cancel",
}
