import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const ReBACAdmin = () => {
  const queryClient = new QueryClient();

  return (
    <QueryClientProvider client={queryClient}>
      <h1>Canonical ReBAC Admin</h1>
    </QueryClientProvider>
  );
};

export default ReBACAdmin;
