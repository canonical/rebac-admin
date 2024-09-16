import {
  Button,
  ButtonAppearance,
  Spinner,
  Tabs,
  Icon,
} from "@canonical/react-components";
import type { ReactNode } from "react";
import type { UIMatch } from "react-router-dom";
import {
  Link,
  Outlet,
  useMatches,
  useNavigate,
  useParams,
} from "react-router-dom";

import type { Identity } from "api/api.schemas";
import { useGetIdentitiesItem } from "api/identities/identities";
import BreadcrumbNavigation from "components/BreadcrumbNavigation";
import Content from "components/Content";
import ErrorNotification from "components/ErrorNotification";
import { usePanel } from "hooks";
import { Endpoint } from "types/api";
import urls from "urls";

import EditUserPanel from "../EditUserPanel";

import { Label } from "./types";

const stripSlashes = (url: string) => url.replace(/^\//, "").replace(/\/$/, "");

const isActive = (matches: UIMatch[], url: string) =>
  !!matches.find((match) =>
    stripSlashes(match.pathname).endsWith(stripSlashes(url)),
  );

const User = () => {
  const { id: userId } = useParams<{ id: string }>();
  const { data, isFetching, isError, error, refetch, queryKey } =
    useGetIdentitiesItem(userId ?? "");
  const navigate = useNavigate();
  const matches = useMatches();
  const user = data?.data;

  const { generatePanel, openPanel } = usePanel<{
    editUser?: Identity | null;
  }>((closePanel, data, setPanelWidth) => {
    if (data?.editUser?.id) {
      return (
        <EditUserPanel
          close={closePanel}
          user={data.editUser}
          userId={data.editUser.id}
          setPanelWidth={setPanelWidth}
          userQueryKey={queryKey}
        />
      );
    }
    return null;
  });

  const tabs = userId
    ? [
        {
          label: "Summary",
          to: urls.users.user.index({ id: userId }),
        },
        {
          label: "Groups",
          to: urls.users.user.groups({ id: userId }),
        },
        {
          label: "Roles",
          to: urls.users.user.roles({ id: userId }),
        },
        {
          label: "Entitlements",
          to: urls.users.user.entitlements({ id: userId }),
        },
        {
          label: "Account management",
          to: urls.users.user.accountManagement({ id: userId }),
        },
      ]
    : [];

  let content: ReactNode;
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
        <Button
          appearance={ButtonAppearance.DEFAULT}
          onClick={() => openPanel({ editUser: user })}
        >
          <Icon name="edit" /> {Label.EDIT}
        </Button>
      }
      title={
        <BreadcrumbNavigation
          backTitle="Users"
          onBack={() => navigate(`..${urls.users.index}`)}
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
      endpoint={Endpoint.IDENTITIES}
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
