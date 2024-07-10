import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { vi } from "vitest";

import { renderComponent } from "test/utils";

import BreadcrumbNavigation from "./BreadcrumbNavigation";

test("displays the title", async () => {
  renderComponent(
    <BreadcrumbNavigation title="Create role" titleId="role-title" />,
  );
  expect(document.querySelectorAll(".p-breadcrumbs__item")).toHaveLength(1);
  const title = screen.getByText("Create role");
  expect(title).toBeInTheDocument();
  expect(title.closest(".p-heading--4")).toBeInTheDocument();
  expect(title).toHaveAttribute("id", "role-title");
  expect(screen.queryByRole("button")).not.toBeInTheDocument();
});

test("displays a back button", async () => {
  const onBack = vi.fn();
  renderComponent(
    <BreadcrumbNavigation
      title="Create role"
      onBack={onBack}
      backTitle="Back to roles"
    />,
  );
  await userEvent.click(screen.getByRole("button", { name: "Back to roles" }));
  expect(onBack).toHaveBeenCalled();
});
