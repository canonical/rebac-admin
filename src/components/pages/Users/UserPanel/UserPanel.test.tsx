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
import { getGetActualCapabilitiesMock } from "test/mocks/capabilities";
import { renderComponent } from "test/utils";
import { Endpoint } from "types/api";

import { Label } from "./Fields/types";
import UserPanel from "./UserPanel";

const mockApiServer = setupServer(
  ...getGetActualCapabilitiesMock(),
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
  expect(await screen.findByRole("textbox", { name: Label.EMAIL })).toHaveValue(
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
    await screen.findByRole("textbox", { name: Label.EMAIL }),
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
    true,
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
    await screen.findByRole("button", { name: "Create local user" }),
  ).toBeDisabled();
});

test("should display the groups form", async () => {
  renderComponent(
    <UserPanel close={vi.fn()} setPanelWidth={vi.fn()} onSubmit={vi.fn()} />,
  );
  await userEvent.click(
    await screen.findByRole("button", { name: /Add groups/ }),
  );
  expect(
    await screen.findByRole("combobox", {
      name: GroupsPanelFormLabel.SELECT,
    }),
  ).toBeInTheDocument();
});

test("should display the roles form", async () => {
  renderComponent(
    <UserPanel close={vi.fn()} setPanelWidth={vi.fn()} onSubmit={vi.fn()} />,
  );
  await userEvent.click(
    await screen.findByRole("button", { name: /Add roles/ }),
  );
  expect(
    await screen.findByRole("combobox", {
      name: RolesPanelFormLabel.SELECT,
    }),
  ).toBeInTheDocument();
});

test("should display the entitlements form", async () => {
  renderComponent(
    <UserPanel close={vi.fn()} setPanelWidth={vi.fn()} onSubmit={vi.fn()} />,
  );
  await userEvent.click(
    await screen.findByRole("button", { name: /Add entitlements/ }),
  );
  await screen.findByText(EntitlementsPanelFormLabel.ADD_ENTITLEMENT);
  expect(
    screen.getByRole("form", { name: EntitlementsPanelFormLabel.FORM }),
  ).toBeInTheDocument();
});

test("it does not display the group form if it doesn't have the capability", async () => {
  mockApiServer.use(
    ...getGetActualCapabilitiesMock([
      {
        endpoint: Endpoint.IDENTITY_GROUPS,
        methods: [],
      },
    ]),
  );
  renderComponent(
    <UserPanel close={vi.fn()} setPanelWidth={vi.fn()} onSubmit={vi.fn()} />,
  );
  await screen.findByRole("textbox", { name: Label.EMAIL });
  expect(
    screen.queryByRole("button", { name: /Add groups/ }),
  ).not.toBeInTheDocument();
});

test("it does not display the role form if it doesn't have the capability", async () => {
  mockApiServer.use(
    ...getGetActualCapabilitiesMock([
      {
        endpoint: Endpoint.IDENTITY_ROLES,
        methods: [],
      },
    ]),
  );
  renderComponent(
    <UserPanel close={vi.fn()} setPanelWidth={vi.fn()} onSubmit={vi.fn()} />,
  );
  await screen.findByRole("textbox", { name: Label.EMAIL });
  expect(
    screen.queryByRole("button", { name: /Add roles/ }),
  ).not.toBeInTheDocument();
});

test("it does not display the entitlement form if it doesn't have the capability", async () => {
  mockApiServer.use(
    ...getGetActualCapabilitiesMock([
      {
        endpoint: Endpoint.IDENTITY_ENTITLEMENTS,
        methods: [],
      },
    ]),
  );
  renderComponent(
    <UserPanel close={vi.fn()} setPanelWidth={vi.fn()} onSubmit={vi.fn()} />,
  );
  await screen.findByRole("textbox", { name: Label.EMAIL });
  expect(
    screen.queryByRole("button", { name: /Add entitlements/ }),
  ).not.toBeInTheDocument();
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
    await screen.findByRole("button", { name: "Update local user" }),
  ).toBeDisabled();
});

test("should have submit button enabled if there are changes", async () => {
  renderComponent(
    <UserPanel
      close={vi.fn()}
      setPanelWidth={vi.fn()}
      onSubmit={vi.fn()}
      existingEntitlements={[
        {
          entitlement: "can_edit",
          entity_id: "moderators",
          entity_type: "collection",
        },
        {
          entitlement: "can_remove",
          entity_id: "staff",
          entity_type: "team",
        },
      ]}
      isEditing
      user={mockUser}
    />,
  );
  await userEvent.click(
    await screen.findByRole("button", { name: /Edit entitlements/ }),
  );
  await screen.findByText(EntitlementsPanelFormLabel.ADD_ENTITLEMENT);
  await userEvent.click(
    screen.getAllByRole("button", {
      name: EntitlementsPanelFormLabel.REMOVE,
    })[0],
  );
  await userEvent.click(
    screen.getAllByRole("button", { name: "Update local user" })[0],
  );
  expect(
    screen.getByRole("button", { name: "Update local user" }),
  ).toBeEnabled();
});
