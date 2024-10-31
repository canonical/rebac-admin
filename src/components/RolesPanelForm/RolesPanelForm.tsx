import { useState } from "react";

import type { Role } from "api/api.schemas";
import { useGetRoles } from "api/roles/roles";
import MultiSelectField from "components/MultiSelectField";
import PanelTableForm from "components/PanelTableForm";
import { CapabilityAction, useCheckCapability } from "hooks/capabilities";
import { Endpoint } from "types/api";

import { type Props } from "./types";

const COLUMN_DATA = [
  {
    Header: "Role name",
    accessor: "name",
  },
];

const RolesPanelForm = ({
  existingRoles,
  addRoles = [],
  setAddRoles,
  removeRoles = [],
  setRemoveRoles,
  showTable = true,
}: Props) => {
  const [filter, setFilter] = useState("");
  const { hasCapability: canGetRoles } = useCheckCapability(
    Endpoint.ROLES,
    CapabilityAction.READ,
  );
  const { data, isFetching, error } = useGetRoles(
    {
      filter: filter || undefined,
    },
    { query: { enabled: canGetRoles } },
  );
  const roles = data?.data.data || [];
  return (
    <PanelTableForm
      addEntities={addRoles}
      columns={COLUMN_DATA}
      entityName="role"
      error={error?.response?.data.message}
      existingEntities={existingRoles}
      form={
        canGetRoles && setAddRoles && setRemoveRoles ? (
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
        ) : null
      }
      generateCells={({ name }) => ({ name })}
      removeEntities={removeRoles}
      setAddEntities={setAddRoles}
      setRemoveEntities={setRemoveRoles}
      showTable={showTable}
    />
  );
};

export default RolesPanelForm;
