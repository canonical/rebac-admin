import type { Group } from "api/api.schemas";

import type { Props as GroupPanelProps } from "../GroupPanel";

export type Props = {
  groups: Group[];
  close: GroupPanelProps["close"];
};

export enum Label {
  CANCEL = "Cancel",
  DELETE = "Delete",
}
