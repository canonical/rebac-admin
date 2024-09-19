import type { EntityEntitlement, Group, Identity, Role } from "api/api.schemas";
import type { Props as SubFormPanelProps } from "components/SubFormPanel";
import type { SetPanelWidth } from "hooks/usePanel";

import type { FormFields } from "./Fields/types";

export type Props = {
  close: SubFormPanelProps<FormFields>["close"];
  error?: SubFormPanelProps<FormFields>["error"];
  existingGroups?: Group[];
  existingRoles?: Role[];
  existingEntitlements?: EntityEntitlement[];
  isFetchingExistingGroups?: boolean;
  isFetchingExistingRoles?: boolean;
  isFetchingExistingEntitlements?: boolean;
  isEditing?: boolean;
  isFetchingUser?: boolean;
  onSubmit: (
    values: FormFields,
    isDirty: boolean,
    addGroups: Group[],
    addRoles: Role[],
    addEntitlements: EntityEntitlement[],
    removeGroups: Group[],
    removeRoles: Role[],
    removeEntitlements: EntityEntitlement[],
  ) => Promise<void>;
  user?: Identity | null;
  setPanelWidth: SetPanelWidth;
  isSaving?: boolean;
};
