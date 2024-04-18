import {
  ModularTable,
  Spinner,
  Button,
  ContextualMenu,
  Icon,
  ButtonAppearance,
} from "@canonical/react-components";
import { useMemo, type JSX } from "react";
import type { Column } from "react-table";

import { useGetGroups } from "api/groups/groups";
import Content from "components/Content";
import ErrorNotification from "components/ErrorNotification";
import NoEntityCard from "components/NoEntityCard";
import { usePanel } from "hooks/usePanel";

import AddGroupPanel from "./AddGroupPanel";
import EditGroupPanel from "./EditGroupPanel";
import { Label } from "./types";

const COLUMN_DATA: Column[] = [
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
  const { generatePanel, openPanel } = usePanel<{
    editGroupId?: string | null;
  }>((closePanel, data) =>
    data?.editGroupId ? (
      <EditGroupPanel groupId={data.editGroupId} close={closePanel} />
    ) : (
      <AddGroupPanel close={closePanel} />
    ),
  );

  const tableData = useMemo(() => {
    const groups = data?.data.data;
    if (!groups) {
      return [];
    }
    const tableData = groups.map((group) => ({
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
  }, [data?.data.data, openPanel]);

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
          actionButton={
            // TODO: Add functionality to display the panel when clicked.
            <Button appearance={ButtonAppearance.POSITIVE}>Create group</Button>
          }
        />
      );
    } else {
      return (
        <>
          <ModularTable
            columns={COLUMN_DATA}
            data={tableData}
            emptyMsg={Label.NO_GROUPS}
            getCellProps={({ column }) => {
              switch (column.id) {
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
                case "actions":
                  return {
                    className: "u-align--right",
                  };
                default:
                  return {};
              }
            }}
          />
          {generatePanel()}
        </>
      );
    }
  };

  return (
    <Content
      controls={
        <Button appearance="positive" onClick={() => openPanel()}>
          Create group
        </Button>
      }
      title="Groups"
    >
      {generateContent()}
    </Content>
  );
};

export default Groups;
