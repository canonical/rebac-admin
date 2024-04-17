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

const GroupPanel = ({
  close,
  error,
  existingEntitlements,
  isFetchingExisting,
  groupId,
  onSubmit,
  isSaving,
}: Props) => {
  const [addEntitlements, setAddEntitlements] = useState<Entitlement[]>([]);
  const [removeEntitlements] = useState<Entitlement[]>([]);
  const isEditing = !!groupId;
  return (
    <PanelForm<FormFields>
      submitEnabled={!!addEntitlements.length || !!removeEntitlements.length}
      close={close}
      entity="group"
      error={error}
      initialValues={{ id: groupId ?? "" }}
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

export default GroupPanel;
