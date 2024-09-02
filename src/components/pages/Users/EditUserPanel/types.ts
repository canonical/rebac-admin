import type { Identity } from "api/api.schemas";

import type { UserPanelProps } from "../UserPanel";

export type Props = {
  close: UserPanelProps["close"];
  user: Identity;
  userId: NonNullable<Identity["id"]>;
  setPanelWidth: UserPanelProps["setPanelWidth"];
};

export enum Label {
  ENTITLEMENTS_ERROR = "Some entitlements couldn't be updated.",
}
