import { useState } from "react";

import type { Role } from "api/api.schemas";
import { useGetRoles } from "api/roles/roles";
import MultiSelectField from "components/MultiSelectField";
import PanelTableForm from "components/PanelTableForm";

import { type Props } from "./types";

const COLUMN_DATA = [
  {
    Header: "Role name",
    accessor: "name",
  },
];

const roleEqual = (roleA: Role, roleB: Role) =>
  !Object.keys(roleA).some((key) => {
    const roleKey = key as keyof Role;
    return roleA[roleKey] !== roleB[roleKey];
  });

const roleMatches = (role: Role, search: string) =>
  Object.values(role).some((value) => value.includes(search));

const RolesPanelForm = ({
  existingRoles,
  addRoles = [],
  setAddRoles,
  removeRoles = [],
  setRemoveRoles,
}: Props) => {
  const [filter, setFilter] = useState("");
  const { data, isFetching, error } = useGetRoles({
    filter: filter || undefined,
  });
  const roles = data?.data.data || [];
  return (
    <PanelTableForm
      addEntities={addRoles}
      columns={COLUMN_DATA}
      entityEqual={roleEqual}
      entityMatches={roleMatches}
      entityName="role"
      error={error?.response?.data.message}
      existingEntities={existingRoles}
      form={
        <fieldset>
          <h5>Add roles</h5>
          <MultiSelectField
            addEntities={addRoles}
            entities={roles}
            entityMatches={({ id }, { value }) => id === value}
            entityName="role"
            existingEntities={existingRoles}
            generateItem={({ id, name }: Role) => {
              if (id) {
                return {
                  value: id,
                  label: name,
                };
              }
            }}
            isLoading={isFetching}
            onSearch={setFilter}
            removeEntities={removeRoles}
            setAddEntities={setAddRoles}
            setRemoveEntities={setRemoveRoles}
          />
          <p className="p-form-help-text u-no-margin--bottom">
            Select roles in this multiselect dropdown. Selected roles will
            appear in the table below.
          </p>
        </fieldset>
      }
      generateCells={({ name }) => ({ name })}
      removeEntities={removeRoles}
      setAddEntities={setAddRoles}
      setRemoveEntities={setRemoveRoles}
    />
  );
};

export default RolesPanelForm;
