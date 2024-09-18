import { Spinner } from "@canonical/react-components";
import { useState } from "react";
import * as Yup from "yup";

import type { EntityEntitlement, Group, Role } from "api/api.schemas";
import EntitlementsPanelForm from "components/EntitlementsPanelForm";
import GroupsPanelForm from "components/GroupsPanelForm/GroupsPanelForm";
import RolesPanelForm from "components/RolesPanelForm";
import SubFormPanel from "components/SubFormPanel";

import Fields from "./Fields";
import { FieldName, type FormFields } from "./Fields/types";
import type { Props } from "./types";

const schema = Yup.object().shape({
  [FieldName.EMAIL]: Yup.string().required("Required"),
});

const UserPanel = ({
  existingGroups,
  existingRoles,
  existingEntitlements,
  isEditing,
  isFetchingExistingGroups,
  isFetchingExistingEntitlements,
  isFetchingUser,
  user,
  onSubmit,
  isSaving,
  ...props
}: Props) => {
  const [isDirty, setIsDirty] = useState(false);
  const [addGroups, setAddGroups] = useState<Group[]>([]);
  const [removeGroups, setRemoveGroups] = useState<Group[]>([]);
  const [addRoles, setAddRoles] = useState<Role[]>([]);
  const [removeRoles, setRemoveRoles] = useState<Role[]>([]);
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
        !!removeGroups.length ||
        !!removeRoles.length ||
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
          isDirty ? values : null,
          addGroups,
          addRoles,
          addEntitlements,
          removeGroups,
          removeRoles,
          removeEntitlements,
        )
      }
      subForms={[
        {
          count:
            (existingGroups?.length ?? 0) +
            addGroups.length -
            removeGroups.length,
          entity: "group",
          icon: "user-group",
          view: isFetchingExistingGroups ? (
            <Spinner />
          ) : (
            <GroupsPanelForm
              addGroups={addGroups}
              existingGroups={existingGroups}
              setAddGroups={setAddGroups}
              removeGroups={removeGroups}
              setRemoveGroups={setRemoveGroups}
            />
          ),
        },
        {
          count:
            (existingRoles?.length ?? 0) + addRoles.length - removeRoles.length,
          entity: "role",
          icon: "profile",
          view: (
            <RolesPanelForm
              addRoles={addRoles}
              existingRoles={existingRoles}
              setAddRoles={setAddRoles}
              removeRoles={removeRoles}
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
      <Fields setIsDirty={setIsDirty} />
    </SubFormPanel>
  );
};

export default UserPanel;
