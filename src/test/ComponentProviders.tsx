import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { type ReactNode, type PropsWithChildren, useEffect } from "react";
import reactHotToast, { Toaster } from "react-hot-toast";
import { BrowserRouter, Routes, Route } from "react-router";

export type ComponentProps = {
  path: string;
  routeChildren?: ReactNode;
  queryClient?: QueryClient;
} & PropsWithChildren;

const ComponentProviders = ({
  children,
  routeChildren,
  path,
  queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  }),
}: ComponentProps) => {
  useEffect(
    () => () => {
      // Clean up all toast messages to prevent bleed between tests.
      reactHotToast.remove();
    },
    [],
  );
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          <Route path={path} element={children}>
            {routeChildren}
          </Route>
          {/* Capture other paths to prevent warnings when navigating in tests. */}
          <Route path="*" element={<span />} />
        </Routes>
      </BrowserRouter>
      <Toaster toastOptions={{ duration: 1 }} />
    </QueryClientProvider>
  );
};

export default ComponentProviders;
