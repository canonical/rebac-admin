export type Props = {
  addRoles: string[];
  error?: string | null;
  existingRoles?: string[];
  removeRoles: string[];
  setAddRoles: (addRoles: string[]) => void;
  setRemoveRoles: (removeRoles: string[]) => void;
};

export enum Label {
  ROLE = "Role name",
  FORM = "Add role",
  REMOVE = "Remove role",
  SUBMIT = "Add",
}
