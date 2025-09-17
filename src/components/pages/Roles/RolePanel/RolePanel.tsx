import { Spinner } from "@canonical/react-components";
import type { FC } from "react";
import { useState } from "react";
import * as Yup from "yup";

import type { EntityEntitlement } from "api/api.schemas";
import EntitlementsPanelForm from "components/EntitlementsPanelForm";
import SubFormPanel from "components/SubFormPanel";
import { useCheckCapability, CapabilityAction } from "hooks/capabilities";
import { Endpoint } from "types/api";

import type { FormFields } from "./Fields";
import Fields, { FieldName } from "./Fields";
import type { Props } from "./types";

const schema = Yup.object().shape({
  [FieldName.NAME]: Yup.string().required("Required"),
});

const RolePanel: FC<Props> = ({
  existingEntitlements,
  isEditing,
  isFetchingExisting,
  isFetchingRole,
  isSaving,
  onSubmit,
  role,
  ...props
}: Props) => {
  const [isDirty, setIsDirty] = useState(false);
  const [addEntitlements, setAddEntitlements] = useState<EntityEntitlement[]>(
    [],
  );
  const [removeEntitlements, setRemoveEntitlements] = useState<
    EntityEntitlement[]
  >([]);
  const {
    hasCapability: canRelateEntitlements,
    isFetching: isFetchingEntitlementCapability,
  } = useCheckCapability(Endpoint.ROLE_ENTITLEMENTS, CapabilityAction.RELATE);
  return (
    <SubFormPanel<FormFields>
      {...props}
      submitEnabled={!!addEntitlements.length || !!removeEntitlements.length}
      entity="role"
      initialValues={{ name: role?.name ?? "" }}
      isEditing={isEditing}
      isFetching={isFetchingRole || isFetchingEntitlementCapability}
      isSaving={isSaving}
      onSubmit={async (values) => {
        await onSubmit(values, isDirty, addEntitlements, removeEntitlements);
      }}
      subForms={
        canRelateEntitlements
          ? [
              {
                count:
                  (existingEntitlements?.length ?? 0) +
                  addEntitlements.length -
                  removeEntitlements.length,
                entity: "entitlement",
                icon: "lock-locked",
                view: isFetchingExisting ? (
                  <Spinner />
                ) : (
                  <EntitlementsPanelForm
                    addEntitlements={addEntitlements}
                    existingEntitlements={existingEntitlements}
                    removeEntitlements={removeEntitlements}
                    setAddEntitlements={setAddEntitlements}
                    setRemoveEntitlements={setRemoveEntitlements}
                  />
                ),
              },
            ]
          : []
      }
      validationSchema={schema}
    >
      <Fields setIsDirty={setIsDirty} />
    </SubFormPanel>
  );
};

export default RolePanel;
