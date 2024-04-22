import { FormikField, Spinner } from "@canonical/react-components";
import { useState } from "react";
import * as Yup from "yup";

import type { Entitlement } from "components/EntitlementsPanelForm";
import EntitlementsPanelForm from "components/EntitlementsPanelForm";
import PanelForm from "components/PanelForm";

import IdentitiesPanelForm from "../IdentitiesPanelForm";

import type { FormFields } from "./types";
import { Label, type Props } from "./types";

const schema = Yup.object().shape({
  id: Yup.string().required("Required"),
});

const GroupPanel = ({
  close,
  error,
  existingEntitlements,
  existingIdentities,
  isFetchingExistingEntitlements,
  isFetchingExistingIdentities,
  groupId,
  onSubmit,
  isSaving,
}: Props) => {
  const [addEntitlements, setAddEntitlements] = useState<Entitlement[]>([]);
  const [removeEntitlements, setRemoveEntitlements] = useState<Entitlement[]>(
    [],
  );
  const [addIdentities, setAddIdentities] = useState<string[]>([]);
  const [removeIdentities, setRemoveIdentities] = useState<string[]>([]);
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
        await onSubmit(
          values,
          addEntitlements,
          addIdentities,
          removeEntitlements,
          removeIdentities,
        )
      }
      subForms={[
        {
          count:
            (existingIdentities?.length ?? 0) +
            addIdentities.length -
            removeIdentities.length,
          entity: "user",
          icon: "user",
          view: isFetchingExistingIdentities ? (
            <Spinner />
          ) : (
            <IdentitiesPanelForm
              addIdentities={addIdentities}
              existingIdentities={existingIdentities}
              removeIdentities={removeIdentities}
              setAddIdentities={setAddIdentities}
              setRemoveIdentities={setRemoveIdentities}
            />
          ),
        },
        {
          count:
            (existingEntitlements?.length ?? 0) +
            addEntitlements.length -
            removeEntitlements.length,
          entity: "entitlement",
          icon: "lock-locked",
          view: isFetchingExistingEntitlements ? (
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

export default GroupPanel;
