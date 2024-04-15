import type { Entitlement } from "components/EntitlementsPanelForm";

export type FormFields = {
  id: string;
};

export type Props = {
  close: () => void;
  error?: string | null;
  isSaving?: boolean;
  onSubmit: (
    values: FormFields,
    addEntitlements: Entitlement[],
  ) => Promise<void>;
  roleId?: string | null;
};

export enum Label {
  NAME = "Role name",
}
