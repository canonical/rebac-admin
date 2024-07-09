import type { Role } from "api/api.schemas";

import type { Props as RolePanelProps } from "../RolePanel";

export type Props = {
  close: RolePanelProps["close"];
  role: Role;
  roleId: NonNullable<Role["id"]>;
  setPanelWidth: RolePanelProps["setPanelWidth"];
};
