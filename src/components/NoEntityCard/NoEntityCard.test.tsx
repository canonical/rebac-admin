import { Button } from "@canonical/react-components";
import { act, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { vi } from "vitest";

import { renderComponent } from "test/utils";

import NoEntityCard from "./NoEntityCard";

const title = "Mock title";
const message = "Mock message";

test("should render correctly without action button", async () => {
  renderComponent(<NoEntityCard title={title} message={message} />);
  const emptyStateHeader = await screen.findByRole("heading", { name: title });
  const emptyState = emptyStateHeader.parentElement;
  expect(emptyState).not.toBeNull();
  expect(within(emptyState!).getByText(message)).toBeInTheDocument();
  expect(screen.queryByRole("button")).not.toBeInTheDocument();
});

test("should render correctly with action button", async () => {
  const handleClick = vi.fn();
  const actionButtonName = "Mock action";
  renderComponent(
    <NoEntityCard
      title={title}
      message={message}
      actionButton={<Button onClick={handleClick}>{actionButtonName}</Button>}
    />,
  );
  const emptyState = screen.getByTestId("no-entity-card");
  expect(
    within(emptyState).getByRole("heading", { name: title }),
  ).toBeInTheDocument();
  expect(within(emptyState).getByText(message)).toBeInTheDocument();
  const actionButton = within(emptyState).getByRole("button", {
    name: actionButtonName,
  });
  await act(() => userEvent.click(actionButton));
  expect(handleClick).toHaveBeenCalledTimes(1);
});
