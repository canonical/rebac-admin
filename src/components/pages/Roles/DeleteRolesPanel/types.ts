import type { Role } from "api/api.schemas";

import type { Props as RolePanelProps } from "../RolePanel";

export type Props = {
  roles: Role[];
  close: RolePanelProps["close"];
};
