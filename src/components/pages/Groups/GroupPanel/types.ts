import type { Group, Role } from "api/api.schemas";
import type { EntityEntitlement } from "api/api.schemas";
import type { Identity } from "api/api.schemas";
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
  existingEntitlements?: EntityEntitlement[];
  existingIdentities?: Identity[];
  existingRoles?: Role[];
  isEditing?: boolean;
  isFetchingExistingEntitlements?: boolean;
  isFetchingExistingIdentities?: boolean;
  isFetchingExistingRoles?: boolean;
  isFetchingGroup?: boolean;
  isSaving?: boolean;
  onSubmit: (
    values: FormFields,
    addEntitlements: EntityEntitlement[],
    addIdentities: Identity[],
    addRoles: Role[],
    removeEntitlements?: EntityEntitlement[],
    removeIdentities?: Identity[],
    removeRoles?: Role[],
  ) => Promise<void>;
  group?: Group | null;
  setPanelWidth: SetPanelWidth;
};

export enum Label {
  NAME = "Group name",
}
