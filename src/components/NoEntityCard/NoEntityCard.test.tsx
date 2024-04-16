import { Button } from "@canonical/react-components";
import { act, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { vi } from "vitest";

import { hasEmptyState, renderComponent } from "test/utils";

import NoEntityCard from "./NoEntityCard";

const title = "Mock title";
const message = "Mock message";

test("should display without action button", async () => {
  renderComponent(<NoEntityCard title={title} message={message} />);
  await hasEmptyState(title, message);
  expect(screen.queryByRole("button")).not.toBeInTheDocument();
});

test("should display with action button", async () => {
  const handleClick = vi.fn();
  const actionButtonName = "Mock action";
  renderComponent(
    <NoEntityCard
      title={title}
      message={message}
      actionButton={<Button onClick={handleClick}>{actionButtonName}</Button>}
    />,
  );
  await hasEmptyState(title, message);
  const actionButton = screen.getByRole("button", { name: actionButtonName });
  await act(() => userEvent.click(actionButton));
  expect(handleClick).toHaveBeenCalled();
});
