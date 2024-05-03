export type Props = {
  addIdentities: string[];
  error?: string | null;
  existingIdentities?: string[];
  removeIdentities: string[];
  setAddIdentities: (addIdentities: string[]) => void;
  setRemoveIdentities: (removeIdentities: string[]) => void;
};

export enum Label {
  USER = "Username",
  FORM = "Add user",
  REMOVE = "Remove user",
  SUBMIT = "Add",
}
