import { useState } from "react";

import type { Identity } from "api/api.schemas";
import { useGetIdentities } from "api/identities/identities";
import MultiSelectField from "components/MultiSelectField";
import PanelTableForm from "components/PanelTableForm";

import { type Props } from "./types";

const COLUMN_DATA = [
  {
    Header: "Email",
    accessor: "email",
  },
];

const identityEqual = (identityA: Identity, identityB: Identity) =>
  !Object.keys(identityA).some((key) => {
    const identityKey = key as keyof Identity;
    return identityA[identityKey] !== identityB[identityKey];
  });

const identityMatches = (identity: Identity, search: string) =>
  Object.values(identity).some((value) => value.includes(search));

const IdentitiesPanelForm = ({
  existingIdentities,
  addIdentities,
  setAddIdentities,
  removeIdentities,
  setRemoveIdentities,
}: Props) => {
  const [filter, setFilter] = useState("");
  const { data, error, isFetching } = useGetIdentities({
    filter: filter || undefined,
  });
  const users = data?.data.data ?? [];
  return (
    <PanelTableForm
      addEntities={addIdentities}
      columns={COLUMN_DATA}
      entityEqual={identityEqual}
      entityMatches={identityMatches}
      entityName="user"
      error={error?.response?.data.message}
      existingEntities={existingIdentities}
      form={
        <>
          <h5>Add users</h5>
          <MultiSelectField
            addEntities={addIdentities}
            entities={users}
            entityMatches={({ id }, { value }) => id === value}
            entityName="user"
            existingEntities={existingIdentities}
            generateItem={({ id, email }: Identity) => {
              if (id) {
                return {
                  value: id,
                  label: email,
                };
              }
            }}
            isLoading={isFetching}
            onSearch={setFilter}
            removeEntities={removeIdentities}
            setAddEntities={setAddIdentities}
            setRemoveEntities={setRemoveIdentities}
          />
        </>
      }
      generateCells={({ email }) => ({ email })}
      removeEntities={removeIdentities}
      setAddEntities={setAddIdentities}
      setRemoveEntities={setRemoveIdentities}
    />
  );
};

export default IdentitiesPanelForm;
