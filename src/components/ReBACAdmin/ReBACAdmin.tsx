import process from "process";

import {
  QueryClient,
  QueryClientContext,
  QueryClientProvider,
} from "@tanstack/react-query";
import type { AxiosInstance } from "axios";
import { useContext } from "react";
import { Toaster } from "react-hot-toast";
import { Route, Routes } from "react-router-dom";

import { setInstance, createInstance } from "api-utils/mutator/custom-instance";
import Panel from "components/Panel";
import Groups from "components/pages/Groups";
import Roles from "components/pages/Roles";
import Users from "components/pages/Users";
import { ReBACAdminContext } from "context/ReBACAdminContext";
import type { ExclusiveProps } from "types/utils";
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
  // The element ID to use to render aside panels into. Should not begin with "#".
  asidePanelId?: string | null;
} & ExclusiveProps<
  {
    // The absolute API base URL.
    apiURL: `${"http" | "/"}${string}`;
  },
  {
    // An Axios instance to be used by all requests.
    axiosInstance: AxiosInstance;
  }
>;

const ReBACAdmin = ({ apiURL, asidePanelId, axiosInstance }: Props) => {
  const contextClient = useContext(QueryClientContext);
  if (contextClient && !contextClient.getDefaultOptions().queries?.staleTime) {
    console.error(Label.STALE_TIME_ERROR);
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
  } else if (apiURL) {
    createInstance(apiURL);
  }

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
