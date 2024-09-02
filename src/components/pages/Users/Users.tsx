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
import { usePagination } from "hooks/usePagination";
import { Endpoint } from "types/api";
import urls from "urls";
import { getIds } from "utils/getIds";

import AddUserPanel from "./AddUserPanel";
import DeleteUsersModal from "./DeleteUsersModal";
import EditUserPanel from "./EditUserPanel";
import { Label } from "./types";

const COLUMN_DATA = [
  {
    Header: Label.HEADER_EMAIL,
    accessor: "email",
  },
  {
    Header: Label.HEADER_FULL_NAME,
    accessor: "name",
  },
  {
    Header: Label.HEADER_SOURCE,
    accessor: "source",
  },
  {
    Header: Label.HEADER_ADDED_BY,
    accessor: "addedBy",
  },
];

const Users = () => {
  const [filter, setFilter] = useState("");
  const pagination = usePagination();
  const { data, isFetching, isError, isRefetching, error, refetch } =
    useGetIdentities({
      filter: filter || undefined,
      ...pagination.pageData,
    });
  pagination.setResponse(data?.data);
  const { generatePanel, openPanel, isPanelOpen } = usePanel<{
    editUser?: Identity | null;
  }>((closePanel, data, setPanelWidth) => {
    if (data?.editUser && data.editUser?.id) {
      return (
        <EditUserPanel
          close={closePanel}
          user={data.editUser}
          userId={data.editUser.id}
          setPanelWidth={setPanelWidth}
        />
      );
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
    if (isFetching && !isRefetching) {
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
          generateColumns={(user) => ({
            addedBy: user.addedBy,
            email: user.id ? (
              <Link to={`..${urls.users.user.index({ id: user.id })}`}>
                {user.email}
              </Link>
            ) : (
              user.email
            ),
            name:
              [user.firstName, user.lastName].filter(Boolean).join(" ") ||
              "Unknown",
            source: user.source,
          })}
          onDelete={(user) => user.id && openModal([user.id])}
          onEdit={(user) => openPanel({ editUser: user })}
          pagination={pagination}
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
