import { QueryClient } from "@tanstack/react-query";
import { QueryClientProvider } from "@tanstack/react-query";
import { type PropsWithChildren, useEffect } from "react";
import reactHotToast, { Toaster } from "react-hot-toast";
import type { RouteObject } from "react-router-dom";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

export type ComponentProps = {
  path: string;
  routeChildren?: RouteObject[];
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
  const router = createBrowserRouter([
    {
      path,
      element: children,
      children: routeChildren,
    },
    {
      // Capture other paths to prevent warnings when navigating in tests.
      path: "*",
      element: <span />,
    },
  ]);
  return (
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
      <Toaster toastOptions={{ duration: 1 }} />
    </QueryClientProvider>
  );
};

export default ComponentProviders;
