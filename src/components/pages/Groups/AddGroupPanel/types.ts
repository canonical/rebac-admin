import type { GroupPanelProps } from "../GroupPanel";

export type Props = {
  close: GroupPanelProps["close"];
  setPanelWidth: GroupPanelProps["setPanelWidth"];
};

export enum Label {
  ENTITLEMENTS_ERROR = "Some entitlements couldn't be added",
  IDENTITIES_ERROR = "Some users couldn't be added",
  ROLES_ERROR = "Some roles couldn't be added",
}
