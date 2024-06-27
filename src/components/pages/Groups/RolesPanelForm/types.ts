import type { Role } from "api/api.schemas";

export type Props = {
  addRoles: Role[];
  error?: string | null;
  existingRoles?: Role[];
  removeRoles: Role[];
  setAddRoles: (addRoles: Role[]) => void;
  setRemoveRoles: (removeRoles: Role[]) => void;
};

export enum Label {
  ROLE = "Role name",
  FORM = "Add role",
  REMOVE = "Remove role",
  SUBMIT = "Add",
}
