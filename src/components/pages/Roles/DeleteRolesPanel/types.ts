import type { Role } from "api/api.schemas";

import type { Props as RolePanelProps } from "../RolePanel";

export type FormFields = {
  message: string;
};

export type Props = {
  roles: Role[];
  close: RolePanelProps["close"];
};

export enum Label {
  CANCEL = "Cancel",
  DELETE = "Delete",
  CONFIRMATION_MESSAGE_ERROR = "Wrong confirmation message",
}
