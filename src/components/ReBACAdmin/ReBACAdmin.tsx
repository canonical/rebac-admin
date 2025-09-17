import { Panel } from "@canonical/react-components";
import {
  QueryClient,
  QueryClientContext,
  QueryClientProvider,
} from "@tanstack/react-query";
import type { AxiosInstance } from "axios";
import type { LogLevelDesc } from "loglevel";
import type { FC } from "react";
import { useContext, useEffect } from "react";
import { Toaster } from "react-hot-toast";
import { Route, Routes } from "react-router";

import { createInstance, setInstance } from "api-utils/mutator/custom-instance";
import Entitlements from "components/pages/Entitlements";
import Groups from "components/pages/Groups";
import Resources from "components/pages/Resources";
import Roles from "components/pages/Roles";
import Users from "components/pages/Users";
import AccountManagementTab from "components/pages/Users/AccountManagementTab";
import EntitlementsTab from "components/pages/Users/EntitlementsTab";
import GroupsTab from "components/pages/Users/GroupsTab";
import RolesTab from "components/pages/Users/RolesTab";
import SummaryTab from "components/pages/Users/SummaryTab";
import User from "components/pages/Users/User";
import { ReBACAdminContext } from "context/ReBACAdminContext";
import type { ExclusiveProps } from "types/utils";
import urls from "urls";
import { logger } from "utils";

import "scss/index.scss";
import { Label } from "./types";

export type Props = {
  // The element ID to use to render aside panels into. Should not begin with "#".
  asidePanelId?: null | string;
  // The level of logging to be used by the logger.
  logLevel?: LogLevelDesc;
} & ExclusiveProps<
  {
    // The API base URL.
    apiURL: string;
  },
  {
    // An Axios instance to be used by all requests.
    axiosInstance: AxiosInstance;
  }
>;

const ReBACAdmin: FC<Props> = ({
  apiURL,
  axiosInstance,
  asidePanelId,
  logLevel = logger.levels.SILENT,
}: Props) => {
  const contextClient = useContext(QueryClientContext);
  if (contextClient && !contextClient.getDefaultOptions().queries?.staleTime) {
    logger.error(Label.STALE_TIME_ERROR);
    throw new Error(Label.STALE_TIME_ERROR);
  }
  // Use the query client from the host application if it exists, otherwise
  // set up our own client.
  const queryClient =
    contextClient ??
    new QueryClient({
      defaultOptions: {
        queries: {
          refetchOnWindowFocus: false,
          retry: false,
          // Cache queries for 30 seconds by default.
          staleTime: 30000,
        },
      },
    });
  if (axiosInstance) {
    setInstance(axiosInstance);
  } else {
    createInstance(apiURL);
  }

  useEffect(() => {
    logger.setDefaultLevel(logLevel);
  }, [logLevel]);

  return (
    <ReBACAdminContext.Provider value={{ asidePanelId }}>
      <QueryClientProvider client={queryClient}>
        <Routes>
          <Route path={urls.index}>
            <Route
              path={urls.index}
              element={<Panel title="Canonical ReBAC Admin" />}
            />
            <Route
              path={urls.accessGovernance.index}
              element={<Panel title="Access Governance" />}
            />
            <Route
              path={urls.authentication.index}
              element={<Panel title="Authentication" />}
            />
            <Route path={urls.entitlements} element={<Entitlements />} />
            <Route path={urls.groups.index} element={<Groups />} />
            <Route path={urls.resources.index} element={<Resources />} />
            <Route path={urls.roles.index} element={<Roles />} />
            <Route path={urls.users.user.index(null)} element={<User />}>
              <Route
                path={urls.users.user.index(null)}
                element={<SummaryTab />}
              />
              <Route
                path={urls.users.user.groups(null)}
                element={<GroupsTab />}
              />
              <Route
                path={urls.users.user.roles(null)}
                element={<RolesTab />}
              />
              <Route
                path={urls.users.user.entitlements(null)}
                element={<EntitlementsTab />}
              />
              <Route
                path={urls.users.user.accountManagement(null)}
                element={<AccountManagementTab />}
              />
            </Route>
            <Route path={urls.users.index} element={<Users />} />
          </Route>
        </Routes>
        <Toaster position="bottom-right" />
      </QueryClientProvider>
    </ReBACAdminContext.Provider>
  );
};

export default ReBACAdmin;
