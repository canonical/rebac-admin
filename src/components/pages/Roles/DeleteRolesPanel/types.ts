import type { Role } from "api/api.schemas";

import type { Props as RolePanelProps } from "../RolePanel";

export type Props = {
  roles: NonNullable<Role["id"]>[];
  close: RolePanelProps["close"];
};

export enum Label {
  DELETE_ERROR_MESSAGE = "Some roles couldn't be deleted",
  DEELTE_SUCCESS_MESSAGE = "Selected roles have been deleted",
}
