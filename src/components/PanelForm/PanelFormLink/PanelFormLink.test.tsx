import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { vi } from "vitest";

import { renderComponent } from "test/utils";

import PanelFormLink from "./PanelFormLink";

test("handles clicks", async () => {
  const onClick = vi.fn();
  renderComponent(
    <PanelFormLink count={1} entity="role" icon="user" onClick={onClick} />,
  );
  await userEvent.click(screen.getByRole("button"));
  expect(onClick).toHaveBeenCalled();
});

test("displays count for 0 entities", async () => {
  renderComponent(
    <PanelFormLink count={0} entity="role" icon="user" onClick={vi.fn()} />,
  );
  expect(screen.getByText("No roles")).toBeInTheDocument();
});

test("displays count for 1 entity", async () => {
  renderComponent(
    <PanelFormLink count={1} entity="role" icon="user" onClick={vi.fn()} />,
  );
  expect(screen.getByText("1 role")).toBeInTheDocument();
});

test("displays count for more than 1 entity", async () => {
  renderComponent(
    <PanelFormLink count={2} entity="role" icon="user" onClick={vi.fn()} />,
  );
  expect(screen.getByText("2 roles")).toBeInTheDocument();
});
