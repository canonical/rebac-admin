import type { Entitlement } from "components/EntitlementsPanelForm";

export type FormFields = {
  id: string;
};

export type Props = {
  close: () => void;
  error?: string | null;
  existingEntitlements?: string[];
  isFetchingExisting?: boolean;
  isSaving?: boolean;
  onSubmit: (
    values: FormFields,
    addEntitlements: Entitlement[],
    removeEntitlements?: Entitlement[],
  ) => Promise<void>;
  groupId?: string | null;
};

export enum Label {
  NAME = "Group name",
}
