import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { setupServer } from "msw/node";
import { vi } from "vitest";

import { getGetEntitlementsMockHandler } from "api/entitlements/entitlements.msw";
import { Label as EntitlementsPanelFormLabel } from "components/EntitlementsPanelForm";
import { renderComponent } from "test/utils";

import RolePanel from "./RolePanel";
import { Label } from "./types";

test("the input is set from the name", async () => {
  renderComponent(
    <RolePanel
      close={vi.fn()}
      setPanelWidth={vi.fn()}
      role={{ id: "admin1", name: "admin" }}
      onSubmit={vi.fn()}
    />,
  );
  expect(screen.getByRole("textbox", { name: Label.NAME })).toHaveValue(
    "admin",
  );
});

test("can submit the form", async () => {
  const onSubmit = vi.fn();
  renderComponent(
    <RolePanel close={vi.fn()} setPanelWidth={vi.fn()} onSubmit={onSubmit} />,
  );
  await userEvent.type(
    screen.getByRole("textbox", { name: Label.NAME }),
    "role1{Enter}",
  );
  expect(onSubmit).toHaveBeenCalled();
});

test("the input is disabled when editing", async () => {
  renderComponent(
    <RolePanel
      close={vi.fn()}
      isEditing
      setPanelWidth={vi.fn()}
      role={{ id: "admin1", name: "admin" }}
      onSubmit={vi.fn()}
    />,
  );
  expect(screen.getByRole("textbox", { name: Label.NAME })).toBeDisabled();
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
  await screen.findByText("Add entitlement tuple");
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
          entitlement_type: "can_edit",
          entity_name: "moderators",
          entity_type: "collection",
        },
        {
          entitlement_type: "can_remove",
          entity_name: "staff",
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
  const mockApiServer = setupServer(getGetEntitlementsMockHandler());
  mockApiServer.listen();
  renderComponent(
    <RolePanel
      close={vi.fn()}
      isEditing
      setPanelWidth={vi.fn()}
      existingEntitlements={[
        {
          entitlement_type: "can_edit",
          entity_name: "moderators",
          entity_type: "collection",
        },
        {
          entitlement_type: "can_remove",
          entity_name: "staff",
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
  await screen.findByText("Add entitlement tuple");
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
  mockApiServer.close();
});
