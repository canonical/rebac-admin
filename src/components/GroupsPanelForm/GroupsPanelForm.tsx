import { useState } from "react";

import type { Group } from "api/api.schemas";
import { useGetGroups } from "api/groups/groups";
import MultiSelectField from "components/MultiSelectField";
import PanelTableForm from "components/PanelTableForm";

import { type Props } from "./types";

const COLUMN_DATA = [
  {
    Header: "Group name",
    accessor: "name",
  },
];

const groupEqual = (groupA: Group, groupB: Group) =>
  !Object.keys(groupA).some((key) => {
    const groupKey = key as keyof Group;
    return groupA[groupKey] !== groupB[groupKey];
  });

const groupMatches = (group: Group, search: string) =>
  Object.values(group).some((value) => value.includes(search));

const GroupsPanelForm = ({
  existingGroups,
  addGroups = [],
  setAddGroups,
  removeGroups = [],
  setRemoveGroups,
}: Props) => {
  const [filter, setFilter] = useState("");
  const { data, isFetching, error } = useGetGroups({
    filter: filter || undefined,
  });
  const groups = data?.data.data || [];
  return (
    <PanelTableForm
      addEntities={addGroups}
      columns={COLUMN_DATA}
      entityEqual={groupEqual}
      entityMatches={groupMatches}
      entityName="group"
      error={error?.response?.data.message}
      existingEntities={existingGroups}
      form={
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
      }
      generateCells={({ name }) => ({ name })}
      removeEntities={removeGroups}
      setAddEntities={setAddGroups}
      setRemoveEntities={setRemoveGroups}
    />
  );
};

export default GroupsPanelForm;
