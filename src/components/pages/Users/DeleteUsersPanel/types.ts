import type { Identity } from "api/api.schemas";

import type { UserPanelProps } from "../UserPanel";

export type Props = {
  identities: NonNullable<Identity["id"]>[];
  close: UserPanelProps["close"];
};

export enum Label {
  DELETE_ERROR_MESSAGE = "Some users couldn't be deleted",
  DEELTE_SUCCESS_MESSAGE = "Selected users have been deleted",
}
