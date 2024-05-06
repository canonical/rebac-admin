import type { Entitlement } from "components/EntitlementsPanelForm";
import type { Props as SubFormPanelProps } from "components/SubFormPanel";
import type { SetPanelWidth } from "hooks/usePanel";

export enum FieldName {
  NAME = "name",
}

export type FormFields = {
  [FieldName.NAME]: string;
};

export type Props = {
  close: SubFormPanelProps<FormFields>["close"];
  error?: SubFormPanelProps<FormFields>["error"];
  existingEntitlements?: string[];
  isFetchingExisting?: boolean;
  isSaving?: boolean;
  onSubmit: (
    values: FormFields,
    addEntitlements: Entitlement[],
    removeEntitlements?: Entitlement[],
  ) => Promise<void>;
  roleId?: string | null;
  setPanelWidth: SetPanelWidth;
};

export enum Label {
  NAME = "Role name",
}
