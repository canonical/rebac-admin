import {
  ContextualMenu,
  Icon,
  ModularTable,
  Spinner,
  Button,
  ButtonAppearance,
  CheckboxInput,
} from "@canonical/react-components";
import type { JSX, ReactNode } from "react";
import { useMemo } from "react";

import type { Role } from "api/api.schemas";
import { useGetRoles } from "api/roles/roles";
import Content from "components/Content";
import ErrorNotification from "components/ErrorNotification";
import NoEntityCard from "components/NoEntityCard";
import { useEntitiesSelect, usePanel } from "hooks";
import { Endpoint } from "types/api";

import AddRolePanel from "./AddRolePanel";
import DeleteRolesPanel from "./DeleteRolesPanel";
import EditRolePanel from "./EditRolePanel";
import { Label } from "./types";

const COLUMN_DATA = [
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
  const { generatePanel, openPanel, isPanelOpen } = usePanel<{
    editRoleId?: string | null;
    deleteRoles?: Role["name"][];
  }>((closePanel, data, setPanelWidth) => {
    if (data?.editRoleId) {
      return (
        <EditRolePanel
          roleId={data.editRoleId}
          close={closePanel}
          setPanelWidth={setPanelWidth}
        />
      );
    } else if (data?.deleteRoles) {
      return <DeleteRolesPanel roles={data.deleteRoles} close={closePanel} />;
    } else {
      return <AddRolePanel close={closePanel} setPanelWidth={setPanelWidth} />;
    }
  });

  const {
    handleSelectEntity: handleSelectRole,
    handleSelectAllEntities: handleSelectAllRoles,
    selectedEntities: selectedRoles,
    areAllEntitiesSelected: areAllRolesSelected,
  } = useEntitiesSelect(data?.data.data.map(({ name }) => name) ?? []);

  const tableData = useMemo<Record<string, ReactNode>[]>(() => {
    const roles = data?.data.data.map(({ name }) => name);
    if (!roles) {
      return [];
    }
    const tableData = roles.map((role) => ({
      selectRole: (
        <CheckboxInput
          label=""
          inline
          checked={areAllRolesSelected || selectedRoles.includes(role)}
          onChange={() => handleSelectRole(role)}
          disabled={isPanelOpen}
        />
      ),
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
            {
              appearance: "link",
              children: (
                <>
                  <Icon name="delete" /> {Label.DELETE}
                </>
              ),
              onClick: () => {
                openPanel({ deleteRoles: [role] });
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
    areAllRolesSelected,
    data?.data.data,
    handleSelectRole,
    isPanelOpen,
    openPanel,
    selectedRoles,
  ]);

  const columns = [
    {
      Header: (
        <CheckboxInput
          label=""
          inline
          checked={areAllRolesSelected}
          indeterminate={!areAllRolesSelected && !!selectedRoles.length}
          onChange={handleSelectAllRoles}
          disabled={isPanelOpen}
        />
      ),
      accessor: "selectRole",
    },
    ...COLUMN_DATA,
  ];

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
            columns={columns}
            data={tableData}
            emptyMsg={Label.NO_ROLES}
            getCellProps={({ column }) => {
              switch (column.id) {
                case "selectRole":
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
                case "selectRole":
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
          {generatePanel()}
        </>
      );
    }
  };

  return (
    <Content
      controls={
        <>
          <Button
            appearance={ButtonAppearance.NEGATIVE}
            disabled={!selectedRoles.length}
            onClick={() => openPanel({ deleteRoles: selectedRoles })}
          >
            {Label.DELETE}
          </Button>
          {generateCreateRoleButton()}
        </>
      }
      endpoint={Endpoint.ROLES}
      title="Roles"
    >
      {generateContent()}
    </Content>
  );
};

export default Roles;
