import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import axios from "axios";
import { Route, Routes } from "react-router-dom";

import Panel from "components/Panel";
import Groups from "components/pages/Groups";
import Roles from "components/pages/Roles";
import Users from "components/pages/Users";
import urls from "urls";

export type Props = {
  // The absolute API URL.
  apiURL: `${"http" | "/"}${string}`;
};

const ReBACAdmin = ({ apiURL }: Props) => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        refetchOnWindowFocus: false,
        retry: false,
      },
    },
  });
  axios.defaults.baseURL = apiURL;

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
        <Route path={urls.groups.index} element={<Groups />} />
        <Route
          path={urls.resources.index}
          element={<Panel title="Resources" />}
        />
        <Route path={urls.roles.index} element={<Roles />} />
        <Route path={urls.users.index} element={<Users />} />
      </Routes>
    </QueryClientProvider>
  );
};

export default ReBACAdmin;
