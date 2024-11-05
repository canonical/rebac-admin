import { useState } from "react";

import type { Group } from "api/api.schemas";
import { useGetGroups } from "api/groups/groups";
import MultiSelectField from "components/MultiSelectField";
import PanelTableForm from "components/PanelTableForm";
import { CapabilityAction, useCheckCapability } from "hooks/capabilities";
import { Endpoint } from "types/api";

import { type Props } from "./types";

const COLUMN_DATA = [
  {
    Header: "Group name",
    accessor: "name",
  },
];

const GroupsPanelForm = ({
  existingGroups,
  addGroups = [],
  setAddGroups,
  removeGroups = [],
  setRemoveGroups,
  showTable = true,
}: Props) => {
  const [filter, setFilter] = useState("");
  const { hasCapability: canGetGroups } = useCheckCapability(
    Endpoint.GROUPS,
    CapabilityAction.READ,
  );
  const { data, isFetching, error } = useGetGroups(
    {
      filter: filter || undefined,
    },
    { query: { enabled: canGetGroups } },
  );
  const groups = data?.data.data || [];
  return (
    <PanelTableForm
      addEntities={addGroups}
      columns={COLUMN_DATA}
      entityName="group"
      error={error?.response?.data.message}
      existingEntities={existingGroups}
      form={
        canGetGroups && setAddGroups && setRemoveGroups ? (
          <fieldset>
            <h5>Add groups</h5>
            <MultiSelectField
              addEntities={addGroups}
              entities={groups}
              entityMatches={({ id }, { value }) => id === value}
              entityName="group"
              existingEntities={existingGroups}
              generateItem={({ id, name }: Group) => {
                if (id) {
                  return {
                    value: id,
                    label: name,
                  };
                }
              }}
              isLoading={isFetching}
              onSearch={setFilter}
              removeEntities={removeGroups}
              setAddEntities={setAddGroups}
              setRemoveEntities={setRemoveGroups}
            />
            <p className="p-form-help-text u-no-margin--bottom">
              Select groups in this multiselect dropdown. Selected groups will
              appear in the table below.
            </p>
          </fieldset>
        ) : null
      }
      generateCells={({ name }) => ({ name })}
      removeEntities={removeGroups}
      setAddEntities={setAddGroups}
      setRemoveEntities={setRemoveGroups}
      showTable={showTable}
    />
  );
};

export default GroupsPanelForm;
