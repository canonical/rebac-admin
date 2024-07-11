import type { Props as SubFormPanelProps } from "components/SubFormPanel";
import type { SetPanelWidth } from "hooks/usePanel";

export enum FieldName {
  EMAIL = "email",
  FIRST_NAME = "firstName",
  LAST_NAME = "lastName",
}

export type FormFields = {
  [FieldName.EMAIL]: string;
  [FieldName.FIRST_NAME]?: string;
  [FieldName.LAST_NAME]?: string;
};

export type Props = {
  close: SubFormPanelProps<FormFields>["close"];
  error?: SubFormPanelProps<FormFields>["error"];
  onSubmit: (values: FormFields) => Promise<void>;
  setPanelWidth: SetPanelWidth;
  isSaving?: boolean;
};

export enum Label {
  EMAIL = "Email",
  FIRST_NAME = "First name (optional)",
  LAST_NAME = "Last name (optional)",
}
