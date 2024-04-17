import {
  ContextualMenu,
  Icon,
  ModularTable,
  Spinner,
  Button,
} from "@canonical/react-components";
import { useMemo, useState, type JSX } from "react";
import type { Column } from "react-table";

import { useGetRoles } from "api/roles/roles";
import Content from "components/Content";
import ErrorNotification from "components/ErrorNotification";
import { PanelFormNavigationTitleId } from "components/PanelForm/PanelFormNavigation/consts";
import { usePanelPortal } from "hooks/usePanelPortal";

import AddRolePanel from "./AddRolePanel";
import EditRolePanel from "./EditRolePanel";
import { Label } from "./types";

const COLUMN_DATA: Column[] = [
  {
    Header: "role name",
    accessor: "roleName",
  },
  {
    Header: "actions",
    accessor: "actions",
  },
];

const Roles = () => {
  const { data, isFetching, isError, error, refetch } = useGetRoles();
  const [editRoleId, setEditRoleId] = useState<string | null>(null);
  const { openPortal, closePortal, isOpen, Portal } = usePanelPortal(
    "is-medium",
    PanelFormNavigationTitleId,
  );

  const tableData = useMemo(() => {
    const roles = data?.data.data;
    if (!roles) {
      return [];
    }
    const tableData = roles.map((role) => ({
      roleName: role,
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
              onClick: (event) => {
                setEditRoleId(role);
                openPortal(event);
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
  }, [data?.data.data, openPortal]);

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
    } else {
      return (
        <>
          <ModularTable
            columns={COLUMN_DATA}
            data={tableData}
            emptyMsg={Label.NO_ROLES}
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
          {isOpen ? (
            <Portal>
              {editRoleId ? (
                <EditRolePanel
                  roleId={editRoleId}
                  close={() => {
                    setEditRoleId(null);
                    closePortal();
                  }}
                />
              ) : (
                <AddRolePanel close={closePortal} />
              )}
            </Portal>
          ) : null}
        </>
      );
    }
  };

  return (
    <Content
      controls={
        <Button appearance="positive" onClick={openPortal}>
          Create role
        </Button>
      }
      title="Roles"
    >
      {generateContent()}
    </Content>
  );
};

export default Roles;
