import { FormikField, Spinner } from "@canonical/react-components";
import { useState } from "react";
import * as Yup from "yup";

import type { Entitlement } from "components/EntitlementsPanelForm";
import EntitlementsPanelForm from "components/EntitlementsPanelForm";
import PanelForm from "components/PanelForm";

import type { FormFields } from "./types";
import { Label, type Props } from "./types";

const schema = Yup.object().shape({
  id: Yup.string().required("Required"),
});

const RolePanel = ({
  close,
  error,
  existingEntitlements,
  isFetchingExisting,
  roleId,
  onSubmit,
  isSaving,
}: Props) => {
  const [addEntitlements, setAddEntitlements] = useState<Entitlement[]>([]);
  const [removeEntitlements, setRemoveEntitlements] = useState<Entitlement[]>(
    [],
  );
  const isEditing = !!roleId;
  return (
    <PanelForm<FormFields>
      submitEnabled={!!addEntitlements.length || !!removeEntitlements.length}
      close={close}
      entity="role"
      error={error}
      initialValues={{ id: roleId ?? "" }}
      isEditing={isEditing}
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
      <FormikField
        disabled={isEditing}
        label={Label.NAME}
        name="id"
        takeFocus={!isEditing}
        type="text"
      />
    </PanelForm>
  );
};

export default RolePanel;
