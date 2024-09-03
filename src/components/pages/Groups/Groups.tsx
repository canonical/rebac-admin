import { Spinner, Button, ButtonAppearance } from "@canonical/react-components";
import type { JSX } from "react";
import { useState } from "react";

import type { Group } from "api/api.schemas";
import { useGetGroups } from "api/groups/groups";
import Content from "components/Content";
import EntityTable from "components/EntityTable";
import ErrorNotification from "components/ErrorNotification";
import NoEntityCard from "components/NoEntityCard";
import { useEntitiesSelect, usePanel } from "hooks";
import { useDeleteModal } from "hooks/useDeleteModal";
import { usePagination } from "hooks/usePagination";
import { Endpoint } from "types/api";
import { getIds } from "utils/getIds";

import AddGroupPanel from "./AddGroupPanel";
import DeleteGroupsModal from "./DeleteGroupsModal";
import EditGroupPanel from "./EditGroupPanel";
import { Label } from "./types";

const COLUMN_DATA = [
  {
    Header: Label.HEADER_NAME,
    accessor: "groupName",
  },
];

const Groups = () => {
  const [filter, setFilter] = useState("");
  const pagination = usePagination();
  const { data, isFetching, isError, error, refetch } = useGetGroups({
    filter: filter || undefined,
    ...pagination.pageData,
  });
  pagination.setResponse(data?.data);
  const { generatePanel, openPanel, isPanelOpen } = usePanel<{
    editGroup?: Group | null;
  }>((closePanel, data, setPanelWidth) => {
    if (data?.editGroup?.id) {
      return (
        <EditGroupPanel
          group={data.editGroup}
          groupId={data.editGroup.id}
          close={closePanel}
          setPanelWidth={setPanelWidth}
        />
      );
    } else {
      return <AddGroupPanel close={closePanel} setPanelWidth={setPanelWidth} />;
    }
  });

  const { generateModal, openModal } = useDeleteModal<
    NonNullable<Group["id"]>[]
  >((closeModal, groups) => (
    <DeleteGroupsModal groups={groups} close={closeModal} />
  ));

  const selected = useEntitiesSelect(getIds(data?.data.data));

  const generateCreateGroupButton = () => (
    <Button appearance={ButtonAppearance.POSITIVE} onClick={openPanel}>
      {Label.ADD}
    </Button>
  );

  const generateContent = (): JSX.Element => {
    if (isFetching) {
      return <Spinner text={Label.FETCHING_GROUPS} />;
    } else if (isError) {
      return (
        <ErrorNotification
          message={Label.FETCHING_GROUPS_ERROR}
          error={error?.message ?? ""}
          onRefetch={() => void refetch()}
        />
      );
    } else if (!data?.data.data.length) {
      return (
        <NoEntityCard
          title="No groups"
          message={Label.NO_GROUPS}
          actionButton={generateCreateGroupButton()}
        />
      );
    } else {
      return (
        <EntityTable<Group>
          checkboxesDisabled={isPanelOpen}
          columns={COLUMN_DATA}
          entities={data?.data.data}
          emptyMsg={Label.NO_GROUPS}
          generateColumns={(group) => ({
            groupName: group.name,
          })}
          onDelete={(group) => group.id && openModal([group.id])}
          onEdit={(group) => openPanel({ editGroup: group })}
          pagination={pagination}
          selected={selected}
        />
      );
    }
  };

  return (
    <Content
      endpoint={Endpoint.GROUPS}
      controls={
        <>
          <Button
            appearance={ButtonAppearance.NEGATIVE}
            disabled={!selected.selectedEntities.length}
            onClick={() => openModal(selected.selectedEntities)}
          >
            {Label.DELETE}
          </Button>
          {generateCreateGroupButton()}
        </>
      }
      onSearch={setFilter}
      title="Groups"
    >
      {generateContent()}
      {generatePanel()}
      {generateModal()}
    </Content>
  );
};

export default Groups;
