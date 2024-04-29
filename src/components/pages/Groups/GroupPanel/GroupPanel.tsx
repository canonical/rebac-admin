import { FormikField, Spinner } from "@canonical/react-components";
import { useState } from "react";
import * as Yup from "yup";

import type { Entitlement } from "components/EntitlementsPanelForm";
import EntitlementsPanelForm from "components/EntitlementsPanelForm";
import SubFormPanel from "components/SubFormPanel";

import IdentitiesPanelForm from "../IdentitiesPanelForm";
import RolesPanelForm from "../RolesPanelForm";

import type { FormFields } from "./types";
import { Label, type Props } from "./types";

const schema = Yup.object().shape({
  id: Yup.string().required("Required"),
});

const GroupPanel = ({
  existingEntitlements,
  existingIdentities,
  isFetchingExistingEntitlements,
  isFetchingExistingIdentities,
  isFetchingExistingRoles,
  existingRoles,
  groupId,
  onSubmit,
  isSaving,
  ...props
}: Props) => {
  const [addEntitlements, setAddEntitlements] = useState<Entitlement[]>([]);
  const [removeEntitlements, setRemoveEntitlements] = useState<Entitlement[]>(
    [],
  );
  const [addIdentities, setAddIdentities] = useState<string[]>([]);
  const [removeIdentities, setRemoveIdentities] = useState<string[]>([]);
  const [addRoles, setAddRoles] = useState<string[]>([]);
  const [removeRoles, setRemoveRoles] = useState<string[]>([]);
  const isEditing = !!groupId;
  return (
    <SubFormPanel<FormFields>
      {...props}
      submitEnabled={
        !!addEntitlements.length ||
        !!removeEntitlements.length ||
        !!addIdentities.length ||
        !!removeIdentities.length ||
        !!addRoles.length ||
        !!removeRoles.length
      }
      entity="group"
      initialValues={{ id: groupId ?? "" }}
      isEditing={isEditing}
      isSaving={isSaving}
      onSubmit={async (values) =>
        await onSubmit(
          values,
          addEntitlements,
          addIdentities,
          addRoles,
          removeEntitlements,
          removeIdentities,
          removeRoles,
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
            (existingRoles?.length ?? 0) + addRoles.length - removeRoles.length,
          entity: "role",
          icon: "profile",
          view: isFetchingExistingRoles ? (
            <Spinner />
          ) : (
            <RolesPanelForm
              addRoles={addRoles}
              existingRoles={existingRoles}
              removeRoles={removeRoles}
              setAddRoles={setAddRoles}
              setRemoveRoles={setRemoveRoles}
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
    </SubFormPanel>
  );
};

export default GroupPanel;
