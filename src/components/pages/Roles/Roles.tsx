import { Spinner, Button, ButtonAppearance } from "@canonical/react-components";
import type { JSX } from "react";
import { useState } from "react";

import type { Role } from "api/api.schemas";
import { useGetRoles } from "api/roles/roles";
import Content from "components/Content";
import EntityTable from "components/EntityTable";
import ErrorNotification from "components/ErrorNotification";
import NoEntityCard from "components/NoEntityCard";
import { useEntitiesSelect, usePanel } from "hooks";
import { useDeleteModal } from "hooks/useDeleteModal";
import { usePagination } from "hooks/usePagination";
import { Endpoint } from "types/api";
import { getIds } from "utils/getIds";

import AddRolePanel from "./AddRolePanel";
import DeleteRolesModal from "./DeleteRolesModal";
import EditRolePanel from "./EditRolePanel";
import { Label } from "./types";

const COLUMN_DATA = [
  {
    Header: Label.HEADER_NAME,
    accessor: "roleName",
  },
];

const Roles = () => {
  const [filter, setFilter] = useState("");
  const pagination = usePagination();
  const { data, isFetching, isError, error, refetch } = useGetRoles({
    filter: filter || undefined,
    ...pagination.pageData,
  });
  pagination.setResponse(data?.data);
  const { generatePanel, openPanel, isPanelOpen } = usePanel<{
    editRole?: Role | null;
  }>((closePanel, data, setPanelWidth) => {
    if (data?.editRole && data.editRole.id) {
      return (
        <EditRolePanel
          role={data.editRole}
          roleId={data.editRole.id}
          close={closePanel}
          setPanelWidth={setPanelWidth}
        />
      );
    } else {
      return <AddRolePanel close={closePanel} setPanelWidth={setPanelWidth} />;
    }
  });

  const { generateModal, openModal } = useDeleteModal<
    NonNullable<Role["id"]>[]
  >((closeModal, roles) => (
    <DeleteRolesModal roles={roles} close={closeModal} />
  ));

  const selected = useEntitiesSelect(getIds(data?.data.data));

  const generateCreateRoleButton = () => (
    <Button appearance={ButtonAppearance.POSITIVE} onClick={openPanel}>
      {Label.ADD}
    </Button>
  );

  const generateContent = (): JSX.Element => {
    if (isFetching) {
      return <Spinner text={Label.FETCHING_ROLES} />;
    } else if (isError) {
      return (
        <ErrorNotification
          message={Label.FETCHING_ROLES_ERROR}
          error={error?.message ?? ""}
          onRefetch={() => void refetch()}
        />
      );
    } else if (!data?.data.data.length) {
      return (
        <NoEntityCard
          title="No roles"
          message={Label.NO_ROLES}
          actionButton={generateCreateRoleButton()}
        />
      );
    } else {
      return (
        <EntityTable<Role>
          checkboxesDisabled={isPanelOpen}
          columns={COLUMN_DATA}
          entities={data?.data.data}
          emptyMsg={Label.NO_ROLES}
          generateColumns={(role) => ({
            roleName: role.name,
          })}
          onDelete={(role) => role.id && openModal([role.id])}
          onEdit={(role) => openPanel({ editRole: role })}
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
          {generateCreateRoleButton()}
        </>
      }
      endpoint={Endpoint.ROLES}
      onSearch={setFilter}
      title="Roles"
    >
      {generateContent()}
      {generatePanel()}
      {generateModal()}
    </Content>
  );
};

export default Roles;
