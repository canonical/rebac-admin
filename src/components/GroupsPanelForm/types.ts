import type { Group } from "api/api.schemas";

export type Props = {
  addGroups?: Group[];
  existingGroups?: Group[];
  removeGroups?: Group[];
  setAddGroups?: ((addGroups: Group[]) => void) | null;
  setRemoveGroups?: ((removeGroups: Group[]) => void) | null;
  showTable?: boolean;
};

export enum Label {
  SELECT = "Select groups",
  REMOVE = "Remove group",
}
