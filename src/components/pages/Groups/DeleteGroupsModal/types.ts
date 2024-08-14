import type { Group } from "api/api.schemas";
import type { DeleteEntityModalProps } from "components/DeleteEntityModal";

export type Props = {
  groups: NonNullable<Group["id"]>[];
  close: DeleteEntityModalProps["close"];
};

export enum Label {
  DELETE_ERROR_MESSAGE = "Some groups couldn't be deleted",
  DEELTE_SUCCESS_MESSAGE = "Selected groups have been deleted",
}
