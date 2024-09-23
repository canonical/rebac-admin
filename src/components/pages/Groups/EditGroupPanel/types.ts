import type { Group } from "api/api.schemas";

import type { GroupPanelProps } from "../GroupPanel";

export type Props = {
  close: GroupPanelProps["close"];
  onGroupUpdated: () => void;
  group: Group;
  groupId: NonNullable<Group["id"]>;
  setPanelWidth: GroupPanelProps["setPanelWidth"];
};

export enum Label {
  ENTITLEMENTS_ERROR = "Some entitlements couldn't be updated.",
  IDENTITIES_ERROR = "Some users couldn't be updated.",
  ROLES_ERROR = "Some roles couldn't be updated.",
  GROUP_ERROR = "Unable to update group.",
}
