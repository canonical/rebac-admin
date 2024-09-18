import type { Role } from "api/api.schemas";

import type { Props as RolePanelProps } from "../RolePanel";

export type Props = {
  close: RolePanelProps["close"];
  onRoleUpdated: () => void;
  role: Role;
  roleId: NonNullable<Role["id"]>;
  setPanelWidth: RolePanelProps["setPanelWidth"];
};

export enum Label {
  ERROR_ENTITLEMENTS = "Some entitlements couldn't be updated",
  ERROR_ROLE = "Unable to update role",
}
