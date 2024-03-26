import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import axios from "axios";
import type { LogLevelDesc } from "loglevel";
import { useEffect } from "react";
import { Route, Routes } from "react-router-dom";

import Panel from "components/Panel";
import Users from "components/pages/Users";
import urls from "urls";
import logger from "utils/logger";

export type Props = {
  // The absolute API URL.
  apiURL: `${"http" | "/"}${string}`;
  // The level of logging to be used by the logger.
  logLevel?: LogLevelDesc;
};

const ReBACAdmin = ({ apiURL, logLevel = logger.levels.SILENT }: Props) => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });
  axios.defaults.baseURL = apiURL;

  useEffect(() => {
    logger.setLevel(logLevel);
  }, [logLevel]);

  return (
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
        <Route path={urls.groups.index} element={<Panel title="Groups" />} />
        <Route
          path={urls.resources.index}
          element={<Panel title="Resources" />}
        />
        <Route path={urls.roles.index} element={<Panel title="Roles" />} />
        <Route path={urls.users.index} element={<Users />} />
      </Routes>
    </QueryClientProvider>
  );
};

export default ReBACAdmin;
