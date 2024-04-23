import type { Entitlement } from "components/EntitlementsPanelForm";

export type FormFields = {
  id: string;
};

export type Props = {
  close: () => void;
  error?: string | null;
  existingEntitlements?: string[];
  existingIdentities?: string[];
  existingRoles?: string[];
  isFetchingExistingEntitlements?: boolean;
  isFetchingExistingIdentities?: boolean;
  isFetchingExistingRoles?: boolean;
  isSaving?: boolean;
  onSubmit: (
    values: FormFields,
    addEntitlements: Entitlement[],
    addIdentities: string[],
    addRoles: string[],
    removeEntitlements?: Entitlement[],
    removeIdentities?: string[],
    removeRoles?: string[],
  ) => Promise<void>;
  groupId?: string | null;
};

export enum Label {
  NAME = "Group name",
}
