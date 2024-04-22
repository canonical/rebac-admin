import type { Props as GroupPanelProps } from "../GroupPanel";

export type Props = {
  close: GroupPanelProps["close"];
};

export enum Label {
  ENTITLEMENTS_ERROR = "Some entitlements couldn't be added",
  IDENTITIES_ERROR = "Some users couldn't be added",
}
