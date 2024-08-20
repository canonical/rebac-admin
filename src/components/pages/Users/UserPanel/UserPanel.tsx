import { useState } from "react";
import * as Yup from "yup";

import type { EntityEntitlement } from "api/api.schemas";
import CleanFormikField from "components/CleanFormikField";
import EntitlementsPanelForm from "components/EntitlementsPanelForm";
import SubFormPanel from "components/SubFormPanel";

import { FieldName, Label } from "./types";
import type { FormFields, Props } from "./types";

const schema = Yup.object().shape({
  [FieldName.EMAIL]: Yup.string().required("Required"),
});

const UserPanel = ({ onSubmit, isSaving, ...props }: Props) => {
  const [addEntitlements, setAddEntitlements] = useState<EntityEntitlement[]>(
    [],
  );
  return (
    <SubFormPanel<FormFields>
      {...props}
      submitEnabled={!!addEntitlements.length}
      entity="local user"
      initialValues={{
        [FieldName.EMAIL]: "",
        [FieldName.FIRST_NAME]: "",
        [FieldName.LAST_NAME]: "",
      }}
      onSubmit={async (values) => await onSubmit(values, addEntitlements)}
      subForms={[
        {
          count: addEntitlements.length,
          entity: "entitlement",
          icon: "lock-locked",
          view: (
            <EntitlementsPanelForm
              addEntitlements={addEntitlements}
              setAddEntitlements={setAddEntitlements}
              setRemoveEntitlements={(_entitlements: EntityEntitlement[]) => {}}
            />
          ),
        },
      ]}
      validationSchema={schema}
    >
      <h5>Personal details</h5>
      <CleanFormikField
        label={Label.EMAIL}
        name={FieldName.EMAIL}
        takeFocus={true}
        type="email"
      />
      <CleanFormikField
        label={Label.FIRST_NAME}
        name={FieldName.FIRST_NAME}
        type="text"
      />
      <CleanFormikField
        label={Label.LAST_NAME}
        name={FieldName.LAST_NAME}
        type="text"
      />
    </SubFormPanel>
  );
};

export default UserPanel;
