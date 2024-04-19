import {
  ContextualMenu,
  Icon,
  ModularTable,
  Spinner,
  Button,
  ButtonAppearance,
} from "@canonical/react-components";
import { useMemo, type JSX } from "react";
import type { Column } from "react-table";

import { useGetRoles } from "api/roles/roles";
import Content from "components/Content";
import ErrorNotification from "components/ErrorNotification";
import NoEntityCard from "components/NoEntityCard";
import { usePanel } from "hooks/usePanel";

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
  const { generatePanel, openPanel } = usePanel<{
    editRoleId?: string | null;
  }>((closePanel, data) =>
    data?.editRoleId ? (
      <EditRolePanel roleId={data.editRoleId} close={closePanel} />
    ) : (
      <AddRolePanel close={closePanel} />
    ),
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
              onClick: () => {
                openPanel({ editRoleId: role });
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

  const generateCreateRoleButton = () => (
    <Button appearance={ButtonAppearance.POSITIVE} onClick={openPanel}>
      Create role
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
    } else if (!tableData.length) {
      return (
        <NoEntityCard
          title="No roles"
          message={Label.NO_ROLES}
          actionButton={generateCreateRoleButton()}
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
          {generatePanel()}
        </>
      );
    }
  };

  return (
    <Content controls={generateCreateRoleButton()} title="Roles">
      {generateContent()}
    </Content>
  );
};

export default Roles;
