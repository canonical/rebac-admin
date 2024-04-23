import { screen, act } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { vi } from "vitest";

import { Label as EntitlementsPanelFormLabel } from "components/EntitlementsPanelForm";
import { renderComponent } from "test/utils";

import { Label as IdentitiesPanelFormLabel } from "../IdentitiesPanelForm";
import { Label as RolesPanelFormLabel } from "../RolesPanelForm";

import GroupPanel from "./GroupPanel";
import { Label } from "./types";

test("can submit the form", async () => {
  const onSubmit = vi.fn();
  renderComponent(<GroupPanel close={vi.fn()} onSubmit={onSubmit} />);
  await act(
    async () =>
      await userEvent.type(
        screen.getByRole("textbox", { name: Label.NAME }),
        "group1{Enter}",
      ),
  );
  expect(onSubmit).toHaveBeenCalled();
});

test("the input is disabled when editing", async () => {
  renderComponent(
    <GroupPanel close={vi.fn()} groupId="admin" onSubmit={vi.fn()} />,
  );
  expect(screen.getByRole("textbox", { name: Label.NAME })).toBeDisabled();
});

test("the entitlement form can be displayed", async () => {
  renderComponent(<GroupPanel close={vi.fn()} onSubmit={vi.fn()} />);
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

test("the user form can be displayed", async () => {
  renderComponent(<GroupPanel close={vi.fn()} onSubmit={vi.fn()} />);
  await act(
    async () =>
      await userEvent.click(screen.getByRole("button", { name: /Add users/ })),
  );
  expect(
    screen.getByRole("form", { name: IdentitiesPanelFormLabel.FORM }),
  ).toBeInTheDocument();
});

test("the role form can be displayed", async () => {
  renderComponent(<GroupPanel close={vi.fn()} onSubmit={vi.fn()} />);
  await act(
    async () =>
      await userEvent.click(screen.getByRole("button", { name: /Add roles/ })),
  );
  expect(
    screen.getByRole("form", { name: RolesPanelFormLabel.FORM }),
  ).toBeInTheDocument();
});

test("submit button is disabled when editing and there are no changes", async () => {
  renderComponent(
    <GroupPanel
      close={vi.fn()}
      existingEntitlements={[
        "can_edit::moderators:collection",
        "can_remove::staff:team",
      ]}
      groupId="admin"
      onSubmit={vi.fn()}
    />,
  );
  expect(screen.getByRole("button", { name: "Update group" })).toBeDisabled();
});

test("submit button is enabled when editing and there are changes", async () => {
  renderComponent(
    <GroupPanel
      close={vi.fn()}
      existingEntitlements={[
        "can_edit::moderators:collection",
        "can_remove::staff:team",
      ]}
      groupId="admin"
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
        screen.getAllByRole("button", { name: "Update group" })[0],
      ),
  );
  expect(
    screen.getByRole("button", { name: "Update group" }),
  ).not.toBeDisabled();
});
