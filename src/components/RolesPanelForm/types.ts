import type { Role } from "api/api.schemas";

export type Props = {
  addRoles?: Role[];
  existingRoles?: Role[];
  removeRoles?: Role[];
  setAddRoles?: ((addRoles: Role[]) => void) | null;
  setRemoveRoles?: ((removeRoles: Role[]) => void) | null;
  showTable?: boolean;
};

export enum Label {
  SELECT = "Select roles",
  REMOVE = "Remove role",
}
