import { FormikField, Spinner } from "@canonical/react-components";
import { useState } from "react";
import * as Yup from "yup";

import type { Entitlement } from "components/EntitlementsPanelForm";
import EntitlementsPanelForm from "components/EntitlementsPanelForm";
import SubFormPanel from "components/SubFormPanel";
import { PanelWidth } from "hooks/usePanel";

import type { FormFields } from "./types";
import { Label, type Props } from "./types";

const schema = Yup.object().shape({
  id: Yup.string().required("Required"),
});

const RolePanel = ({
  existingEntitlements,
  isFetchingExisting,
  isSaving,
  onSubmit,
  roleId,
  ...props
}: Props) => {
  const [addEntitlements, setAddEntitlements] = useState<Entitlement[]>([]);
  const [removeEntitlements, setRemoveEntitlements] = useState<Entitlement[]>(
    [],
  );
  const isEditing = !!roleId;
  return (
    <SubFormPanel<FormFields>
      {...props}
      submitEnabled={!!addEntitlements.length || !!removeEntitlements.length}
      entity="role"
      initialValues={{ id: roleId ?? "" }}
      isEditing={isEditing}
      isSaving={isSaving}
      onSubmit={async (values) =>
        await onSubmit(values, addEntitlements, removeEntitlements)
      }
      panelWidth={PanelWidth.DEFAULT}
      subForms={[
        {
          count:
            (existingEntitlements?.length ?? 0) +
            addEntitlements.length -
            removeEntitlements.length,
          entity: "entitlement",
          icon: "lock-locked",
          panelWidth: PanelWidth.MEDIUM,
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
    </SubFormPanel>
  );
};

export default RolePanel;
