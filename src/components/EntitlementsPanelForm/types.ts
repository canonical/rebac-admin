export type Entitlement = {
  entitlement: string;
  entity: string;
  resource: string;
};

export type Props = {
  addEntitlements: Entitlement[];
  error?: string | null;
  existingEntitlements?: string[];
  removeEntitlements: Entitlement[];
  setAddEntitlements: (addEntitlements: Entitlement[]) => void;
  setRemoveEntitlements: (removeEntitlements: Entitlement[]) => void;
};

export enum Label {
  EMPTY = "No entitlements",
  ENTITLEMENT = "Entitlement",
  ENTITY = "Resource type",
  FORM = "Add entitlement",
  RESOURCE = "Resource",
  REMOVE = "Remove entitlement",
  SUBMIT = "Add",
}
