import type { EntityEntitlement } from "api/api.schemas";

export type Props = {
  addEntitlements: EntityEntitlement[];
  error?: string | null;
  existingEntitlements?: EntityEntitlement[];
  removeEntitlements: EntityEntitlement[];
  setAddEntitlements: (addEntitlements: EntityEntitlement[]) => void;
  setRemoveEntitlements: (removeEntitlements: EntityEntitlement[]) => void;
};

export enum Label {
  ENTITLEMENT = "Entitlement",
  ENTITY = "Resource type",
  FORM = "Add entitlement",
  RESOURCE = "Resource",
  REMOVE = "Remove entitlement",
  SUBMIT = "Add",
}
