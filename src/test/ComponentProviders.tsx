import { QueryClient } from "@tanstack/react-query";
import { QueryClientProvider } from "@tanstack/react-query";
import type { ReactNode, PropsWithChildren } from "react";
import { Toaster } from "react-hot-toast";
import { BrowserRouter, Routes, Route } from "react-router-dom";

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
}: ComponentProps) => (
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
    <Toaster />
  </QueryClientProvider>
);

export default ComponentProviders;
