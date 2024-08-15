import { NotificationSeverity } from "@canonical/react-components";
import { QueryClient } from "@tanstack/react-query";
import { render, renderHook, screen, waitFor } from "@testing-library/react";
import React from "react";

import ComponentProviders from "./ComponentProviders";
import type { ComponentProps } from "./ComponentProviders";

type Options = {
  url?: string;
  path?: string;
  routeChildren?: ComponentProps["routeChildren"];
  queryClient?: QueryClient;
};

export const changeURL = (url: string) => window.happyDOM.setURL(url);
const getQueryClient = (options: Options | null | undefined) =>
  options?.queryClient
    ? options.queryClient
    : new QueryClient({
        defaultOptions: {
          queries: {
            retry: false,
            staleTime: 1,
          },
        },
      });

export const renderComponent = (
  component: React.JSX.Element,
  options?: Options | null,
) => {
  const queryClient = getQueryClient(options);
  changeURL(options?.url ?? "/");
  const result = render(component, {
    wrapper: (props) => (
      <ComponentProviders
        {...props}
        routeChildren={options?.routeChildren}
        path={options?.path ?? "*"}
        queryClient={queryClient}
      />
    ),
  });
  return { changeURL, result, queryClient };
};

export const renderWrappedHook = <Result, Props>(
  hook: (initialProps: Props) => Result,
  options?: Options | null,
) => {
  const queryClient = getQueryClient(options);
  changeURL(options?.url ?? "/");
  const { result } = renderHook(hook, {
    wrapper: (props) => (
      <ComponentProviders
        {...props}
        routeChildren={options?.routeChildren}
        path={options?.path ?? "*"}
        queryClient={queryClient}
      />
    ),
  });
  return { changeURL, result, queryClient };
};

export const hasNotification = async (
  message: string,
  severity = NotificationSeverity.NEGATIVE,
) => {
  const notification = await screen.findByText(message);
  expect(
    notification.closest(`.p-notification--${severity}`),
  ).toBeInTheDocument();
};

export const hasToast = async (
  message: string,
  severity: string = NotificationSeverity.POSITIVE,
) => {
  const toast = await screen.findByText(message);
  const card = toast.closest(".toast-card");
  expect(card).toBeInTheDocument();
  expect(card).toHaveAttribute("data-type", severity);
};

export const hasSpinner = async (label = "Loading", shouldExist = true) => {
  if (shouldExist) {
    const text = await screen.findByText(label);
    const parent = text?.closest('[role="alert"]');
    const icon = parent?.querySelector(".p-icon--spinner");
    expect(text).toBeInTheDocument();
    expect(icon).toBeInTheDocument();
  } else {
    await waitFor(() => {
      const text = screen.queryByText(label);
      if (text) {
        const parent = text.closest('[role="alert"]');
        const icon = parent?.querySelector(".p-icon--spinner");
        expect(icon).not.toBeInTheDocument();
      } else {
        expect(text).not.toBeInTheDocument();
      }
    });
  }
};
