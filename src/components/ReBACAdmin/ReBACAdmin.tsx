import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import axios from "axios";

export type Props = {
  // The absolute API URL.
  apiURL: `${"http" | "/"}${string}`;
};

const ReBACAdmin = ({ apiURL }: Props) => {
  const queryClient = new QueryClient();
  axios.defaults.baseURL = apiURL;

  return (
    <QueryClientProvider client={queryClient}>
      <div className="p-panel">
        <div className="p-panel__header">
          <h4 className="p-panel__title">Canonical ReBAC Admin</h4>
        </div>
        <div className="p-panel__content"></div>
      </div>
    </QueryClientProvider>
  );
};

export default ReBACAdmin;
