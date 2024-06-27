import type { Props as GroupPanelProps } from "../GroupPanel";

export type Props = {
  close: GroupPanelProps["close"];
  groupId: string;
  setPanelWidth: GroupPanelProps["setPanelWidth"];
};

export enum Label {
  ENTITLEMENTS_ERROR = "Some entitlements couldn't be updated.",
  IDENTITIES_ERROR = "Some users couldn't be updated.",
  ROLES_ERROR = "Some roles couldn't be updated.",
}
