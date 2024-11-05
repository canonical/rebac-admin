import type { EntityEntitlement, Role } from "api/api.schemas";
import type { Props as SubFormPanelProps } from "components/SubFormPanel";
import type { SetPanelWidth } from "hooks/usePanel";

import type { FormFields } from "./Fields";

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
    roleChanged: boolean,
    addEntitlements: EntityEntitlement[],
    removeEntitlements?: EntityEntitlement[],
  ) => Promise<void>;
  role?: Role | null;
  setPanelWidth: SetPanelWidth;
};
