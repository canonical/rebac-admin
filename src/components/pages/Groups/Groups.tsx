import {
  ModularTable,
  Spinner,
  Button,
  ContextualMenu,
  Icon,
  ButtonAppearance,
  CheckboxInput,
} from "@canonical/react-components";
import type { ReactNode } from "react";
import { useMemo, type JSX } from "react";

import type { Group } from "api/api.schemas";
import { useGetGroups } from "api/groups/groups";
import Content from "components/Content";
import ErrorNotification from "components/ErrorNotification";
import NoEntityCard from "components/NoEntityCard";
import { useEntitiesSelect, usePanel } from "hooks";
import { Endpoint } from "types/api";

import AddGroupPanel from "./AddGroupPanel";
import DeleteGroupsPanel from "./DeleteGroupsPanel";
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
  const { data, isFetching, isError, error, refetch } = useGetGroups();
  const { generatePanel, openPanel, isPanelOpen } = usePanel<{
    editGroupId?: string | null;
    deleteGroups?: Group["name"][];
  }>((closePanel, data, setPanelWidth) => {
    if (data?.editGroupId) {
      return (
        <EditGroupPanel
          groupId={data.editGroupId}
          close={closePanel}
          setPanelWidth={setPanelWidth}
        />
      );
    } else if (data?.deleteGroups) {
      return (
        <DeleteGroupsPanel groups={data.deleteGroups} close={closePanel} />
      );
    } else {
      return <AddGroupPanel close={closePanel} setPanelWidth={setPanelWidth} />;
    }
  });

  const {
    handleSelectEntity: handleSelectGroup,
    handleSelectAllEntities: handleSelectAllGroups,
    selectedEntities: selectedGroups,
    areAllEntitiesSelected: areAllGroupsSelected,
  } = useEntitiesSelect(data?.data.data.map(({ name }) => name) ?? []);

  const tableData = useMemo<Record<string, ReactNode>[]>(() => {
    const groups = data?.data.data.map(({ name }) => name);
    if (!groups) {
      return [];
    }
    const tableData = groups.map((group) => ({
      selectGroup: (
        <CheckboxInput
          label=""
          inline
          checked={areAllGroupsSelected || selectedGroups.includes(group)}
          onChange={() => handleSelectGroup(group)}
          disabled={isPanelOpen}
        />
      ),
      groupName: group,
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
                openPanel({ editGroupId: group });
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
                openPanel({ deleteGroups: [group] });
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
            onClick={() => openPanel({ deleteGroups: selectedGroups })}
          >
            {Label.DELETE}
          </Button>
          {generateCreateGroupButton()}
        </>
      }
      title="Groups"
    >
      {generateContent()}
      {generatePanel()}
    </Content>
  );
};

export default Groups;
