import { Spinner } from "@canonical/react-components";
import type { FC } from "react";
import { useState } from "react";
import * as Yup from "yup";

import type { EntityEntitlement, Identity, Role } from "api/api.schemas";
import EntitlementsPanelForm from "components/EntitlementsPanelForm";
import RolesPanelForm from "components/RolesPanelForm";
import type { SubForm } from "components/SubFormPanel";
import SubFormPanel from "components/SubFormPanel";
import { CapabilityAction, useCheckCapability } from "hooks/capabilities";
import { Endpoint } from "types/api";

import IdentitiesPanelForm from "../IdentitiesPanelForm";

import type { FormFields } from "./Fields";
import Fields, { FieldName } from "./Fields";
import type { Props } from "./types";

const schema = Yup.object().shape({
  [FieldName.NAME]: Yup.string().required("Required"),
});

const GroupPanel: FC<Props> = ({
  existingEntitlements,
  existingIdentities,
  isEditing,
  isFetchingExistingEntitlements,
  isFetchingExistingIdentities,
  isFetchingExistingRoles,
  isFetchingGroup,
  existingRoles,
  group,
  onSubmit,
  isSaving,
  ...props
}: Props) => {
  const [isDirty, setIsDirty] = useState(false);
  const [addEntitlements, setAddEntitlements] = useState<EntityEntitlement[]>(
    [],
  );
  const [removeEntitlements, setRemoveEntitlements] = useState<
    EntityEntitlement[]
  >([]);
  const [addIdentities, setAddIdentities] = useState<Identity[]>([]);
  const [removeIdentities, setRemoveIdentities] = useState<Identity[]>([]);
  const [addRoles, setAddRoles] = useState<Role[]>([]);
  const [removeRoles, setRemoveRoles] = useState<Role[]>([]);
  const {
    hasCapability: canRelateUsers,
    isFetching: isFetchingUserCapability,
  } = useCheckCapability(Endpoint.GROUP_IDENTITIES, CapabilityAction.RELATE);
  const {
    hasCapability: canRelateRoles,
    isFetching: isFetchingRoleCapability,
  } = useCheckCapability(Endpoint.GROUP_ROLES, CapabilityAction.RELATE);
  const {
    hasCapability: canRelateEntitlements,
    isFetching: isFetchingEntitlementCapability,
  } = useCheckCapability(Endpoint.GROUP_ENTITLEMENTS, CapabilityAction.RELATE);
  const subForms: SubForm[] = [];
  if (canRelateUsers) {
    subForms.push({
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
    });
  }
  if (canRelateRoles) {
    subForms.push({
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
    });
  }
  if (canRelateEntitlements) {
    subForms.push({
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
    });
  }

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
      initialValues={{
        name: group?.name ?? "",
      }}
      isEditing={isEditing}
      isFetching={
        isFetchingGroup ||
        isFetchingUserCapability ||
        isFetchingRoleCapability ||
        isFetchingEntitlementCapability
      }
      isSaving={isSaving}
      onSubmit={async (values) => {
        await onSubmit(
          values,
          isDirty,
          addEntitlements,
          addIdentities,
          addRoles,
          removeEntitlements,
          removeIdentities,
          removeRoles,
        );
      }}
      subForms={subForms}
      validationSchema={schema}
    >
      <Fields setIsDirty={setIsDirty} />
    </SubFormPanel>
  );
};

export default GroupPanel;
