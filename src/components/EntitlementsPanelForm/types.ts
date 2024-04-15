export type Entitlement = {
  entitlement: string;
  entity: string;
  resource: string;
};

export type Props = {
  addEntitlements: Entitlement[];
  error?: string | null;
  setAddEntitlements: (addEntitlements: Entitlement[]) => void;
};

export enum Label {
  ENTITLEMENT = "Entitlement",
  ENTITY = "Resource type",
  FORM = "Add entitlement",
  RESOURCE = "Resource",
  REMOVE = "Remove entitlement",
  SUBMIT = "Add",
}
