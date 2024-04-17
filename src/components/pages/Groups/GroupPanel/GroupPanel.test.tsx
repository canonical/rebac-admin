import { screen, act } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { vi } from "vitest";

import { Label as EntitlementsPanelFormLabel } from "components/EntitlementsPanelForm";
import { renderComponent } from "test/utils";

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
