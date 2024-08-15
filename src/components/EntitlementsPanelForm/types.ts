import type { EntityEntitlement } from "api/api.schemas";
import type { FormikSubmitButtonProps } from "components/FormikSubmitButton";

export type Props = {
  addEntitlements?: EntityEntitlement[];
  existingEntitlements?: EntityEntitlement[];
  removeEntitlements?: EntityEntitlement[];
  setAddEntitlements: (addEntitlements: EntityEntitlement[]) => void;
  setRemoveEntitlements: (removeEntitlements: EntityEntitlement[]) => void;
  submitProps?: Partial<FormikSubmitButtonProps>;
};

export enum Label {
  ENTITLEMENT = "Entitlement",
  ENTITY = "Resource type",
  FORM = "Add entitlement",
  RESOURCE = "Resource",
  REMOVE = "Remove entitlement",
  SUBMIT = "Add",
  ADD_ENTITLEMENT = "Add entitlement tuple",
}
