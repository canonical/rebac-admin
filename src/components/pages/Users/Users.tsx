import { Spinner, Button, ButtonAppearance } from "@canonical/react-components";
import { useState, type JSX } from "react";
import { Link } from "react-router-dom";

import type { Identity } from "api/api.schemas";
import { useGetIdentities } from "api/identities/identities";
import Content from "components/Content";
import EntityTable from "components/EntityTable";
import ErrorNotification from "components/ErrorNotification";
import { usePanel, useEntitiesSelect } from "hooks";
import { useDeleteModal } from "hooks/useDeleteModal";
import { Endpoint } from "types/api";
import urls from "urls";
import { getIds } from "utils/getIds";

import AddUserPanel from "./AddUserPanel";
import DeleteUsersModal from "./DeleteUsersModal";
import { Label } from "./types";

const COLUMN_DATA = [
  {
    Header: "first name",
    accessor: "firstName",
  },
  {
    Header: "last name",
    accessor: "lastName",
  },
  {
    Header: "added by",
    accessor: "addedBy",
  },
  {
    Header: "email",
    accessor: "email",
  },
  {
    Header: "source",
    accessor: "source",
  },
];

const Users = () => {
  const [filter, setFilter] = useState("");
  const { data, isFetching, isError, error, refetch } = useGetIdentities({
    filter: filter || undefined,
  });
  const { generatePanel, openPanel, isPanelOpen } = usePanel<{
    editIdentityId?: string | null;
  }>((closePanel, data, setPanelWidth) => {
    if (data?.editIdentityId) {
      // TODO: Edit user panel.
    } else {
      return <AddUserPanel close={closePanel} setPanelWidth={setPanelWidth} />;
    }
  });

  const { generateModal, openModal } = useDeleteModal<
    NonNullable<Identity["id"]>[]
  >((closeModal, identities) => (
    <DeleteUsersModal identities={identities} close={closeModal} />
  ));

  const selected = useEntitiesSelect(getIds(data?.data.data));

  const generateCreateUserButton = () => (
    <Button appearance={ButtonAppearance.DEFAULT} onClick={openPanel}>
      {Label.ADD}
    </Button>
  );

  const generateContent = (): JSX.Element => {
    if (isFetching) {
      return <Spinner text={Label.FETCHING_USERS} />;
    } else if (isError) {
      return (
        <ErrorNotification
          message={Label.FETCHING_USERS_ERROR}
          error={error?.message ?? ""}
          onRefetch={() => void refetch()}
        />
      );
    } else {
      return (
        <EntityTable<Identity>
          checkboxesDisabled={isPanelOpen}
          columns={COLUMN_DATA}
          entities={data?.data.data}
          emptyMsg={Label.NO_USERS}
          generateColumns={(user) => {
            const firstName = user.firstName || "Unknown";
            return {
              firstName: user.id ? (
                <Link to={`..${urls.users.user.index({ id: user.id })}`}>
                  {firstName}
                </Link>
              ) : (
                firstName
              ),
              lastName: user.lastName || "Unknown",
              addedBy: user.addedBy,
              email: user.email,
              source: user.source,
            };
          }}
          onDelete={(user) => user.id && openModal([user.id])}
          onEdit={(user) => openPanel({ editIdentityId: user.id })}
          selected={selected}
        />
      );
    }
  };

  return (
    <Content
      controls={
        <>
          <Button
            appearance={ButtonAppearance.NEGATIVE}
            disabled={!selected.selectedEntities.length}
            onClick={() => openModal(selected.selectedEntities)}
          >
            {Label.DELETE}
          </Button>
          {generateCreateUserButton()}
        </>
      }
      onSearch={setFilter}
      title="Users"
      endpoint={Endpoint.IDENTITIES}
    >
      {generateContent()}
      {generatePanel()}
      {generateModal()}
    </Content>
  );
};

export default Users;
