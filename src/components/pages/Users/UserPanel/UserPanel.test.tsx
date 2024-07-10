import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { vi } from "vitest";

import { renderComponent } from "test/utils";

import UserPanel from "./UserPanel";
import { Label } from "./types";

test("can submit the form", async () => {
  const onSubmit = vi.fn();
  renderComponent(
    <UserPanel close={vi.fn()} setPanelWidth={vi.fn()} onSubmit={onSubmit} />,
  );
  await userEvent.type(
    screen.getByRole("textbox", { name: Label.EMAIL }),
    "test@test.com",
  );
  await userEvent.type(
    screen.getByRole("textbox", { name: Label.FIRST_NAME }),
    "mock first name",
  );
  await userEvent.type(
    screen.getByRole("textbox", { name: Label.LAST_NAME }),
    "mock last name{Enter}",
  );
  expect(onSubmit).toHaveBeenCalledWith({
    email: "test@test.com",
    firstName: "mock first name",
    lastName: "mock last name",
  });
});

test("submit button is disabled when email is not provided", async () => {
  renderComponent(
    <UserPanel close={vi.fn()} setPanelWidth={vi.fn()} onSubmit={vi.fn()} />,
  );
  expect(
    screen.getByRole("button", { name: "Create local user" }),
  ).toBeDisabled();
});
