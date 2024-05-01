import { screen, act } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { vi } from "vitest";

import { Label as EntitlementsPanelFormLabel } from "components/EntitlementsPanelForm";
import { renderComponent } from "test/utils";

import RolePanel from "./RolePanel";
import { Label } from "./types";

test("can submit the form", async () => {
  const onSubmit = vi.fn();
  renderComponent(
    <RolePanel close={vi.fn()} setPanelWidth={vi.fn()} onSubmit={onSubmit} />,
  );
  await act(
    async () =>
      await userEvent.type(
        screen.getByRole("textbox", { name: Label.NAME }),
        "role1{Enter}",
      ),
  );
  expect(onSubmit).toHaveBeenCalled();
});

test("the input is disabled when editing", async () => {
  renderComponent(
    <RolePanel
      close={vi.fn()}
      setPanelWidth={vi.fn()}
      roleId="admin"
      onSubmit={vi.fn()}
    />,
  );
  expect(screen.getByRole("textbox", { name: Label.NAME })).toBeDisabled();
});

test("the entitlement form can be displayed", async () => {
  renderComponent(
    <RolePanel close={vi.fn()} setPanelWidth={vi.fn()} onSubmit={vi.fn()} />,
  );
  await act(
    async () =>
      await userEvent.click(
        screen.getByRole("button", { name: /Add entitlements/ }),
      ),
  );
  expect(
    screen.getByRole("form", { name: EntitlementsPanelFormLabel.FORM }),
  ).toBeInTheDocument();
});

test("submit button is disabled when editing and there are no changes", async () => {
  renderComponent(
    <RolePanel
      close={vi.fn()}
      setPanelWidth={vi.fn()}
      existingEntitlements={[
        "can_edit::moderators:collection",
        "can_remove::staff:team",
      ]}
      roleId="admin"
      onSubmit={vi.fn()}
    />,
  );
  expect(screen.getByRole("button", { name: "Update role" })).toBeDisabled();
});

test("submit button is enabled when editing and there are changes", async () => {
  renderComponent(
    <RolePanel
      close={vi.fn()}
      setPanelWidth={vi.fn()}
      existingEntitlements={[
        "can_edit::moderators:collection",
        "can_remove::staff:team",
      ]}
      roleId="admin"
      onSubmit={vi.fn()}
    />,
  );
  await act(
    async () =>
      await userEvent.click(
        screen.getByRole("button", { name: /Edit entitlements/ }),
      ),
  );
  await act(
    async () =>
      await userEvent.click(
        screen.getAllByRole("button", {
          name: EntitlementsPanelFormLabel.REMOVE,
        })[0],
      ),
  );
  await act(
    async () =>
      await userEvent.click(
        screen.getAllByRole("button", { name: "Update role" })[0],
      ),
  );
  expect(
    screen.getByRole("button", { name: "Update role" }),
  ).not.toBeDisabled();
});
