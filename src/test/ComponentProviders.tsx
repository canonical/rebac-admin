import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import type { PropsWithChildren, FC } from "react";
import { useEffect } from "react";
import reactHotToast, { Toaster } from "react-hot-toast";
import type { Location, RouteObject } from "react-router";
import { createBrowserRouter, RouterProvider, useLocation } from "react-router";

export type ComponentProps = {
  path: string;
  routeChildren?: RouteObject[];
  queryClient?: QueryClient;
  setLocation?: (location: Location) => void;
} & PropsWithChildren;

const Wrapper: FC<
  PropsWithChildren & {
    setLocation?: (location: Location) => void;
  }
> = ({ children, setLocation }) => {
  const location = useLocation();
  useEffect(() => {
    setLocation?.(location);
  }, [location, setLocation]);
  return children;
};

const ComponentProviders: FC<ComponentProps> = ({
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
}) => {
  useEffect(
    () => (): void => {
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
