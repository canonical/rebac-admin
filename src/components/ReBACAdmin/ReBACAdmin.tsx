import process from "process";

import {
  QueryClient,
  QueryClientContext,
  QueryClientProvider,
} from "@tanstack/react-query";
import axios from "axios";
import { useContext, useEffect } from "react";
import { Toaster } from "react-hot-toast";
import { Route, Routes } from "react-router-dom";

import Panel from "components/Panel";
import Groups from "components/pages/Groups";
import Roles from "components/pages/Roles";
import Users from "components/pages/Users";
import { ReBACAdminContext } from "context/ReBACAdminContext";
import urls from "urls";

import "scss/index.scss";
import { Label } from "./types";

// Webpack 5 no longer makes node variables available at runtime so we need to
// attach `process` to the window:
// https://github.com/facebook/create-react-app/issues/12212
// This is used by the async limiter.
if (!window.process) {
  window.process = process;
}

export type Props = {
  // The absolute API URL.
  apiURL: `${"http" | "/"}${string}`;
  // The element ID to use to render aside panels into. Should not begin with "#".
  asidePanelId?: string | null;
  // The base64 encoded user id for the authenticated user.
  authToken?: string | null;
};

const ReBACAdmin = ({ apiURL, asidePanelId, authToken }: Props) => {
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
  axios.defaults.baseURL = apiURL;

  useEffect(() => {
    if (authToken) {
      axios.defaults.headers.common["X-Authorization"] = authToken;
    } else if (axios.defaults.headers.common["X-Authorization"]) {
      delete axios.defaults.headers.common["X-Authorization"];
    }
  }, [authToken]);

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
        <Toaster position="bottom-right" />
      </QueryClientProvider>
    </ReBACAdminContext.Provider>
  );
};

export default ReBACAdmin;
