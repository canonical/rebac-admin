import { Spinner } from "@canonical/react-components";
import { useState } from "react";
import * as Yup from "yup";

import CleanFormikField from "components/CleanFormikField";
import type { Entitlement } from "components/EntitlementsPanelForm";
import EntitlementsPanelForm from "components/EntitlementsPanelForm";
import SubFormPanel from "components/SubFormPanel";
import { PanelWidth } from "hooks/usePanel";

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
  const [addEntitlements, setAddEntitlements] = useState<Entitlement[]>([]);
  const [removeEntitlements, setRemoveEntitlements] = useState<Entitlement[]>(
    [],
  );
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
