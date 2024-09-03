import { Spinner } from "@canonical/react-components";
import { useState } from "react";
import * as Yup from "yup";

import type { EntityEntitlement, Group, Role } from "api/api.schemas";
import CleanFormikField from "components/CleanFormikField";
import EntitlementsPanelForm from "components/EntitlementsPanelForm";
import GroupsPanelForm from "components/GroupsPanelForm/GroupsPanelForm";
import RolesPanelForm from "components/RolesPanelForm";
import SubFormPanel from "components/SubFormPanel";

import { FieldName, Label } from "./types";
import type { FormFields, Props } from "./types";

const schema = Yup.object().shape({
  [FieldName.EMAIL]: Yup.string().required("Required"),
});

const UserPanel = ({
  existingEntitlements,
  isEditing,
  isFetchingExistingEntitlements,
  isFetchingUser,
  user,
  onSubmit,
  isSaving,
  ...props
}: Props) => {
  const [addGroups, setAddGroups] = useState<Group[]>([]);
  const [addRoles, setAddRoles] = useState<Role[]>([]);
  const [addEntitlements, setAddEntitlements] = useState<EntityEntitlement[]>(
    [],
  );
  const [removeEntitlements, setRemoveEntitlements] = useState<
    EntityEntitlement[]
  >([]);
  return (
    <SubFormPanel<FormFields>
      {...props}
      submitEnabled={
        !!addGroups.length ||
        !!addRoles.length ||
        !!addEntitlements.length ||
        !!removeEntitlements.length
      }
      entity="local user"
      initialValues={{
        [FieldName.EMAIL]: user?.email ?? "",
        [FieldName.FIRST_NAME]: user?.firstName ?? "",
        [FieldName.LAST_NAME]: user?.lastName ?? "",
      }}
      isEditing={isEditing}
      isFetching={isFetchingUser}
      onSubmit={async (values) =>
        await onSubmit(
          values,
          addGroups,
          addRoles,
          addEntitlements,
          removeEntitlements,
        )
      }
      subForms={[
        {
          count: addGroups.length,
          entity: "group",
          icon: "user-group",
          view: (
            <GroupsPanelForm
              addGroups={addGroups}
              setAddGroups={setAddGroups}
              removeGroups={[]}
              setRemoveGroups={(_groups: Group[]) => {}}
            />
          ),
        },
        {
          count: addRoles.length,
          entity: "role",
          icon: "profile",
          view: (
            <RolesPanelForm
              addRoles={addRoles}
              setAddRoles={setAddRoles}
              removeRoles={[]}
              setRemoveRoles={(_roles: Role[]) => {}}
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
