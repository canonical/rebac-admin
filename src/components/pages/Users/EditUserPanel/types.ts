import type { QueryKey } from "@tanstack/react-query";

import type { Identity } from "api/api.schemas";

import type { UserPanelProps } from "../UserPanel";

export type Props = {
  close: UserPanelProps["close"];
  user: Identity;
  userId: NonNullable<Identity["id"]>;
  setPanelWidth: UserPanelProps["setPanelWidth"];
  userQueryKey?: QueryKey;
};

export enum Label {
  GROUPS_ERROR = "Some groups couldn't be updated.",
  ROLES_ERROR = "Some roles couldn't be updated.",
  ENTITLEMENTS_ERROR = "Some entitlements couldn't be updated.",
  USER_ERROR = "User couldn't be updated.",
}
