import { Spinner } from "@canonical/react-components";
import { useState } from "react";
import * as Yup from "yup";

import type { EntityEntitlement } from "api/api.schemas";
import CleanFormikField from "components/CleanFormikField";
import EntitlementsPanelForm from "components/EntitlementsPanelForm";
import SubFormPanel from "components/SubFormPanel";

import type { FormFields } from "./types";
import { FieldName, Label, type Props } from "./types";

const schema = Yup.object().shape({
  [FieldName.NAME]: Yup.string().required("Required"),
});

const RolePanel = ({
  existingEntitlements,
  isEditing,
  isFetchingExisting,
  isFetchingRole,
  isSaving,
  onSubmit,
  role,
  ...props
}: Props) => {
  const [addEntitlements, setAddEntitlements] = useState<EntityEntitlement[]>(
    [],
  );
  const [removeEntitlements, setRemoveEntitlements] = useState<
    EntityEntitlement[]
  >([]);
  return (
    <SubFormPanel<FormFields>
      {...props}
      submitEnabled={!!addEntitlements.length || !!removeEntitlements.length}
      entity="role"
      initialValues={{ name: role?.name ?? "" }}
      isEditing={isEditing}
      isFetching={isFetchingRole}
      isSaving={isSaving}
      onSubmit={async (values) =>
        await onSubmit(values, addEntitlements, removeEntitlements)
      }
      subForms={[
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
      ]}
      validationSchema={schema}
    >
      <CleanFormikField
        disabled={isEditing}
        label={Label.NAME}
        name={FieldName.NAME}
        takeFocus={!isEditing}
        type="text"
      />
    </SubFormPanel>
  );
};

export default RolePanel;
