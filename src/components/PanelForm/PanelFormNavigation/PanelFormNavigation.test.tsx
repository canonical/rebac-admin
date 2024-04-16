import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { vi } from "vitest";

import { renderComponent } from "test/utils";

import PanelFormNavigation from "./PanelFormNavigation";

test("displays the parent navigation", async () => {
  renderComponent(<PanelFormNavigation panelEntity="role" setView={vi.fn()} />);
  expect(document.querySelectorAll(".p-breadcrumbs__item")).toHaveLength(1);
  const title = screen.getByText("Create role");
  expect(title).toBeInTheDocument();
  expect(title.closest(".p-heading--4")).toBeInTheDocument();
});

test("displays the child navigation", async () => {
  renderComponent(
    <PanelFormNavigation panelEntity="role" setView={vi.fn()} view="group" />,
  );
  expect(document.querySelectorAll(".p-breadcrumbs__item")).toHaveLength(2);
  expect(
    screen.getByRole("button", { name: "Create role" }),
  ).toBeInTheDocument();
  const title = screen.getByText("Add groups");
  expect(title).toBeInTheDocument();
  expect(title.closest(".p-heading--4")).toBeInTheDocument();
});

test("handles navigating to the parent", async () => {
  const setView = vi.fn();
  renderComponent(
    <PanelFormNavigation panelEntity="role" setView={setView} view="group" />,
  );
  await userEvent.click(screen.getByRole("button", { name: "Create role" }));
  expect(setView).toHaveBeenCalled();
});

test("displays when editing", async () => {
  renderComponent(
    <PanelFormNavigation
      isEditing
      panelEntity="role"
      setView={vi.fn()}
      view="group"
    />,
  );
  expect(screen.getByText("Edit role")).toBeInTheDocument();
  expect(screen.getByText("Edit groups")).toBeInTheDocument();
});
