import { Spinner, Button, ButtonAppearance } from "@canonical/react-components";
import { useQueryClient } from "@tanstack/react-query";
import type { FC } from "react";
import { useState } from "react";
import { Link } from "react-router";

import type { Identity } from "api/api.schemas";
import { useGetIdentities } from "api/identities/identities";
import Content from "components/Content";
import EntityTable from "components/EntityTable";
import ErrorNotification from "components/ErrorNotification";
import { usePanel, useEntitiesSelect } from "hooks";
import { CapabilityAction, useCheckCapability } from "hooks/capabilities";
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

const Users: FC = () => {
  const queryClient = useQueryClient();
  const [filter, setFilter] = useState("");
  const pagination = usePagination();
  const { data, isFetching, isError, isRefetching, error, refetch, queryKey } =
    useGetIdentities({
      filter: filter || undefined,
      ...pagination.pageData,
    });
  pagination.setResponse(data?.data);
  const { generatePanel, openPanel, isPanelOpen } = usePanel<{
    editUser?: Identity | null;
  }>((closePanel, paneData, setPanelWidth) => {
    if (paneData?.editUser?.id) {
      return (
        <EditUserPanel
          close={closePanel}
          onUserUpdate={() => void queryClient.invalidateQueries({ queryKey })}
          user={paneData.editUser}
          userId={paneData.editUser.id}
          setPanelWidth={setPanelWidth}
        />
      );
    } else {
      return <AddUserPanel close={closePanel} setPanelWidth={setPanelWidth} />;
    }
  });
  const { hasCapability: canCreateUser } = useCheckCapability(
    Endpoint.IDENTITIES,
    CapabilityAction.CREATE,
  );
  const { hasCapability: canDeleteUser } = useCheckCapability(
    Endpoint.IDENTITY,
    CapabilityAction.DELETE,
  );
  const { hasCapability: canGetUser } = useCheckCapability(
    Endpoint.IDENTITY,
    CapabilityAction.READ,
  );
  const { hasCapability: canUpdateUser } = useCheckCapability(
    Endpoint.IDENTITY,
    CapabilityAction.UPDATE,
  );
  const { generateModal, openModal } = useDeleteModal<
    NonNullable<Identity["id"]>[]
  >((closeModal, identities) => (
    <DeleteUsersModal identities={identities} close={closeModal} />
  ));

  const selected = useEntitiesSelect(getIds(data?.data.data));

  const createUserButton = canCreateUser ? (
    <Button appearance={ButtonAppearance.DEFAULT} onClick={openPanel}>
      {Label.ADD}
    </Button>
  ) : null;

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
          checkboxesDisabled={isPanelOpen || !canDeleteUser}
          columns={COLUMN_DATA}
          entities={data?.data.data}
          emptyMsg={Label.NO_USERS}
          generateColumns={(user) => ({
            addedBy: user.addedBy,
            email:
              user.id && canGetUser ? (
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
          onDelete={
            canDeleteUser
              ? (user): void => {
                  if (user.id) {
                    openModal([user.id]);
                  }
                }
              : null
          }
          onEdit={
            canUpdateUser ? (user): void => openPanel({ editUser: user }) : null
          }
          pagination={pagination}
          selected={selected}
        />
      );
    }
  };

  return (
    <Content
      controls={
        canDeleteUser ? (
          <>
            <Button
              appearance={ButtonAppearance.NEGATIVE}
              disabled={!selected.selectedEntities.length}
              onClick={() => openModal(selected.selectedEntities)}
            >
              {Label.DELETE}
            </Button>
            {createUserButton}
          </>
        ) : null
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
