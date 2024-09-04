import type { EntityEntitlement, Group, Identity, Role } from "api/api.schemas";
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
  existingGroups?: Group[];
  existingEntitlements?: EntityEntitlement[];
  isFetchingExistingGroups?: boolean;
  isFetchingExistingEntitlements?: boolean;
  isEditing?: boolean;
  isFetchingUser?: boolean;
  onSubmit: (
    values: FormFields,
    addGroups: Group[],
    addRoles: Role[],
    addEntitlements: EntityEntitlement[],
    removeGroups: Group[],
    removeEntitlements: EntityEntitlement[],
  ) => Promise<void>;
  user?: Identity | null;
  setPanelWidth: SetPanelWidth;
  isSaving?: boolean;
};

export enum Label {
  EMAIL = "Email",
  FIRST_NAME = "First name (optional)",
  LAST_NAME = "Last name (optional)",
}
