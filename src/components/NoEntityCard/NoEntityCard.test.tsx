import { Button } from "@canonical/react-components";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { vi } from "vitest";

import { renderComponent } from "test/utils";

import NoEntityCard from "./NoEntityCard";

const title = "Mock title";
const message = "Mock message";

test("should render correctly without action button", () => {
  renderComponent(<NoEntityCard title={title} message={message} />);
  expect(screen.getByText(title)).toHaveClass("p-heading--4");
  expect(screen.getByText(message)).toBeInTheDocument();
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
  expect(screen.getByText(title)).toHaveClass("p-heading--4");
  expect(screen.getByText(message)).toBeInTheDocument();
  const actionButton = screen.getByRole("button", {
    name: actionButtonName,
  });
  await userEvent.click(actionButton);
  expect(handleClick).toHaveBeenCalledTimes(1);
});
