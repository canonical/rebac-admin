import { Panel } from "@canonical/react-components";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import axios from "axios";
import type { LogLevelDesc } from "loglevel";
import { useEffect } from "react";
import { Route, Routes } from "react-router-dom";

import Groups from "components/pages/Groups";
import Roles from "components/pages/Roles";
import Users from "components/pages/Users";
import { ReBACAdminContext } from "context/ReBACAdminContext";
import urls from "urls";
import { logger } from "utils";

import "scss/index.scss";

export type Props = {
  // The absolute API URL.
  apiURL: `${"http" | "/"}${string}`;
  // The element ID to use to render aside panels into. Should not begin with "#".
  asidePanelId?: string | null;
  // The level of logging to be used by the logger.
  logLevel?: LogLevelDesc;
};

const ReBACAdmin = ({
  apiURL,
  asidePanelId,
  logLevel = logger.levels.SILENT,
}: Props) => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        refetchOnWindowFocus: false,
        retry: false,
      },
    },
  });
  axios.defaults.baseURL = apiURL;

  useEffect(() => {
    logger.setDefaultLevel(logLevel);
  }, [logLevel]);

  return (
    <ReBACAdminContext.Provider value={{ asidePanelId }}>
      <QueryClientProvider client={queryClient}>
        <Routes>
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
          <Route
            path={urls.entitlements}
            element={<Panel title="Entitlements" />}
          />
          <Route path={urls.groups.index} element={<Groups />} />
          <Route
            path={urls.resources.index}
            element={<Panel title="Resources" />}
          />
          <Route path={urls.roles.index} element={<Roles />} />
          <Route path={urls.users.index} element={<Users />} />
        </Routes>
      </QueryClientProvider>
    </ReBACAdminContext.Provider>
  );
};

export default ReBACAdmin;
