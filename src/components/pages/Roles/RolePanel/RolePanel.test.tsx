import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { setupServer } from "msw/node";
import { vi } from "vitest";

import { getGetEntitlementsMockHandler } from "api/entitlements/entitlements.msw";
import { EntitlementsPanelFormLabel } from "components/EntitlementsPanelForm";
import { getGetActualCapabilitiesMock } from "test/mocks/capabilities";
import { mockEntityEntitlement } from "test/mocks/entitlements";
import { renderComponent } from "test/utils";

import { FieldsLabel } from "./Fields";
import RolePanel from "./RolePanel";

const mockApiServer = setupServer(
  ...getGetActualCapabilitiesMock(),
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

test("the input is set from the name", async () => {
  renderComponent(
    <RolePanel
      close={vi.fn()}
      setPanelWidth={vi.fn()}
      role={{ id: "admin1", name: "admin" }}
      onSubmit={vi.fn()}
    />,
  );
  expect(screen.getByRole("textbox", { name: FieldsLabel.NAME })).toHaveValue(
    "admin",
  );
});

test("can submit the form", async () => {
  const onSubmit = vi.fn();
  renderComponent(
    <RolePanel close={vi.fn()} setPanelWidth={vi.fn()} onSubmit={onSubmit} />,
  );
  await userEvent.type(
    screen.getByRole("textbox", { name: FieldsLabel.NAME }),
    "role1{Enter}",
  );
  expect(onSubmit).toHaveBeenCalledWith(
    { name: "role1" },
    true,
    expect.any(Array),
    expect.any(Array),
  );
});

test("passes whether the role was changed to onSubmit", async () => {
  const onSubmit = vi.fn();
  renderComponent(
    <RolePanel
      close={vi.fn()}
      isEditing
      setPanelWidth={vi.fn()}
      existingEntitlements={[mockEntityEntitlement()]}
      role={{ id: "admin1", name: "admin" }}
      onSubmit={onSubmit}
    />,
  );
  await userEvent.click(
    screen.getByRole("button", { name: /Edit entitlements/ }),
  );
  await screen.findByText(EntitlementsPanelFormLabel.ADD_ENTITLEMENT);
  await userEvent.click(
    screen.getAllByRole("button", {
      name: EntitlementsPanelFormLabel.REMOVE,
    })[0],
  );
  await userEvent.click(
    screen.getAllByRole("button", { name: "Update role" })[0],
  );
  expect(onSubmit).toHaveBeenCalledWith(
    { name: "admin" },
    false,
    expect.any(Array),
    expect.any(Array),
  );
});

test("the entitlement form can be displayed", async () => {
  const mockApiServer = setupServer(getGetEntitlementsMockHandler());
  mockApiServer.listen();
  renderComponent(
    <RolePanel close={vi.fn()} setPanelWidth={vi.fn()} onSubmit={vi.fn()} />,
  );
  await userEvent.click(
    screen.getByRole("button", { name: /Add entitlements/ }),
  );
  await screen.findByText(EntitlementsPanelFormLabel.ADD_ENTITLEMENT);
  expect(
    screen.getByRole("form", { name: EntitlementsPanelFormLabel.FORM }),
  ).toBeInTheDocument();
  mockApiServer.close();
});

test("submit button is disabled when editing and there are no changes", async () => {
  renderComponent(
    <RolePanel
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
      role={{ id: "admin1", name: "admin" }}
      onSubmit={vi.fn()}
    />,
  );
  expect(screen.getByRole("button", { name: "Update role" })).toBeDisabled();
});

test("submit button is enabled when editing and there are changes", async () => {
  renderComponent(
    <RolePanel
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
      role={{ id: "admin1", name: "admin" }}
      onSubmit={vi.fn()}
    />,
  );
  await userEvent.click(
    screen.getByRole("button", { name: /Edit entitlements/ }),
  );
  await screen.findByText(EntitlementsPanelFormLabel.ADD_ENTITLEMENT);
  await userEvent.click(
    screen.getAllByRole("button", {
      name: EntitlementsPanelFormLabel.REMOVE,
    })[0],
  );
  await userEvent.click(
    screen.getAllByRole("button", { name: "Update role" })[0],
  );
  expect(
    screen.getByRole("button", { name: "Update role" }),
  ).not.toBeDisabled();
});
