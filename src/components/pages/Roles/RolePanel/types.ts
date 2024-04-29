import type { Entitlement } from "components/EntitlementsPanelForm";
import type { Props as SubFormPanelProps } from "components/SubFormPanel";

export type FormFields = {
  id: string;
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
};

export enum Label {
  NAME = "Role name",
}
