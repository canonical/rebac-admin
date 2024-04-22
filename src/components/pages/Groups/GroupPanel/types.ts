import type { Entitlement } from "components/EntitlementsPanelForm";

export type FormFields = {
  id: string;
};

export type Props = {
  close: () => void;
  error?: string | null;
  existingEntitlements?: string[];
  existingIdentities?: string[];
  isFetchingExistingEntitlements?: boolean;
  isFetchingExistingIdentities?: boolean;
  isSaving?: boolean;
  onSubmit: (
    values: FormFields,
    addEntitlements: Entitlement[],
    addIdentities: string[],
    removeEntitlements?: Entitlement[],
    removeIdentities?: string[],
  ) => Promise<void>;
  groupId?: string | null;
};

export enum Label {
  NAME = "Group name",
}
