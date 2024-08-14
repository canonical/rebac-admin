import {
  ModularTable,
  Spinner,
  Button,
  ContextualMenu,
  Icon,
  ButtonAppearance,
  CheckboxInput,
} from "@canonical/react-components";
import type { ReactNode, JSX } from "react";
import { useMemo, useState } from "react";

import type { Group, Identity } from "api/api.schemas";
import { useGetGroups } from "api/groups/groups";
import Content from "components/Content";
import ErrorNotification from "components/ErrorNotification";
import NoEntityCard from "components/NoEntityCard";
import { useEntitiesSelect, usePanel } from "hooks";
import { useDeleteModal } from "hooks/useDeleteModal";
import { Endpoint } from "types/api";
import { getIds } from "utils/getIds";

import AddGroupPanel from "./AddGroupPanel";
import DeleteGroupsModal from "./DeleteGroupsModal";
import EditGroupPanel from "./EditGroupPanel";
import { Label } from "./types";

const COLUMN_DATA = [
  {
    Header: "group name",
    accessor: "groupName",
  },
  {
    Header: "actions",
    accessor: "actions",
  },
];

const Groups = () => {
  const [filter, setFilter] = useState("");
  const { data, isFetching, isError, error, refetch } = useGetGroups({
    filter: filter || undefined,
  });
  const { generatePanel, openPanel, isPanelOpen } = usePanel<{
    editGroup?: Group | null;
  }>((closePanel, data, setPanelWidth) => {
    if (data?.editGroup && data?.editGroup.id) {
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
    NonNullable<Identity["id"]>[]
  >((closeModal, groups) => (
    <DeleteGroupsModal groups={groups} close={closeModal} />
  ));

  const {
    handleSelectEntity: handleSelectGroup,
    handleSelectAllEntities: handleSelectAllGroups,
    selectedEntities: selectedGroups,
    areAllEntitiesSelected: areAllGroupsSelected,
  } = useEntitiesSelect(getIds(data?.data.data));

  const tableData = useMemo<Record<string, ReactNode>[]>(() => {
    const groups = data?.data.data;
    if (!groups) {
      return [];
    }
    const tableData = groups.map((group) => ({
      selectGroup: (
        <CheckboxInput
          label=""
          inline
          checked={
            areAllGroupsSelected ||
            (!!group.id && selectedGroups.includes(group.id))
          }
          onChange={() => group.id && handleSelectGroup(group.id)}
          disabled={isPanelOpen}
        />
      ),
      groupName: group.name,
      actions: (
        <ContextualMenu
          links={[
            {
              appearance: "link",
              children: (
                <>
                  <Icon name="edit" /> {Label.EDIT}
                </>
              ),
              onClick: () => {
                openPanel({ editGroup: group });
              },
            },
            {
              appearance: "link",
              children: (
                <>
                  <Icon name="delete" /> {Label.DELETE}
                </>
              ),
              onClick: () => {
                group.id && openModal([group.id]);
              },
            },
          ]}
          position="right"
          scrollOverflow
          toggleAppearance="base"
          toggleClassName="has-icon u-no-margin--bottom is-small"
          toggleLabel={<Icon name="menu">{Label.ACTION_MENU}</Icon>}
        />
      ),
    }));
    return tableData;
  }, [
    areAllGroupsSelected,
    data?.data.data,
    handleSelectGroup,
    isPanelOpen,
    openModal,
    openPanel,
    selectedGroups,
  ]);

  const columns = [
    {
      Header: (
        <CheckboxInput
          label=""
          inline
          checked={areAllGroupsSelected}
          indeterminate={!areAllGroupsSelected && !!selectedGroups.length}
          onChange={handleSelectAllGroups}
          disabled={isPanelOpen}
        />
      ),
      accessor: "selectGroup",
    },
    ...COLUMN_DATA,
  ];

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
    } else if (!tableData.length) {
      return (
        <NoEntityCard
          title="No groups"
          message={Label.NO_GROUPS}
          actionButton={generateCreateGroupButton()}
        />
      );
    } else {
      return (
        <ModularTable
          columns={columns}
          data={tableData}
          emptyMsg={Label.NO_GROUPS}
          getCellProps={({ column }) => {
            switch (column.id) {
              case "selectGroup":
                return {
                  className: "select-entity-checkbox",
                };
              case "actions":
                return {
                  className: "u-align--right",
                };
              default:
                return {};
            }
          }}
          getHeaderProps={({ id }) => {
            switch (id) {
              case "selectGroup":
                return {
                  className: "select-entity-checkbox",
                };
              case "actions":
                return {
                  className: "u-align--right",
                };
              default:
                return {};
            }
          }}
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
            disabled={!selectedGroups.length}
            onClick={() => openModal(selectedGroups)}
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
