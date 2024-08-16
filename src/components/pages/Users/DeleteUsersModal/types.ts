import type { Identity } from "api/api.schemas";
import type { DeleteEntityModalProps } from "components/DeleteEntityModal";

export type Props = {
  identities: NonNullable<Identity["id"]>[];
  close: DeleteEntityModalProps["close"];
  onDeleted?: () => void;
};

export enum Label {
  DELETE_ERROR_MESSAGE = "Some users couldn't be deleted",
  DEELTE_SUCCESS_MESSAGE = "Selected users have been deleted",
}
