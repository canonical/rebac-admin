import { act, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { vi } from "vitest";

import { renderComponent } from "test/utils";

import ErrorNotification from "./ErrorNotification";

test("should render correctly and be able to refetch", async () => {
  const message = "Failed to fetch data.";
  const error = "There was an error.";
  const onRefetch = vi.fn();
  renderComponent(
    <ErrorNotification message={message} error={error} onRefetch={onRefetch} />,
  );
  const errorNotification = screen.getByText(`${message} ${error} Try`, {
    exact: false,
  });
  expect(errorNotification.childElementCount).toBe(1);
  const refetchButton = errorNotification.children[0];
  expect(refetchButton).toHaveTextContent("refetch");
  await act(() => userEvent.click(refetchButton));
  expect(onRefetch).toHaveBeenCalledTimes(1);
});
