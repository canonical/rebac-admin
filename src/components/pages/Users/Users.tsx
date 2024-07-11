import {
  ModularTable,
  Spinner,
  CheckboxInput,
  ContextualMenu,
  Icon,
  Button,
  ButtonAppearance,
} from "@canonical/react-components";
import type { ReactNode } from "react";
import { useMemo, type JSX } from "react";
import { Link } from "react-router-dom";

import type { Identity } from "api/api.schemas";
import { useGetIdentities } from "api/identities/identities";
import Content from "components/Content";
import ErrorNotification from "components/ErrorNotification";
import { usePanel, useEntitiesSelect } from "hooks";
import { Endpoint } from "types/api";
import urls from "urls";

import DeleteUsersPanel from "./DeleteUsersPanel";
import { Label } from "./types";

const COLUMN_DATA = [
  {
    Header: "first name",
    accessor: "firstName",
  },
  {
    Header: "last name",
    accessor: "lastName",
  },
  {
    Header: "added by",
    accessor: "addedBy",
  },
  {
    Header: "email",
    accessor: "email",
  },
  {
    Header: "source",
    accessor: "source",
  },
  {
    Header: "actions",
    accessor: "actions",
  },
];

const Users = () => {
  const { data, isFetching, isError, error, refetch } = useGetIdentities();
  const { generatePanel, openPanel, isPanelOpen } = usePanel<{
    editIdentityId?: string | null;
    deleteIdentities?: NonNullable<Identity["id"]>[];
  }>((closePanel, data) => {
    if (data?.editIdentityId) {
      // TODO: Edit user panel.
    } else if (data?.deleteIdentities) {
      return (
        <DeleteUsersPanel
          identities={data.deleteIdentities}
          close={closePanel}
        />
      );
    } else {
      // TODO: Add user panel.
    }
  });

  const {
    handleSelectEntity: handleSelectIdentity,
    handleSelectAllEntities: handleSelectAllIdentities,
    selectedEntities: selectedIdentities,
    areAllEntitiesSelected: areAllIdentitiesSelected,
  } = useEntitiesSelect(
    data?.data.data.reduce<NonNullable<Identity["id"]>[]>((ids, { id }) => {
      if (id) {
        ids.push(id);
      }
      return ids;
    }, []) ?? [],
  );

  const tableData = useMemo<Record<string, ReactNode>[]>(() => {
    const users = data?.data.data;
    if (!users) {
      return [];
    }
    const tableData = users.map((user) => {
      const firstName = user.firstName || "Unknown";
      return {
        selectIdentity: (
          <CheckboxInput
            label=""
            inline
            checked={
              areAllIdentitiesSelected ||
              (!!user.id && selectedIdentities.includes(user.id))
            }
            onChange={() => user.id && handleSelectIdentity(user.id)}
            disabled={isPanelOpen}
          />
        ),
        firstName: user.id ? (
          <Link to={`..${urls.users.user.index({ id: user.id })}`}>
            {firstName}
          </Link>
        ) : (
          firstName
        ),
        lastName: user.lastName || "Unknown",
        addedBy: user.addedBy,
        email: user.email,
        source: user.source,
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
                  openPanel({ editIdentityId: user.id });
                },
              },
              {
                appearance: "link",
                children: (
                  <>
                    <Icon name="delete" /> {Label.DELETE}
                  </>
                ),
                onClick: () =>
                  user.id && openPanel({ deleteIdentities: [user.id] }),
              },
            ]}
            position="right"
            scrollOverflow
            toggleAppearance="base"
            toggleClassName="has-icon u-no-margin--bottom is-small"
            toggleLabel={<Icon name="menu">{Label.ACTION_MENU}</Icon>}
          />
        ),
      };
    });
    return tableData;
  }, [
    areAllIdentitiesSelected,
    data?.data.data,
    handleSelectIdentity,
    isPanelOpen,
    openPanel,
    selectedIdentities,
  ]);

  const columns = [
    {
      Header: (
        <CheckboxInput
          label=""
          inline
          checked={areAllIdentitiesSelected}
          indeterminate={
            !areAllIdentitiesSelected && !!selectedIdentities.length
          }
          onChange={handleSelectAllIdentities}
          disabled={isPanelOpen}
        />
      ),
      accessor: "selectIdentity",
    },
    ...COLUMN_DATA,
  ];

  const generateContent = (): JSX.Element => {
    if (isFetching) {
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
        <ModularTable
          className="audit-logs-table"
          columns={columns}
          data={tableData}
          emptyMsg={Label.NO_USERS}
          getCellProps={({ column }) => {
            switch (column.id) {
              case "selectIdentity":
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
              case "selectIdentity":
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
      controls={
        <>
          <Button
            appearance={ButtonAppearance.NEGATIVE}
            disabled={!selectedIdentities.length}
            onClick={() => openPanel({ deleteIdentities: selectedIdentities })}
          >
            {Label.DELETE}
          </Button>
        </>
      }
      title="Users"
      endpoint={Endpoint.IDENTITIES}
    >
      {generateContent()}
      {generatePanel()}
    </Content>
  );
};

export default Users;
