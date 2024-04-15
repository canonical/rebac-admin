import { FormikField } from "@canonical/react-components";
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

const RolePanel = ({ close, error, roleId, onSubmit, isSaving }: Props) => {
  const [addEntitlements, setAddEntitlements] = useState<Entitlement[]>([]);
  const isEditing = !!roleId;
  return (
    <PanelForm<FormFields>
      close={close}
      entity="role"
      error={error}
      initialValues={{ id: "" }}
      isSaving={isSaving}
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
