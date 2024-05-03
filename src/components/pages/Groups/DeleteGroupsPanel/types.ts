import type { Group } from "api/api.schemas";

import type { Props as GroupPanelProps } from "../GroupPanel";

export type Props = {
  groups: Group[];
  close: GroupPanelProps["close"];
};

export enum Label {
  DELETE_ERROR_MESSAGE = "Some groups couldn't be deleted",
  DEELTE_SUCCESS_MESSAGE = "Selected groups have been deleted",
}
