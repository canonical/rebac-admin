import {
  Button,
  ButtonAppearance,
  Spinner,
  Tabs,
  Icon,
} from "@canonical/react-components";
import { useQueryClient } from "@tanstack/react-query";
import type { FC, ReactNode } from "react";
import type { UIMatch } from "react-router";
import { Link, Outlet, useMatches, useNavigate, useParams } from "react-router";

import type { Identity } from "api/api.schemas";
import { useGetIdentitiesItem } from "api/identities/identities";
import BreadcrumbNavigation from "components/BreadcrumbNavigation";
import Content from "components/Content";
import ErrorNotification from "components/ErrorNotification";
import { usePanel } from "hooks";
import { CapabilityAction, useCheckCapability } from "hooks/capabilities";
import { Endpoint } from "types/api";
import urls from "urls";

import EditUserPanel from "../EditUserPanel";

import { Label } from "./types";

const stripSlashes = (url: string): string =>
  url.replace(/^\//, "").replace(/\/$/, "");

const isActive = (matches: UIMatch[], url: string): boolean =>
  !!matches.find((match) =>
    stripSlashes(match.pathname).endsWith(stripSlashes(url)),
  );

const User: FC = () => {
  const queryClient = useQueryClient();
  const { hasCapability: canUpdateUser } = useCheckCapability(
    Endpoint.IDENTITY,
    CapabilityAction.UPDATE,
  );
  const { hasCapability: displayEntitlements } = useCheckCapability(
    Endpoint.IDENTITY_ENTITLEMENTS,
    [CapabilityAction.READ, CapabilityAction.RELATE],
    false,
  );
  const { hasCapability: displayRoles } = useCheckCapability(
    Endpoint.IDENTITY_ROLES,
    [CapabilityAction.READ, CapabilityAction.RELATE],
    false,
  );
  const { hasCapability: displayGroups } = useCheckCapability(
    Endpoint.IDENTITY_GROUPS,
    [CapabilityAction.READ, CapabilityAction.RELATE],
    false,
  );
  const { id: userId } = useParams<{ id: string }>();
  const { data, isFetching, isError, error, refetch, queryKey } =
    useGetIdentitiesItem(userId ?? "");
  const navigate = useNavigate();
  const matches = useMatches();
  const user = data?.data;

  const { generatePanel, openPanel } = usePanel<{
    editUser?: Identity | null;
  }>((closePanel, panelData, setPanelWidth) => {
    if (panelData?.editUser?.id) {
      return (
        <EditUserPanel
          close={closePanel}
          onUserUpdate={() => void queryClient.invalidateQueries({ queryKey })}
          user={panelData.editUser}
          userId={panelData.editUser.id}
          setPanelWidth={setPanelWidth}
        />
      );
    }
    return null;
  });

  const tabs = userId
    ? [
        {
          label: Label.TAB_SUMMARY,
          to: urls.users.user.index({ id: userId }),
        },
        ...(displayGroups
          ? [
              {
                label: Label.TAB_GROUPS,
                to: urls.users.user.groups({ id: userId }),
              },
            ]
          : []),
        ...(displayRoles
          ? [
              {
                label: Label.TAB_ROLES,
                to: urls.users.user.roles({ id: userId }),
              },
            ]
          : []),
        ...(displayEntitlements
          ? [
              {
                label: Label.TAB_ENTITLEMENTS,
                to: urls.users.user.entitlements({ id: userId }),
              },
            ]
          : []),
        {
          label: Label.TAB_ACCOUNT_MANAGEMENT,
          to: urls.users.user.accountManagement({ id: userId }),
        },
      ]
    : [];

  let content: ReactNode = null;
  if (isFetching) {
    content = <Spinner text={Label.FETCHING_USER} />;
  } else if (isError) {
    content = (
      <ErrorNotification
        message={Label.FETCHING_USER_ERROR}
        error={error?.message ?? ""}
        onRefetch={() => void refetch()}
      />
    );
  } else {
    content = <Outlet />;
  }

  return (
    <Content
      controls={
        canUpdateUser ? (
          <Button
            appearance={ButtonAppearance.DEFAULT}
            onClick={() => {
              openPanel({ editUser: user });
            }}
          >
            <Icon name="edit" /> {Label.EDIT}
          </Button>
        ) : null
      }
      title={
        <BreadcrumbNavigation
          backTitle="Users"
          onBack={() => void navigate(`..${urls.users.index}`)}
          title={
            <>
              {user?.email}{" "}
              {user?.firstName || user?.lastName ? (
                <span className="p-heading--5 u-text--muted u-no-padding">
                  ({[user?.firstName, user?.lastName].filter(Boolean).join(" ")}
                  )
                </span>
              ) : null}
            </>
          }
        />
      }
      endpoint={Endpoint.IDENTITY}
    >
      <Tabs
        links={tabs.map(({ label, to }) => ({
          active: isActive(matches, to),
          component: Link,
          label,
          to: `..${to}`,
        }))}
      />
      {content}
      {generatePanel()}
    </Content>
  );
};

export default User;
