import type { EntityEntitlement, Role } from "api/api.schemas";
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
  isEditing?: boolean;
  isFetchingExisting?: boolean;
  isFetchingRole?: boolean;
  isSaving?: boolean;
  onSubmit: (
    values: FormFields,
    addEntitlements: EntityEntitlement[],
    removeEntitlements?: EntityEntitlement[],
  ) => Promise<void>;
  role?: Role | null;
  setPanelWidth: SetPanelWidth;
};

export enum Label {
  NAME = "Role name",
}
