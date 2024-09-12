import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { setupServer } from "msw/node";
import { vi } from "vitest";

import { getGetEntitlementsMockHandler } from "api/entitlements/entitlements.msw";
import { getGetGroupsMockHandler } from "api/groups/groups.msw";
import { getGetRolesMockHandler } from "api/roles/roles.msw";
import { EntitlementsPanelFormLabel } from "components/EntitlementsPanelForm";
import { Label as GroupsPanelFormLabel } from "components/GroupsPanelForm";
import { Label as RolesPanelFormLabel } from "components/RolesPanelForm";
import { renderComponent } from "test/utils";

import UserPanel from "./UserPanel";
import { Label } from "./types";

const mockApiServer = setupServer(
  getGetGroupsMockHandler(),
  getGetRolesMockHandler(),
  getGetEntitlementsMockHandler(),
);

beforeAll(() => {
  mockApiServer.listen();
});

afterEach(() => {
  mockApiServer.resetHandlers();
});

afterAll(() => {
  mockApiServer.close();
});

const mockUser = {
  id: "user1",
  addedBy: "within",
  email: "pfft@example.com",
  firstName: "really",
  lastName: "good",
  source: "noteworthy",
};

test("the input is set from the user data", async () => {
  renderComponent(
    <UserPanel
      close={vi.fn()}
      setPanelWidth={vi.fn()}
      onSubmit={vi.fn()}
      isEditing
      user={mockUser}
    />,
  );
  expect(screen.getByRole("textbox", { name: Label.EMAIL })).toHaveValue(
    "pfft@example.com",
  );
  expect(screen.getByRole("textbox", { name: Label.FIRST_NAME })).toHaveValue(
    "really",
  );
  expect(screen.getByRole("textbox", { name: Label.LAST_NAME })).toHaveValue(
    "good",
  );
});

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
  expect(onSubmit).toHaveBeenCalledWith(
    {
      email: "test@test.com",
      firstName: "mock first name",
      lastName: "mock last name",
    },
    [],
    [],
    [],
    [],
    [],
    [],
  );
});

test("submit button is disabled when email is not provided", async () => {
  renderComponent(
    <UserPanel close={vi.fn()} setPanelWidth={vi.fn()} onSubmit={vi.fn()} />,
  );
  expect(
    screen.getByRole("button", { name: "Create local user" }),
  ).toBeDisabled();
});

test("should display the groups form", async () => {
  renderComponent(
    <UserPanel close={vi.fn()} setPanelWidth={vi.fn()} onSubmit={vi.fn()} />,
  );
  await userEvent.click(screen.getByRole("button", { name: /Add groups/ }));
  expect(
    screen.getByRole("combobox", {
      name: GroupsPanelFormLabel.SELECT,
    }),
  ).toBeInTheDocument();
});

test("should display the roles form", async () => {
  renderComponent(
    <UserPanel close={vi.fn()} setPanelWidth={vi.fn()} onSubmit={vi.fn()} />,
  );
  await userEvent.click(screen.getByRole("button", { name: /Add roles/ }));
  expect(
    screen.getByRole("combobox", {
      name: RolesPanelFormLabel.SELECT,
    }),
  ).toBeInTheDocument();
});

test("should display the entitlements form", async () => {
  renderComponent(
    <UserPanel close={vi.fn()} setPanelWidth={vi.fn()} onSubmit={vi.fn()} />,
  );
  await userEvent.click(
    screen.getByRole("button", { name: /Add entitlements/ }),
  );
  await screen.findByText(EntitlementsPanelFormLabel.ADD_ENTITLEMENT);
  expect(
    screen.getByRole("form", { name: EntitlementsPanelFormLabel.FORM }),
  ).toBeInTheDocument();
});

test("should have submit button disabled if there are no changes", async () => {
  renderComponent(
    <UserPanel
      close={vi.fn()}
      setPanelWidth={vi.fn()}
      onSubmit={vi.fn()}
      isEditing
      user={mockUser}
    />,
  );
  expect(
    screen.getByRole("button", { name: "Update local user" }),
  ).toBeDisabled();
});
