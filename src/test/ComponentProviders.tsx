import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { type PropsWithChildren, useEffect } from "react";
import reactHotToast, { Toaster } from "react-hot-toast";
import type { Location, RouteObject } from "react-router-dom";
import {
  createBrowserRouter,
  RouterProvider,
  useLocation,
} from "react-router-dom";

export type ComponentProps = {
  path: string;
  routeChildren?: RouteObject[];
  queryClient?: QueryClient;
  setLocation?: (location: Location) => void;
} & PropsWithChildren;

const Wrapper = ({
  children,
  setLocation,
}: PropsWithChildren & { setLocation?: (location: Location) => void }) => {
  const location = useLocation();
  useEffect(() => {
    setLocation?.(location);
  }, [location, setLocation]);
  return children;
};

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
  setLocation,
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
      element: <Wrapper setLocation={setLocation}>{children}</Wrapper>,
      children: routeChildren,
    },
    {
      // Capture other paths to prevent warnings when navigating in tests.
      path: "*",
      element: <Wrapper setLocation={setLocation} />,
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
