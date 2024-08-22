import type { Identity } from "api/api.schemas";

export type Props = {
  addIdentities: Identity[];
  existingIdentities?: Identity[];
  removeIdentities: Identity[];
  setAddIdentities: (addIdentities: Identity[]) => void;
  setRemoveIdentities: (removeIdentities: Identity[]) => void;
};

export enum Label {
  REMOVE = "Remove user",
  SELECT = "Select users",
}
