import { screen, act } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { vi } from "vitest";

import { Label as EntitlementsPanelFormLabel } from "components/EntitlementsPanelForm";
import { renderComponent } from "test/utils";

import RolePanel from "./RolePanel";
import { Label } from "./types";

test("can submit the form", async () => {
  const onSubmit = vi.fn();
  renderComponent(<RolePanel close={vi.fn()} onSubmit={onSubmit} />);
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
    <RolePanel close={vi.fn()} roleId="admin" onSubmit={vi.fn()} />,
  );
  expect(screen.getByRole("textbox", { name: Label.NAME })).toBeDisabled();
});

test("the entitlement form can be displayed", async () => {
  renderComponent(
    <RolePanel close={vi.fn()} roleId="admin" onSubmit={vi.fn()} />,
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
