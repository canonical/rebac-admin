import type { Identity } from "api/api.schemas";

export type Props = {
  addIdentities: Identity[];
  error?: string | null;
  existingIdentities?: Identity[];
  removeIdentities: Identity[];
  setAddIdentities: (addIdentities: Identity[]) => void;
  setRemoveIdentities: (removeIdentities: Identity[]) => void;
};

export enum Label {
  USER = "Username",
  FORM = "Add user",
  REMOVE = "Remove user",
  SUBMIT = "Add",
}
