import { act, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { vi } from "vitest";

import { renderComponent } from "test/utils";

import ErrorNotification from "./ErrorNotification";

test("should render correctly", async () => {
  const message = "Failed to fetch data.";
  const error = "There was an error.";
  const onClick = vi.fn();
  renderComponent(
    <ErrorNotification message={message} error={error} onClick={onClick} />,
  );
  const errorNotification = screen.getByText(`${message} ${error} Try`, {
    exact: false,
  });
  expect(errorNotification.childElementCount).toBe(1);
  const refetchButton = errorNotification.children[0];
  expect(refetchButton).toHaveTextContent("refetch");
  await act(() => userEvent.click(refetchButton));
  expect(onClick).toHaveBeenCalledTimes(1);
});
