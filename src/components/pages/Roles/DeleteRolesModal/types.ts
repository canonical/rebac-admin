import type { Role } from "api/api.schemas";
import type { DeleteEntityModalProps } from "components/DeleteEntityModal";

export type Props = {
  roles: NonNullable<Role["id"]>[];
  close: DeleteEntityModalProps["close"];
};

export enum Label {
  DELETE_ERROR_MESSAGE = "Some roles couldn't be deleted",
  DEELTE_SUCCESS_MESSAGE = "Selected roles have been deleted",
}
