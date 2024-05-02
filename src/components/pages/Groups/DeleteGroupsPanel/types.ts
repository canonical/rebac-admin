import type { Group } from "api/api.schemas";

import type { Props as GroupPanelProps } from "../GroupPanel";

export type FormFields = {
  message: string;
};

export type Props = {
  groups: Group[];
  close: GroupPanelProps["close"];
};

export enum Label {
  CANCEL = "Cancel",
  DELETE = "Delete",
  CONFIRMATION_MESSAGE_ERROR = "Wrong confirmation message",
}
