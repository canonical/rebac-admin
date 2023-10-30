import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const ReBACAdmin = () => {
  const queryClient = new QueryClient();

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
