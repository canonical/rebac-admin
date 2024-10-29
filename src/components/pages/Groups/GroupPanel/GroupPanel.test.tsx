import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { setupServer } from "msw/node";
import { vi } from "vitest";

import { getGetEntitlementsMockHandler } from "api/entitlements/entitlements.msw";
import { getGetIdentitiesMockHandler } from "api/identities/identities.msw";
import { getGetRolesMockHandler } from "api/roles/roles.msw";
import { EntitlementsPanelFormLabel } from "components/EntitlementsPanelForm";
import { Label as RolesPanelFormLabel } from "components/RolesPanelForm";
import { getGetActualCapabilitiesMock } from "test/mocks/capabilities";
import { renderComponent } from "test/utils";
import { Endpoint } from "types/api";

import { Label as IdentitiesPanelFormLabel } from "../IdentitiesPanelForm";

import { FieldsLabel } from "./Fields";
import GroupPanel from "./GroupPanel";

const mockApiServer = setupServer(
  ...getGetActualCapabilitiesMock(),
  getGetEntitlementsMockHandler(),
  getGetIdentitiesMockHandler(),
  getGetRolesMockHandler(),
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

test("the input is set from the name", async () => {
  renderComponent(
    <GroupPanel
      close={vi.fn()}
      setPanelWidth={vi.fn()}
      group={{ id: "group1", name: "admin" }}
      onSubmit={vi.fn()}
    />,
  );
  expect(
    await screen.findByRole("textbox", { name: FieldsLabel.NAME }),
  ).toHaveValue("admin");
});

test("can submit the form and pass whether the group has changed to onSubmit", async () => {
  const onSubmit = vi.fn();
  renderComponent(
    <GroupPanel close={vi.fn()} setPanelWidth={vi.fn()} onSubmit={onSubmit} />,
  );
  await userEvent.type(
    await screen.findByRole("textbox", { name: FieldsLabel.NAME }),
    "group1{Enter}",
  );
  expect(onSubmit).toHaveBeenCalledWith(
    { name: "group1" },
    true,
    [],
    [],
    [],
    [],
    [],
    [],
  );
});

test("the entitlement form can be displayed", async () => {
  renderComponent(
    <GroupPanel close={vi.fn()} setPanelWidth={vi.fn()} onSubmit={vi.fn()} />,
  );
  await userEvent.click(
    await screen.findByRole("button", { name: /Add entitlements/ }),
  );
  await screen.findByText(EntitlementsPanelFormLabel.ADD_ENTITLEMENT);
  expect(
    screen.getByRole("form", { name: EntitlementsPanelFormLabel.FORM }),
  ).toBeInTheDocument();
});

test("the user form can be displayed", async () => {
  renderComponent(
    <GroupPanel close={vi.fn()} setPanelWidth={vi.fn()} onSubmit={vi.fn()} />,
  );
  await userEvent.click(
    await screen.findByRole("button", { name: /Add users/ }),
  );
  expect(
    screen.getByRole("combobox", { name: IdentitiesPanelFormLabel.SELECT }),
  ).toBeInTheDocument();
});

test("the role form can be displayed", async () => {
  renderComponent(
    <GroupPanel close={vi.fn()} setPanelWidth={vi.fn()} onSubmit={vi.fn()} />,
  );
  await userEvent.click(
    await screen.findByRole("button", { name: /Add roles/ }),
  );
  expect(
    screen.getByRole("combobox", {
      name: RolesPanelFormLabel.SELECT,
    }),
  ).toBeInTheDocument();
});

test("it does not display the entitlement form if it doesn't have the capability", async () => {
  mockApiServer.use(
    ...getGetActualCapabilitiesMock([
      {
        endpoint: Endpoint.GROUP_ENTITLEMENTS,
        methods: [],
      },
    ]),
  );
  renderComponent(
    <GroupPanel close={vi.fn()} setPanelWidth={vi.fn()} onSubmit={vi.fn()} />,
  );
  await screen.findByRole("textbox", { name: FieldsLabel.NAME });
  expect(
    screen.queryByRole("button", { name: /Add entitlements/ }),
  ).not.toBeInTheDocument();
});

test("it does not display the user form if it doesn't have the capability", async () => {
  mockApiServer.use(
    ...getGetActualCapabilitiesMock([
      {
        endpoint: Endpoint.GROUP_IDENTITIES,
        methods: [],
      },
    ]),
  );
  renderComponent(
    <GroupPanel close={vi.fn()} setPanelWidth={vi.fn()} onSubmit={vi.fn()} />,
  );
  await screen.findByRole("textbox", { name: FieldsLabel.NAME });
  expect(
    screen.queryByRole("button", { name: /Add users/ }),
  ).not.toBeInTheDocument();
});

test("it does not display the role form if it doesn't have the capability", async () => {
  mockApiServer.use(
    ...getGetActualCapabilitiesMock([
      {
        endpoint: Endpoint.GROUP_ROLES,
        methods: [],
      },
    ]),
  );
  renderComponent(
    <GroupPanel close={vi.fn()} setPanelWidth={vi.fn()} onSubmit={vi.fn()} />,
  );
  await screen.findByRole("textbox", { name: FieldsLabel.NAME });
  expect(
    screen.queryByRole("button", { name: /Add roles/ }),
  ).not.toBeInTheDocument();
});

test("submit button is disabled when editing and there are no changes", async () => {
  renderComponent(
    <GroupPanel
      close={vi.fn()}
      isEditing
      setPanelWidth={vi.fn()}
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
      group={{ id: "group1", name: "admin" }}
      onSubmit={vi.fn()}
    />,
  );
  expect(
    await screen.findByRole("button", { name: "Update group" }),
  ).toBeDisabled();
});

test("submit button is enabled when editing and there are changes", async () => {
  renderComponent(
    <GroupPanel
      close={vi.fn()}
      isEditing
      setPanelWidth={vi.fn()}
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
      group={{ id: "group1", name: "admin" }}
      onSubmit={vi.fn()}
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
    screen.getAllByRole("button", { name: "Update group" })[0],
  );
  expect(
    screen.getByRole("button", { name: "Update group" }),
  ).not.toBeDisabled();
});
